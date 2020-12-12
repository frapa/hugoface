import yaml from "yaml";
import toml from "toml";

import { pfs } from "./fs";
import { DIR } from "./git";

// TODO: change this or make configurable
const ARTICLE_DIR = DIR + "/content/post/";

function split(str, separator, limit) {
  const parts = str.split(separator);
  return [...parts.slice(0, limit), parts.slice(limit).join(separator)];
}

function parseArticle(filename, content) {
  // TODO: support all front matter formats
  content = content.trim();
  let fields, body;
  if (content.slice(0, 3) === "---") {
    // YAML front matter
    const [_, header, articleBody] = split(content, "---", 2);
    fields = yaml.parse(header);
    body = articleBody;
  } else if (content.slice(0, 3) === "+++") {
    // TOML front matter
    const [_, header, articleBody] = split(content, "+++", 2);
    fields = toml.parse(header);
    body = articleBody;
  } else if (content.slice(0, 2) === "#+") {
    // ORG MODE front matter
    throw new Error("Org mode front matter is not supported yet");
  } else if (content[0] === "{") {
    // JSON front matter
    throw new Error("JSON front matter is not supported yet");
  } else {
    throw new Error(`Invalid front matter in file '${filename}'`);
  }

  if (fields.hasOwnProperty("date")) {
    fields["date"] = new Date(fields["date"]);
  }

  return {
    filename,
    ...fields,
    body,
  };
}

export async function listArticles() {
  // TODO: pagination
  let files;
  try {
    files = await pfs.readdir(ARTICLE_DIR);
  } catch {
    return [];
  }

  const filesContent = await Promise.all(
    files.map((filename) => pfs.readFile(ARTICLE_DIR + filename))
  );

  return filesContent.map((byteContent, i) => {
    const content = new TextDecoder("utf-8").decode(byteContent);
    return parseArticle(files[i], content);
  });
}

export async function getArticle(filename) {
  const byteContent = await pfs.readFile(ARTICLE_DIR + filename);
  const content = new TextDecoder("utf-8").decode(byteContent);
  return parseArticle(filename, content);
}
