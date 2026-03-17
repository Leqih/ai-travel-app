import { AppFrame } from "@/components/AppFrame";
import { ProfilePageSection } from "@/components/PageSections";

export default function ProfilePage() {
  return (
    <AppFrame activePath="/profile">
      <ProfilePageSection />
    </AppFrame>
  );
}
