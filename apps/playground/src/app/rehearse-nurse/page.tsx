export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <div style={{ minHeight: "100dvh", margin: 0, padding: 0, background: "#0f1419" }}>
      <iframe
        src="/static/hk-trainer.html"
        style={{ border: "none", width: "100vw", height: "100dvh", display: "block" }}
        title="HK Hand Hygiene Trainer"
        allow="camera; microphone"
      />
    </div>
  );
}
