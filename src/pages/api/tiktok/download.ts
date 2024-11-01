import type { APIContext } from "astro";
export const GET = async (context: APIContext) => {
  try {
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
