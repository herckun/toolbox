import type { APIContext } from "astro";
import { PasteHandler } from "../../../lib/handlers/PasteHandler";

export const PUT = async (context: APIContext) => {
  try {
    const body = await context.request.json();
    const pasteData = {
      title: body.title,
      content: body.content,
      password: body.password,
    };
    const pasteId = await PasteHandler.create(context, pasteData);
    return new Response(
      JSON.stringify({
        id: pasteId[0].id,
      }),
      {
        status: 200,
      },
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        error: "An error occurred while creating the paste.",
      }),
      {
        status: 500,
      },
    );
  }
};
