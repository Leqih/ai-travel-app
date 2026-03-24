import "./globals.css";

export const metadata = {
  title: "Campus Nest",
  description: "Student-focused housing and sublet app prototype."
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN" style={{ background: "#09090f" }}>
      <body style={{ background: "#0f0f18" }}>
        {children}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="https://mcp.figma.com/mcp/html-to-design/capture.js" async></script>
      </body>
    </html>
  );
}
