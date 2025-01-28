import { drizzle } from "drizzle-orm/node-postgres";
import "dotenv/config";

import env from "@/config/env";

export const db = drizzle(env.DATABASE_URL);
