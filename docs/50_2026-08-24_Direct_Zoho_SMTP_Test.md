# Direct Zoho SMTP verification

Date: 24 August 2026

Purpose: replace the Make.com-only editorial notification dependency with a direct Rugby Panda -> Zoho EU SMTP path.

Configured production environment expected:
- `ZOHO_SMTP_HOST=smtp.zoho.eu`
- `ZOHO_SMTP_PORT=465`
- `ZOHO_SMTP_USER=<sender mailbox>`
- `ZOHO_SMTP_PASSWORD=<Zoho app-specific password>`
- `EDITORIAL_EMAIL_TO=editor@therugbypanda.ie`

Implementation branch: `feat/direct-zoho-mail`.

Verification design:
- direct implicit-TLS SMTP sender;
- one-shot production-only verification endpoint;
- fixed recipient from `EDITORIAL_EMAIL_TO`;
- Sanity-backed one-shot lock prevents repeated sends from the temporary endpoint;
- after successful production verification, remove the temporary test route and retain only the reusable sender/orchestration integration.

Completion boundary: do not retire Make.com until direct SMTP acceptance and owner receipt are both verified.
