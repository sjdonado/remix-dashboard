import { createCookieSessionStorage } from "@remix-run/node";
import { eq } from "drizzle-orm";
import { Authenticator, AuthorizationError } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { db } from "~/db/config.server";
import { users } from "~/db/schema.server";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET!],
    secure: process.env.NODE_ENV === "production",
  },
});

export const auth = new Authenticator<string>(sessionStorage);

auth.use(
  new FormStrategy(async ({ form }) => {
    const email = form.get("email")!.toString();
    const password = form.get("password")!.toString();

    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);

    if (!(user && await Bun.password.verify(password, user.password))) {
      throw new AuthorizationError("Invalid credentials");
    }

    return email;
  }),
);
