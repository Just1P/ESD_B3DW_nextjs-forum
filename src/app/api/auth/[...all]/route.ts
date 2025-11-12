import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    return await auth.handler(request);
  } catch (error) {
    console.error("❌ Erreur dans GET /api/auth:", error);
    return new Response(
      JSON.stringify({
        error: "Erreur serveur",
        message: error instanceof Error ? error.message : "Erreur inconnue",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function POST(request: Request) {
  try {
    return await auth.handler(request);
  } catch (error) {
    console.error("❌ Erreur dans POST /api/auth:", error);
    return new Response(
      JSON.stringify({
        error: "Erreur serveur",
        message: error instanceof Error ? error.message : "Erreur inconnue",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
