import { Suspense } from "react";
import { LaborAppPrototype } from "@/components/LaborAppPrototype";

export const metadata = {
  title: "劳务用工驻场管理 APP",
  description: "驻场管理 APP 移动端原型"
};

export default function LaborAppPage() {
  return (
    <Suspense fallback={<div style={{ background: "#0a0a0a", minHeight: "100dvh" }} />}>
      <LaborAppPrototype />
    </Suspense>
  );
}
