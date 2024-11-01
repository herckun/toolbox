import type { APIContext } from "astro";
import { PasteHandler } from "../../../../lib/handlers/PasteHandler";
import { delay } from "../../../../lib/helpers/delay";

export const DELETE = async (context: APIContext) => {
  try {
    const id = context.params.id;
    if (!id) {
      throw new Error("No id provided");
    }
    const pasteData = await PasteHandler.delete(context, id);
    return new Response(null, {
      status: 200,
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        error:
          import.meta.env.MODE === "development"
            ? err.message
            : "An error occurred while getting the paste.",
      }),
      {
        status: 500,
      }
    );
  }
};
