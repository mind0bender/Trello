import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

import pg from "pg";
import { IS_DEV } from "../utils/constants";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
});
const adapter = new PrismaPg(pool);

const prisma =
  global.prisma ||
  new PrismaClient({
    adapter,
  });

if (IS_DEV) {
  global.prisma = prisma;
}

export default prisma;
