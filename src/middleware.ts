import { defineMiddleware } from "astro:middleware";
import pathcheck from "./lib/helpers/pathcheck";
import { sequence } from "astro:middleware";
import { auth } from "./lib/auth";
import { AUTH_PATH } from "./consts/paths";

const protectedPaths = ["/app", "/api/paste/create", "/api/user/*"];
const excludedPaths: string[] = ["/api/auth/*", "/api/paste/*"];

export const cors = defineMiddleware((context, next) => {
  const isExcluded = pathcheck(context.url.pathname, excludedPaths);
  if (context.request.method !== "GET" && !isExcluded) {
    const originHeader = context.request.headers.get("Origin");
    const hostHeader = context.request.headers.get("Host");
    if (!originHeader || !hostHeader || originHeader !== hostHeader) {
      return new Response(null, {
        status: 403,
      });
    }
  }
  return next();
});

export const handleAuth = defineMiddleware(async (context, next) => {
  const isProtected = pathcheck(context.url.pathname, protectedPaths);
  if (isProtected) {
    const isAuthed = await auth.api.getSession({
      headers: context.request.headers,
    });
    if (!isAuthed) {
      return context.redirect(AUTH_PATH);
    }
    return next();
  }
  return next();
});

export const rewriteOnResponseStatus = defineMiddleware(
  async (context, next) => {
    const response = await next();

    /*
      If the response status is 500 and no data is returned,
      we will render the server-error page with status 500 instead of returning a blank error 500 response.
    */
    if (response.status === 500 && response.body === null) {
      const page = await fetch(
        new Request(new URL("/server-error", context.url).toString())
      );
      return new Response(await page.text(), {
        headers: {
          "Content-Type": "text/html",
        },
        status: 500,
      });
    }
    return response;
  }
);

export const onRequest = sequence(cors, handleAuth, rewriteOnResponseStatus);
