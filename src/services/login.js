import { clone } from "./git";

export function isLoggedIn() {
  return !!localStorage.repos;
}

export async function logIn(repo, username, password, persist) {
  await clone(repo, username, password);

  if (persist) {
    localStorage.repos = JSON.stringify([{ repo, username, password }]);
  }
}

export function logOut() {
  localStorage.clear();
  indexedDB.deleteDatabase("fs");
  indexedDB.deleteDatabase("fs_lock");
}
