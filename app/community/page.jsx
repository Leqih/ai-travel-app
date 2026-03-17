import { AppFrame } from "@/components/AppFrame";
import { CommunityPageSection } from "@/components/PageSections";

export default function CommunityPage() {
  return (
    <AppFrame activePath="/community">
      <CommunityPageSection />
    </AppFrame>
  );
}
