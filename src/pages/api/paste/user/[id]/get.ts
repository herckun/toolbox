import type { APIContext } from "astro";
import { PasteHandler } from "../../../../../lib/handlers/PasteHandler";

export const GET = async (context: APIContext) => {
  try {
    const { id } = context.params;
    if (!id) {
      throw new Error("Invalid input");
    }
    const pastes = await PasteHandler.getPastesForUser(id);
    return new Response(JSON.stringify(pastes), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        message: "Something went wrong",
      })
    );
  }
};
