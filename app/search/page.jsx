import { AppFrame } from "@/components/AppFrame";
import { SearchClient } from "@/components/SearchClient";

export default function SearchPage() {
  return (
    <AppFrame activePath="/search">
      <SearchClient />
    </AppFrame>
  );
}
