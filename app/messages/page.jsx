import { AppFrame } from "@/components/AppFrame";
import { MessagesPage } from "@/components/MessagesPage";

export default function MessagesRoute() {
  return (
    <AppFrame activePath="/messages">
      <MessagesPage />
    </AppFrame>
  );
}
