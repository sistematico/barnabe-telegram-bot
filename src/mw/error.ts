import { GrammyError, HttpError } from "grammy";
import type { Context } from "hono";

export const errorHandler = async (ctx: Context, next: () => Promise<void>) => {
  try {
    await next();
  } catch (err) {
    if (err instanceof GrammyError) {
      console.error("Erro do Grammy:", err.description, "Código:", err);
    } else if (err instanceof HttpError) {
      console.error("Erro de rede:", err.error);
    } else {
      console.error("Erro desconhecido:", err);
    }
  }
};
