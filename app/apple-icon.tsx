import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "center",
          background: "#003D2B",
          color: "#F8FAFC",
          display: "flex",
          flexDirection: "column",
          fontWeight: 900,
          height: "100%",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <div style={{ fontSize: 76, letterSpacing: "-0.1em", lineHeight: 1 }}>RP</div>
        <div style={{ color: "#9BE564", fontSize: 18, letterSpacing: "0.08em", marginTop: 8 }}>RUGBY</div>
      </div>
    ),
    size,
  );
}
