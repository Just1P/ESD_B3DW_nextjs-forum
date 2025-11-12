import ConversationForm from "@/components/app/conversation/ConversationForm";
import ConversationListWithSort from "@/components/app/conversation/ConversationListWithSort";
import { isAuthenticated } from "@/lib/session";

export default async function Home() {
  const isAuth = await isAuthenticated();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto pt-6 pb-12">
        {isAuth && (
          <div className="mb-4 px-4">
            <div className="bg-white border border-gray-200 rounded-md p-4 hover:border-gray-300 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-gray-400 text-xl">+</span>
                </div>
                <h2 className="text-base font-medium text-gray-700">
                  Créer une nouvelle conversation
                </h2>
              </div>
              <ConversationForm />
            </div>
          </div>
        )}

        <ConversationListWithSort />
      </div>
    </div>
  );
}
