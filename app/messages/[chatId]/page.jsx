import { AppFrame } from "@/components/AppFrame";
import { ChatDetailPage } from "@/components/ChatDetailPage";

export default function ChatDetailRoute({ params }) {
  const { chatId } = params;

  return (
    <AppFrame activePath="/messages">
      <ChatDetailPage chatId={chatId} />
    </AppFrame>
  );
}
