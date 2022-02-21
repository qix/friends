import { PrismaClient } from "@prisma/client";

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
  });

  // `next dev` clears the cache, so outside of production we keep a global
  // cache of the prisma client
  if (process.env.NODE_ENV !== "production") {
    global.prisma = client;
  }
  return client;
}
