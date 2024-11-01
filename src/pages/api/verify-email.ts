import type { APIContext } from "astro";
import { authClient } from "../../lib/utils/react-auth-client";
import { AUTH_PATH } from "../../consts/paths";

export const GET = async (context: APIContext) => {
  try {
    const params = context.url.searchParams;
    const token = params.get("token");
    if (!token) {
      return new Response(null, {
        status: 400,
      });
    }
    const { error } = await authClient.verifyEmail({
      query: {
        token: token,
      },
    });
    if (error) {
      return new Response(
        JSON.stringify({
          message: "Could not verify email",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
    const redirect = new URL(context.url.origin + AUTH_PATH);
    redirect.searchParams.set("message", "Email verified, you can now sign in");
    return context.redirect(redirect.toString());
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        message: err.message,
      }),
      {
        status: 500,
      }
    );
  }
};
