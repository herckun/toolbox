import type { APIContext } from "astro";
import { Userhandler } from "../../../lib/handlers/Userhandler";

export const GET = async (context: APIContext) => {
  try {
    const user = await Userhandler.getAuthentificatedUser(context);
    return new Response(
      JSON.stringify({
        id: user?.user.id,
        name: user?.user.name,
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
