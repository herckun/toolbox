import type { Paste } from "../../../lib/handlers/PasteHandler";
import { generateRandomId } from "../../../lib/helpers/generators";

export const createPaste = async (pasteData: Paste) => {
  const baseUrl = location.protocol + "//" + location.host;
  const f = await fetch(`${baseUrl}/api/paste/create`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: pasteData.title == "" ? `none` : pasteData.title,
      content: pasteData.content,
      password: pasteData.password,
    }),
  });
  return f;
};

export const getPaste = async (id: string, password?: string) => {
  const baseUrl = location.protocol + "//" + location.host;
  const url =
    password === undefined
      ? `${baseUrl}/api/paste/${id}/get`
      : `${baseUrl}/api/paste/${id}/get?password=${password}`;
  const f = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await f.json();
};