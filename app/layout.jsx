import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata = {
  title: "Campus Nest",
  description: "Student-focused housing and sublet app prototype."
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN" className={cn("font-sans", geist.variable)}>
      <body>
        {children}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="https://mcp.figma.com/mcp/html-to-design/capture.js" async></script>
      </body>
    </html>
  );
}
