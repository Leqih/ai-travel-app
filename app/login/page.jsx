import { AppFrame } from "@/components/AppFrame";
import { AuthPage } from "@/components/AuthPage";

export default function LoginPage() {
  return (
    <AppFrame activePath="">
      <AuthPage />
    </AppFrame>
  );
}
