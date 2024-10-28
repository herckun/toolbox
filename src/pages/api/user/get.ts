import type { APIContext } from "astro";
import { UserHandler } from "../../../lib/handlers/UserHandler";

export const GET = async (context: APIContext) => {
  try {
    const user = await UserHandler.getAuthentificatedUser(context);
    return new Response(
      JSON.stringify({
        id: user?.id,
        name: user?.name,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        message: "Could not get user",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
};
