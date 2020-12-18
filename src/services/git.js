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

export async function fileType(path) {
  // TODO: change this
  if (path.startsWith("content/post")) {
    return "article";
  }
}

export async function gitStatus() {
  let status = await git.statusMatrix({
    fs,
    dir: DIR,
  });

  const fileStatus = [];
  for (const [path, head, workDir, stage] of status) {
    if (head === 1 && (workDir === 1) & (stage === 1)) continue;

    fileStatus.push({
      path,
      filename: path.split(/[^\\]\//).pop(),
      type: await fileType(path),
      head,
      workDir,
      stage,
      humanReadableState: {
        [[0, 2]]: "Added",
        [[1, 2]]: "Modified",
        [[1, 0]]: "Deleted",
      }[[head, workDir]],
    });
  }

  return fileStatus;
}

export async function isDirty() {
  const fileStatus = await gitStatus();
  return !!fileStatus;
}

export async function commit(commitMessage) {
  if (!commitMessage) {
    console.warn("Not committing because the commit message is empty.");
  }

  const fileStatus = await gitStatus();
  await Promise.all(
    fileStatus.map(async ({ path }) => {
      await git.add({ fs, dir: DIR, filepath: path });
    })
  );
  await git.commit({ fs, dir: DIR, message: commitMessage });
  await git.push({ fs, http, dir: DIR });
}
