import { AppFrame } from "@/components/AppFrame";
import { MapPage } from "@/components/MapPage";

export default function MapRoute() {
  return (
    <AppFrame activePath="/map">
      <MapPage />
    </AppFrame>
  );
}
