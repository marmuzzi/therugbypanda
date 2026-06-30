export default function Home() {
  return (
    <main style={{
      minHeight: "100vh",
      background: "#050505",
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "24px"
    }}>
      <section>
        <img
          src="/rugby-panda-coming-soon.png"
          alt="The Rugby Panda"
          style={{
            maxWidth: "100%",
            width: "900px",
            borderRadius: "12px"
          }}
        />

        <div style={{ marginTop: "24px", display: "flex", gap: "24px", justifyContent: "center" }}>
          <a href="https://instagram.com/therugbypanda" style={{ color: "white" }}>Instagram</a>
          <a href="https://x.com/therugbypanda" style={{ color: "white" }}>X</a>
          <a href="https://facebook.com/therugbypanda" style={{ color: "white" }}>Facebook</a>
        </div>
      </section>
    </main>
  );
}
