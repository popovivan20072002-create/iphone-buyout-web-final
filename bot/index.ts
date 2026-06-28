import "dotenv/config";
import { Bot } from "grammy";
import { registerHandlers } from "./handlers";

const token = process.env.BOT_TOKEN?.trim();

if (!token) {
  console.error("[bot] BOT_TOKEN missing");
  process.exit(1);
}

const bot = new Bot(token);

registerHandlers(bot);

bot.catch((error) => {
  console.error("[bot] Error:", error);
});

console.info("[bot] Starting long polling…");
bot.start();
