import { AppFrame } from "@/components/AppFrame";
import { DetailClient } from "@/components/DetailClient";

export default function DetailPage() {
  return (
    <AppFrame activePath="/detail">
      <DetailClient />
    </AppFrame>
  );
}
