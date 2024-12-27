import type { APIContext } from "astro";
import { UserHandler } from "../../../lib/handlers/UserHandler";
import ytdl from "@distube/ytdl-core";

export const prerender = false;

export const GET = async (context: APIContext) => {
  try {
    const user = await UserHandler.getAuthentificatedUser(context);

    if (!user) {
      throw new Error("Unauthorized");
    }

    const url = new URL(context.request.url);
    const id = url.searchParams.get("id");
    const quality = url.searchParams.get("quality") ?? "lowest";

    const ytUrl = `https://www.youtube.com/watch?v=${id}`;

    const info = await ytdl.getInfo(ytUrl);
    const format = ytdl.chooseFormat(info.formats, { quality: quality });

    const videoStream = ytdl(ytUrl, { format });

    const readableStream = new ReadableStream({
      start(controller) {
        videoStream.on("data", (chunk) => controller.enqueue(chunk));
        videoStream.on("end", () => controller.close());
        videoStream.on("error", (err) => {
          console.error("Error streaming video:", err);
          controller.error(err);
        });
      },
    });

    const headers = new Headers({
      "Content-Type": "video/mp4",
      "Content-Disposition": `attachment; filename="${info.videoDetails.title}.mp4"`,
    });

    return new Response(readableStream as ReadableStream, { headers });
  } catch (err: any) {
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
