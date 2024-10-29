import type { APIContext } from "astro";
import { UserHandler } from "./UserHandler";
import { db } from "../../db/db";
import { generateRandomId, hashedString } from "../helpers/generators";
import { paste, type SelectPaste } from "../../db/schema";
import { addDays } from "../helpers/date";
import { desc, eq } from "drizzle-orm";
import { validateInput } from "../helpers/validators";
import { TITLE_MAX_LENGTH } from "../../consts/requirements";
import { PASTE_PATH } from "../../consts/paths";

export type Paste = {
  title: string;
  content: string;
  password: string;
};

export class PasteHandler {
  static async create(context: APIContext, pasteData: Paste) {
    const user = await UserHandler.getAuthentificatedUser(context);
    if (!user) {
      throw new Error("User not authenticated");
    }
    if (
      !validateInput(pasteData.title, {
        required: true,
        maxLength: TITLE_MAX_LENGTH,
      }) ||
      !validateInput(pasteData.content, { required: true })
    ) {
      throw new Error("Invalid input");
    }
    // Create paste
    const id = await db
      .insert(paste)
      .values({
        id: generateRandomId(8),
        title: pasteData.title,
        content: pasteData.content,
        userId: user.id,
        passwordHash: hashedString(pasteData.password),
        expiresAt: addDays(new Date(), 1),
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning({
        id: paste.id,
      });
    return id;
  }

  static async get(context: APIContext, pasteId: string, password?: string) {
    const user = await UserHandler.getAuthentificatedUser(context);

    // Get paste
    const pasteData: SelectPaste[] = await db
      .select()
      .from(paste)
      .where(eq(paste.id, pasteId));

    const unlockedData = {
      id: pasteData[0].id,
      title: pasteData[0].title,
      content: pasteData[0].content,
      createdAt: pasteData[0].createdAt,
    };

    if (pasteData[0].passwordHash == hashedString("")) {
      return unlockedData;
    }

    if (user && user.id === pasteData[0].userId) {
      return unlockedData;
    }
    console.log(password);
    if (!password) {
      return {
        id: pasteData[0].id,
        requiresPassword: true,
      };
    } else {
      if (pasteData[0].passwordHash !== hashedString(password)) {
        throw new Error("Invalid password");
      }
    }

    return unlockedData;
  }

  static async getPastesForUser(userId: string) {
    const query = await db
      .select()
      .from(paste)
      .where(eq(paste.userId, userId))
      .orderBy(desc(paste.createdAt));
    let pastes = [];
    for (let i = 0; i < query.length; i++) {
      pastes.push({
        id: query[i].id,
        title: query[i].title,
        link: `${PASTE_PATH}/${query[i].id}`,
        createdAt: query[i].createdAt,
      });
    }
    return pastes;
  }
}
