import { readJSON, writeJSON } from "../utils/storage";

const USE_MOCK = (import.meta.env.VITE_USE_MOCK || "true") === "true";
const HISTORY_KEY = "sortify_history_v1";

export async function predict(file) {
  if (!USE_MOCK) throw new Error("Real API not configured");

  await new Promise((r) => setTimeout(r, 700));
  const choices = [
    { category: "plastic", confidence: 0.92, instructions: "Rinse, flatten and recycle", points: 10 },
    { category: "paper", confidence: 0.88, instructions: "Remove food residue and recycle", points: 8 },
    { category: "glass", confidence: 0.95, instructions: "Separate by color and recycle", points: 10 },
    { category: "bio", confidence: 0.86, instructions: "Compost in organics bin", points: 6 }
  ];
  const pick = choices[Math.floor(Math.random() * choices.length)];
  const filename = file?.name || null;
  let thumb = null;
  if (file && typeof FileReader !== "undefined") {
    thumb = await new Promise((res) => {
      const fr = new FileReader();
      fr.onload = () => res(fr.result);
      fr.readAsDataURL(file);
    });
  }
  const out = { ...pick, filename, thumb, ts: Date.now() };
  const hist = readJSON(HISTORY_KEY, []);
  hist.unshift(out);
  writeJSON(HISTORY_KEY, hist.slice(0, 100));
  return out;
}

export function getHistory() {
  return readJSON(HISTORY_KEY, []);
}

export function clearHistory() {
  writeJSON(HISTORY_KEY, []);
}
