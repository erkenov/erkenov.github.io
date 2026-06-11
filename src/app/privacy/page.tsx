export const metadata = {
  title: "Privacy Policy — Erken Guide",
  description: "How the Erken Guide browser extension handles your data.",
};

export default function PrivacyPage() {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px", color: "#EAF3EC", background: "#0d1322", minHeight: "100vh", fontFamily: "-apple-system, Segoe UI, Roboto, sans-serif", lineHeight: 1.6 }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>Privacy Policy — Erken Guide</h1>
      <p style={{ color: "#a0a0b8", marginBottom: 28 }}>Last updated: 11 June 2026</p>

      <p>Erken is a browser extension that helps you operate your Erken Systems business platform by pointing at the right buttons on your screen and explaining what to do.</p>

      <h2 style={{ fontSize: 20, marginTop: 28 }}>What the extension accesses</h2>
      <p>When you ask Erken a question, the extension reads only the <strong>text labels of the clickable buttons and menu items currently visible on your platform page</strong> (e.g. &quot;Opportunities&quot;, &quot;Create Pipeline&quot;) and the <strong>question you type or speak</strong>. It does not read your contacts, messages, customer records, form contents, or any other page data.</p>

      <h2 style={{ fontSize: 20, marginTop: 28 }}>How that information is used</h2>
      <p>Your question and the list of visible button labels are sent over an encrypted connection to our server (erken.systems) solely to determine which button you should click next and to generate the guidance shown to you. The response is returned to your browser and displayed. We use this data only to provide the guidance you requested in that moment.</p>

      <h2 style={{ fontSize: 20, marginTop: 28 }}>What we do not do</h2>
      <ul>
        <li>We do not sell or share your data with third parties for advertising.</li>
        <li>We do not build advertising or marketing profiles.</li>
        <li>We do not collect your platform login, passwords, or customer records.</li>
        <li>We do not store your questions or screen contents to track you.</li>
      </ul>

      <h2 style={{ fontSize: 20, marginTop: 28 }}>Third-party processing</h2>
      <p>To generate guidance, our server passes your question and the button labels to AI providers (Anthropic and OpenAI) under their standard API terms. They process this data to return a result and do not use it to train their models.</p>

      <h2 style={{ fontSize: 20, marginTop: 28 }}>Contact</h2>
      <p>Questions about this policy: <a href="mailto:shamil.erkenovv@gmail.com" style={{ color: "#7ea687" }}>shamil.erkenovv@gmail.com</a>.</p>
    </main>
  );
}
