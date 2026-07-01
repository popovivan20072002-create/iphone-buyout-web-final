import fs from "fs/promises";
import path from "path";

export interface LeadStats {
  total: number;
  qualified: number;
  unqualified: number;
  firstLeadAt: string | null;
  lastLeadAt: string | null;
}

const EMPTY_STATS: LeadStats = {
  total: 0,
  qualified: 0,
  unqualified: 0,
  firstLeadAt: null,
  lastLeadAt: null,
};

const STATS_PATH = path.join(__dirname, "stats.json");

function formatDate(iso: string): string {
  const date = new Date(iso);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}.${month}.${year}`;
}

async function readStatsFile(): Promise<LeadStats> {
  try {
    const raw = await fs.readFile(STATS_PATH, "utf8");
    const parsed = JSON.parse(raw) as Partial<LeadStats>;
    return { ...EMPTY_STATS, ...parsed };
  } catch {
    return { ...EMPTY_STATS };
  }
}

async function writeStatsFile(stats: LeadStats): Promise<void> {
  await fs.writeFile(STATS_PATH, `${JSON.stringify(stats, null, 2)}\n`, "utf8");
}

export async function incrementStat(
  type: "qualified" | "unqualified" | null,
): Promise<void> {
  try {
    const stats = await readStatsFile();
    const now = new Date().toISOString();

    stats.total += 1;
    if (type === "qualified") {
      stats.qualified += 1;
    } else if (type === "unqualified") {
      stats.unqualified += 1;
    }
    stats.lastLeadAt = now;
    if (!stats.firstLeadAt) {
      stats.firstLeadAt = now;
    }

    await writeStatsFile(stats);
  } catch (error) {
    console.error("[bot/stats] incrementStat failed:", error);
  }
}

export async function getStats(): Promise<LeadStats> {
  try {
    return await readStatsFile();
  } catch (error) {
    console.error("[bot/stats] getStats failed:", error);
    return { ...EMPTY_STATS };
  }
}

export function formatStatsMessage(stats: LeadStats): string {
  const conversion =
    stats.total === 0
      ? "0%"
      : `${((stats.qualified / stats.total) * 100).toFixed(1)}%`;

  const lines = [
    "<b>📊 Статистика лидов</b>",
    "",
    `• Всего лидов: ${stats.total}`,
    `• Квалифицированных (готовы на сделку): ${stats.qualified}`,
    `• Неквалифицированных (только оценка + телефон): ${stats.unqualified}`,
    `• Конверсия: ${conversion}`,
  ];

  if (stats.firstLeadAt && stats.lastLeadAt) {
    lines.push(
      `• Период: с ${formatDate(stats.firstLeadAt)} по ${formatDate(stats.lastLeadAt)}`,
    );
  }

  return lines.join("\n");
}
