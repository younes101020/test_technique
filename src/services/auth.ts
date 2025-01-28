import type { Context } from "hono";

import { eq } from "drizzle-orm";
import { deleteCookie, setCookie } from "hono/cookie";
import { HTTPException } from "hono/http-exception";
import { sign } from "hono/jwt";
import { Buffer } from "node:buffer";
import { pbkdf2, pbkdf2Sync, randomBytes, timingSafeEqual } from "node:crypto";
import * as HttpStatusCodes from "stoker/http-status-codes";

import env from "@/config/env";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

export class AuthService {
  async login(email: string, password: string, c: Context) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (!user) {
      throw new HTTPException(HttpStatusCodes.UNAUTHORIZED, {
        message: "Invalid credentials",
      });
    }

    const passwordMatch = await this.comparePassword(password, user.password);

    if (!passwordMatch) {
      throw new HTTPException(HttpStatusCodes.UNAUTHORIZED, {
        message: "Invalid credentials",
      });
    }

    const expiresInOneDay = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const jwtPayload = {
      sub: user.id,
      role: user.role,
      exp: expiresInOneDay,
    };
    const jwtToken = await this.createJwt(jwtPayload);
    this.addSessionToCookie(c, jwtToken, expiresInOneDay);

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async register(name: string, email: string, password: string, age: number, c: Context) {
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length) {
      throw new HTTPException(HttpStatusCodes.CONFLICT, {
        message: "User already exists",
      });
    }

    const hashedPassword = await this.hashPassword(password);

    const [user] = await db
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
        age,
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        age: users.age,
        role: users.role,
      });

    const expiresInOneDay = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const jwtPayload = {
      sub: user.id,
      role: user.role,
      exp: expiresInOneDay,
    };
    const jwtToken = await this.createJwt(jwtPayload);
    this.addSessionToCookie(c, jwtToken, expiresInOneDay);

    return user;
  }

  logout(c: Context) {
    this.deleteSessionFromCookie(c);
  }

  private hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16).toString("hex");

    return new Promise((resolve, reject) => {
      pbkdf2(password, salt, 10000, 64, "sha512", (err, hash) => {
        if (err)
          reject(err);
        resolve(`${salt}:${hash.toString("hex")}`);
      });
    });
  }

  private comparePassword(password: string, storedHash: string) {
    const [salt, hash] = storedHash.split(":");

    return new Promise((resolve, reject) => {
      pbkdf2(password, salt, 10000, 64, "sha512", (err, derivedKey) => {
        if (err)
          reject(err);
        resolve(derivedKey.toString("hex") === hash);
      });
    });
  }

  private createJwt = (payload: Record<string, string | number | Date>) => {
    return sign(payload, env.AUTH_SECRET);
  };

  private addSessionToCookie = async (c: Context, tokenJwt: string, expires: Date) => {
    setCookie(c, "session", tokenJwt, {
      secure: true,
      httpOnly: true,
      sameSite: "lax",
      expires,
    });
  };

  private deleteSessionFromCookie = (c: Context) => {
    deleteCookie(c, "session", {
      secure: true,
    });
  };
}
