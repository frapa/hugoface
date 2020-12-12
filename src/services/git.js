import git from "isomorphic-git";
import http from "isomorphic-git/http/web";

import { fs, pfs } from "./fs";

export const DIR = "/repo";

export async function clone(repo, username, password) {
  await pfs.mkdir(DIR);

  try {
    await git.clone({
      fs,
      http,
      dir: DIR,
      url: repo,
      depth: 1,
      corsProxy: "https://cors.isomorphic-git.org",
      onAuth: () => {
        return {
          username,
          password,
        };
      },
    });
  } catch (err) {
    indexedDB.deleteDatabase("fs");
    indexedDB.deleteDatabase("fs_lock");
    throw err;
  }
}
