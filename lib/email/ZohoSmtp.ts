import tls from "node:tls";

type MailInput = {
  to?: string;
  subject: string;
  text: string;
};

type SmtpResponse = {
  code: number;
  lines: string[];
};

function requiredEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} is not configured.`);
  return value;
}

function dotStuff(value: string): string {
  return value.replace(/(^|\r?\n)\./g, "$1..");
}

function normaliseBody(value: string): string {
  return dotStuff(value.replace(/\r?\n/g, "\r\n"));
}

function encodeSubject(value: string): string {
  return /^[\x20-\x7E]*$/.test(value)
    ? value
    : `=?UTF-8?B?${Buffer.from(value, "utf8").toString("base64")}?=`;
}

export async function sendZohoMail(input: MailInput) {
  const host = process.env.ZOHO_SMTP_HOST?.trim() || "smtp.zoho.eu";
  const port = Number(process.env.ZOHO_SMTP_PORT || "465");
  const user = requiredEnv("ZOHO_SMTP_USER");
  const password = requiredEnv("ZOHO_SMTP_PASSWORD");
  const to = input.to?.trim() || requiredEnv("EDITORIAL_EMAIL_TO");

  if (port !== 465) {
    throw new Error("Direct Zoho SMTP sender currently requires implicit TLS on port 465.");
  }

  return new Promise<{ accepted: string; response: string }>((resolve, reject) => {
    const socket = tls.connect({ host, port, servername: host, rejectUnauthorized: true });
    socket.setTimeout(20_000);

    let buffer = "";
    let waiter: ((response: SmtpResponse) => void) | null = null;
    let waiterReject: ((error: Error) => void) | null = null;

    const cleanup = () => {
      waiter = null;
      waiterReject = null;
    };

    const fail = (error: Error) => {
      cleanup();
      if (!socket.destroyed) socket.destroy();
      reject(error);
    };

    const consume = () => {
      if (!waiter) return;
      const lines = buffer.split("\r\n");
      if (lines.length < 2) return;

      const completeIndex = lines.findIndex((line) => /^\d{3} /.test(line));
      if (completeIndex < 0) return;

      const responseLines = lines.slice(0, completeIndex + 1);
      buffer = lines.slice(completeIndex + 1).join("\r\n");
      const code = Number(responseLines.at(-1)?.slice(0, 3));
      const resolveWaiter = waiter;
      cleanup();
      resolveWaiter({ code, lines: responseLines });
    };

    socket.on("data", (chunk) => {
      buffer += chunk.toString("utf8");
      consume();
    });
    socket.on("timeout", () => fail(new Error("Zoho SMTP connection timed out.")));
    socket.on("error", (error) => fail(error instanceof Error ? error : new Error(String(error))));

    const readResponse = () => new Promise<SmtpResponse>((responseResolve, responseReject) => {
      waiter = responseResolve;
      waiterReject = responseReject;
      consume();
    });

    const expect = async (allowed: number[]) => {
      const response = await readResponse();
      if (!allowed.includes(response.code)) {
        throw new Error(`Zoho SMTP returned ${response.code}: ${response.lines.join(" | ")}`);
      }
      return response;
    };

    const command = async (value: string, allowed: number[]) => {
      socket.write(`${value}\r\n`);
      return expect(allowed);
    };

    void (async () => {
      try {
        await expect([220]);
        await command("EHLO therugbypanda.ie", [250]);
        await command("AUTH LOGIN", [334]);
        await command(Buffer.from(user, "utf8").toString("base64"), [334]);
        await command(Buffer.from(password, "utf8").toString("base64"), [235]);
        await command(`MAIL FROM:<${user}>`, [250]);
        await command(`RCPT TO:<${to}>`, [250, 251]);
        await command("DATA", [354]);

        const message = [
          `From: The Rugby Panda <${user}>`,
          `To: ${to}`,
          `Subject: ${encodeSubject(input.subject)}`,
          `Date: ${new Date().toUTCString()}`,
          "MIME-Version: 1.0",
          "Content-Type: text/plain; charset=UTF-8",
          "Content-Transfer-Encoding: 8bit",
          "",
          normaliseBody(input.text),
          ".",
          "",
        ].join("\r\n");

        socket.write(message);
        const accepted = await expect([250]);
        socket.write("QUIT\r\n");
        socket.end();
        resolve({ accepted: to, response: accepted.lines.join(" | ") });
      } catch (error) {
        fail(error instanceof Error ? error : new Error(String(error)));
      }
    })();
  });
}
