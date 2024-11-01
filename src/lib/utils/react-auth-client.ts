import { createAuthClient } from "better-auth/react";
import { APP_URL } from "../../consts/paths";
export const authClient = createAuthClient({
  baseURL: `${APP_URL}${import.meta.env.PUBLIC_BETTER_AUTH_URL}`,
});
