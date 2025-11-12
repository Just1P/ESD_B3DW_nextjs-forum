import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

async function main() {
  console.log("🌱 Début du seeding...");

  await prisma.vote.deleteMany();
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();

  console.log("🗑️  Base de données nettoyée");

  const hashedPassword = await bcrypt.hash("Test1234", 10);

  const justin = await prisma.user.create({
    data: {
      name: "Justin",
      email: "justin.pitra@gmail.com",
      emailVerified: true,
    },
  });

  await prisma.account.create({
    data: {
      id: `${justin.id}_credential`,
      accountId: justin.id,
      providerId: "credential",
      userId: justin.id,
      password: hashedPassword,
    },
  });

  console.log("✅ Utilisateur Justin créé");
  const conversations = [
    {
      title: "Meilleure période pour visiter le Japon ?",
      messages: [
        "Je prévois un voyage au Japon l'année prochaine. Quelle est la meilleure période selon vous ? J'hésite entre le printemps et l'automne.",
        "Le printemps (mars-avril) pour les cerisiers en fleurs, c'est magique ! Par contre c'est très touristique. L'automne est superbe aussi avec les feuilles rouges.",
        "J'y suis allé en novembre, c'était parfait ! Températures agréables, moins de touristes et les couleurs d'automne sont incroyables. Je recommande vraiment cette période.",
      ],
    },
    {
      title: "Road trip en Islande : conseils et itinéraire",
      messages: [
        "On part faire le tour de l'Islande en van cet été. Des recommandations de spots incontournables ? On a 2 semaines.",
        "La côte sud est magnifique ! Ne ratez pas Jökulsárlón (le lagon glaciaire), c'est juste époustouflant. Prévoyez aussi du temps pour les sources chaudes.",
        "Pour le nord, Myvatn vaut vraiment le détour. Et pensez à réserver vos campings à l'avance en été, ça se remplit vite ! Bon voyage !",
      ],
    },
    {
      title: "Budget backpacking en Asie du Sud-Est",
      messages: [
        "Je prépare 3 mois de backpacking en Asie du Sud-Est (Thaïlande, Vietnam, Cambodge). Quel budget prévoir par jour en mode routard ?",
        "Compte 20-30€/jour en mode vraiment routard : dortoirs, street food, transports locaux. Tu peux descendre à 15€ si tu fais gaffe, surtout au Cambodge.",
        "J'ai fait 2 mois avec 25€/jour de moyenne. C'était confortable : parfois des chambres privées, quelques restos, et des activités sympas. Très faisable !",
      ],
    },
  ];

  for (const conv of conversations) {
    const conversation = await prisma.conversation.create({
      data: {
        title: conv.title,
        userId: justin.id,
      },
    });

    console.log(`📝 Conversation créée: ${conv.title}`);

    for (let i = 0; i < conv.messages.length; i++) {
      await prisma.message.create({
        data: {
          content: conv.messages[i],
          conversationId: conversation.id,
          userId: justin.id,
        },
      });
    }

    console.log(`   💬 ${conv.messages.length} messages ajoutés`);

    if (conversations.indexOf(conv) === 0) {
      await prisma.vote.create({
        data: {
          type: "UP",
          userId: justin.id,
          conversationId: conversation.id,
        },
      });
    }
  }

  console.log("✅ Seeding terminé avec succès !");
  console.log("\n📧 Email: justin.pitra@gmail.com");
  console.log("🔑 Mot de passe: Test1234");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Erreur lors du seeding:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
