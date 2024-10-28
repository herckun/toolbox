import type { APIContext } from "astro";
import { auth } from "../auth";

export class UserHandler {
  static async getAuthentificatedUser(context: APIContext) {
    const authentificatedUser = await auth.api.getSession({
      headers: context.request.headers,
    });
    return authentificatedUser?.user;
  }
}