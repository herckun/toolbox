import type { APIContext } from "astro";
import { PasteHandler } from "../../../../lib/handlers/PasteHandler";
import { delay } from "../../../../lib/helpers/delay";
import { cacheResult } from "../../../../lib/helpers/cache";
import { hashedString } from "../../../../lib/helpers/generators";

export const GET = async (context: APIContext) => {
  try {
    const id = context.params.id;
    if (!id) {
      throw new Error("No id provided");
    }
    const url = new URL(context.request.url);
    const searchParams = url.searchParams;
    const password = searchParams.get("password") ?? undefined;
    const pasteData = await cacheResult(
      `paste-${id}-${hashedString(password ?? "")}`,
      500,
      async () => {
        return await PasteHandler.get(context, id, password);
      }
    );
    return new Response(JSON.stringify(pasteData), {
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
