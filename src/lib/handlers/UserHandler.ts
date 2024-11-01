import type { APIContext } from "astro";
import { auth } from "../auth";
import { cacheResult } from "../helpers/cache";
import { hashedString } from "../helpers/generators";

export class UserHandler {
  static async getAuthentificatedUser(context: APIContext) {
    const authentificatedUser = await auth.api.getSession({
      headers: context.request.headers,
    });
    return authentificatedUser?.user;
  }
}
