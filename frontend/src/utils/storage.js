export const readJSON = (k, fallback = null) => {
  try {
    const v = localStorage.getItem(k);
    return v ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
};
export const writeJSON = (k, val) => localStorage.setItem(k, JSON.stringify(val));
