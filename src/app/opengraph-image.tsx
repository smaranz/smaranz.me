import { ImageResponse } from "next/og";

// The link preview: the site's home screen as a still, no photo.
export const alt =
  "Smaran Aramballi Sandarsh: ask my agent anything about what I build";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "#1b1b1b",
        color: "#ececec",
        fontFamily: "sans-serif",
      }}
    >
      {/* window chrome */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: "28px 36px",
        }}
      >
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
          <div
            key={c}
            style={{ width: 16, height: 16, borderRadius: 999, background: c }}
          />
        ))}
        <div style={{ marginLeft: "auto", fontSize: 24, color: "#6e6e6e" }}>
          smaranz.me
        </div>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          marginTop: -30,
        }}
      >
        <svg
          width="92"
          height="92"
          viewBox="0 0 64 64"
          fill="none"
          stroke="#9b9b9b"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="6" y="10" width="52" height="44" rx="14" />
          <path d="M21 26l7 6-7 6" />
          <path d="M33 39h10" />
        </svg>
        <div
          style={{
            display: "flex",
            marginTop: 34,
            fontSize: 56,
            letterSpacing: -1,
          }}
        >
          <span>What do you want to know about&nbsp;</span>
          <span
            style={{ borderBottom: "3px dashed #6e6e6e", paddingBottom: 2 }}
          >
            Smaran
          </span>
          <span>?</span>
        </div>
        <div style={{ marginTop: 16, fontSize: 28, color: "#9b9b9b" }}>
          Smaran Aramballi Sandarsh · 15 · builds AI agents, apps, and
          hackathons
        </div>

        {/* composer */}
        <div
          style={{
            marginTop: 48,
            width: 820,
            height: 92,
            borderRadius: 30,
            background: "#2f2f2f",
            display: "flex",
            alignItems: "center",
            padding: "0 18px 0 32px",
          }}
        >
          <span style={{ fontSize: 28, color: "#6e6e6e" }}>
            Ask anything about Smaran
          </span>
          <div
            style={{
              marginLeft: "auto",
              width: 56,
              height: 56,
              borderRadius: 999,
              background: "#3f76ee",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>,
    size,
  );
}
