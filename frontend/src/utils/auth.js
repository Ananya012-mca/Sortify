import { readJSON, writeJSON } from "./storage";

const USER_KEY = "sortify_user";

export function getCurrentUser() {
  return readJSON(USER_KEY, null);
}

export function setCurrentUser(user) {
  if (!user) localStorage.removeItem(USER_KEY);
  else writeJSON(USER_KEY, user);
}

export function mockLogin({ email, name }) {
  const user = { id: Math.floor(Math.random() * 100000), name: name || email.split("@")[0], email, points: 0 };
  setCurrentUser(user);
  return user;
}

export function mockLogout() {
  setCurrentUser(null);
}
