import type { APIContext } from "astro";
import { PasteHandler } from "../../../../../lib/handlers/PasteHandler";
import { decodeBase64ToObject } from "../../../../../lib/helpers/encode";
import { delay } from "../../../../../lib/helpers/delay";
import { cacheResult } from "../../../../../lib/helpers/cache";

export const GET = async (context: APIContext) => {
  try {
    const { id } = context.params;
    const url = new URL(context.request.url);
    const seearchParams = url.searchParams;
    let cursor = seearchParams.get("cursor") ?? undefined;
    cursor = cursor ? decodeURIComponent(cursor) : cursor;
    if (!id) {
      throw new Error("Invalid input");
    }
    const pastes = await cacheResult(
      `pastes-${id}-${cursor}`,
      500,
      async () => {
        return await PasteHandler.getPastesForUser(id, cursor);
      }
    );
    return new Response(JSON.stringify(pastes), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err: any) {
    if (err)
      return new Response(
        JSON.stringify({
          message:
            import.meta.env.MODE === "development"
              ? err.message
              : "Internal server error",
        }),
        {
          status: 500,
        }
      );
  }
};
