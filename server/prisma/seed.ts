import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import pg from "pg";

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  // 👤 Members
  const allMembers = await prisma.member.createManyAndReturn({
    data: [
      { name: "Alice", email: "alice@test.com" },
      { name: "Bob", email: "bob@test.com" },
      { name: "Charlie", email: "charlie@test.com" },
    ],
  });

  // 🏷️ Labels
  const allLabels = await prisma.label.createManyAndReturn({
    data: [
      { name: "Bug", color: "red" },
      { name: "Feature", color: "green" },
      { name: "Improvement", color: "blue" },
    ],
  });

  // 📋 Board
  const board = await prisma.board.create({
    data: {
      title: "Project Alpha",
      background: "gradient-blue",
    },
  });

  // 📑 Lists
  const todo = await prisma.list.create({
    data: {
      title: "To Do",
      position: 1,
      boardId: board.id,
    },
  });

  const doing = await prisma.list.create({
    data: {
      title: "In Progress",
      position: 2,
      boardId: board.id,
    },
  });

  const done = await prisma.list.create({
    data: {
      title: "Done",
      position: 3,
      boardId: board.id,
    },
  });

  // 🃏 Cards
  const card1 = await prisma.card.create({
    data: {
      title: "Setup project structure",
      description: "Initialize repo and folder structure",
      position: 1,
      listId: todo.id,
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    },
  });

  const card2 = await prisma.card.create({
    data: {
      title: "Implement drag & drop",
      description: "Use dnd-kit for smooth UX",
      position: 1,
      listId: doing.id,
    },
  });

  const card3 = await prisma.card.create({
    data: {
      title: "Design database schema",
      description: "Normalize relations and optimize queries",
      position: 1,
      listId: done.id,
    },
  });

  // 👥 Assign Members
  await prisma.cardMember.createMany({
    data: [
      { cardId: card1.id, memberId: allMembers[0]!.id },
      { cardId: card2.id, memberId: allMembers[1]!.id },
      { cardId: card3.id, memberId: allMembers[2]!.id },
    ],
  });

  // 🏷️ Assign Labels
  await prisma.cardLabel.createMany({
    data: [
      { cardId: card1.id, labelId: allLabels[1]!.id },
      { cardId: card2.id, labelId: allLabels[0]!.id },
      { cardId: card3.id, labelId: allLabels[2]!.id },
    ],
  });

  // ✅ Checklist
  await prisma.checklistItem.createMany({
    data: [
      {
        content: "Create folders",
        done: true,
        position: 1,
        cardId: card1.id,
      },
      {
        content: "Setup routing",
        done: false,
        position: 2,
        cardId: card1.id,
      },
    ],
  });

  console.log("🌱 Database seeded successfully!");
}

main()
  .catch((e: Error): void => {
    console.error(e);
    process.exit(1);
  })
  .finally(async (): Promise<void> => {
    await prisma.$disconnect();
  });
