import { AppFrame } from "@/components/AppFrame";
import { SavedPage } from "@/components/SavedPage";

export default function SavedRoute() {
  return (
    <AppFrame activePath="/saved">
      <SavedPage />
    </AppFrame>
  );
}
