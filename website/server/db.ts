import { PrismaClient } from "@prisma/client";
import { invariant } from "./invariant";

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export function getPrismaClient() {
  if (global.prisma) {
    return global.prisma;
  }

  const client = new PrismaClient({
    log: ["query"],

    // Overwrite the database url if planetscale injected one
    datasources: process.env.PLANETSCALE_PRISMA_DATABASE_URL
      ? {
          db: {
            url: process.env.PLANETSCALE_PRISMA_DATABASE_URL,
          },
        }
      : undefined,
  });

  // `next dev` clears the cache, so outside of production we keep a global
  // cache of the prisma client
  if (process.env.NODE_ENV !== "production") {
    global.prisma = client;
  }
  return client;
}
