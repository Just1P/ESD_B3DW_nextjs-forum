import { prisma } from "@/libs/prisma";

const NB_CONVERSATION = 10;
const NB_MESSAGE_PER_CONVERSATION = 5;

async function main() {
  for (let i = 0; i < NB_CONVERSATION; i++) {
    await prisma.conversation.create({
      data: {
        title: `Title ${i}`,
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Succes to insert seeds !");
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
