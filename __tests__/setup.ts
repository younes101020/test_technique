import { drizzle } from "drizzle-orm/node-postgres";
import { reset, seed } from "drizzle-seed";
import { execSync } from "node:child_process";

import env from "@/config/env";
import * as schema from "@/lib/db/schema";

let teardownHappened = false;
let setupHappened = false;

export async function setup() {
  if (env.NODE_ENV !== "test") {
    throw new Error("NODE_ENV must be 'test'");
  }
  if (!setupHappened) {
    execSync("yarn db:test:push");
    const db = drizzle(env.DATABASE_URL);
    await seed(db, schema, { count: 60 });
  }
  setupHappened = true;
}

export async function teardown() {
  if (teardownHappened) {
    throw new Error("teardown already happened");
  }
  teardownHappened = true;
  const db = drizzle(env.DATABASE_URL);
  await reset(db, schema);
}
