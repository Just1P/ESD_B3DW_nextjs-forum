import ConversationForm from "@/components/app/conversation/ConversationForm";
import ConversationList from "@/components/app/conversation/ConversationList";
import { isAuthenticated } from "@/lib/session";

export default async function Home() {
  const isAuth = await isAuthenticated();

  return (
    <div className="pt-4">
      {isAuth && (
        <div className="mb-8 container mx-auto">
          <h2 className="text-2xl font-semibold mb-4">
            Créer une nouvelle conversation
          </h2>
          <ConversationForm />
        </div>
      )}
      <ConversationList />
    </div>
  );
}
