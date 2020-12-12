import { pfs } from "./fs";
import { DIR } from "./git";

function parseField(field) {
  const parts = field.trim().split(":");

  const field_name = parts[0].trim();
  let field_content = parts.slice(1).join(":").trim();
  if (field_content[0] == '"' && field_content.slice(-1)[0] == '"') {
    field_content = field_content.slice(1, -1);
  }
  return [field_name, field_content];
}

function parseHeader(header) {
  const fieldsList = header.trim().split("\n").map(parseField);

  const fields = {};
  for (const field of fieldsList) {
    fields[field[0]] = field[1];
  }

  return fields;
}

function parseArticle(filename, content) {
  const [_, header, body] = content.split("---");
  const fields = parseHeader(header);

  return {
    filename,
    ...fields,
    body,
  };
}

export async function listArticles() {
  // TODO: change this or make configurable
  const articleDir = DIR + "/content/post/";

  let files;
  try {
    files = await pfs.readdir(articleDir);
  } catch {
    return [];
  }

  const filesContent = await Promise.all(
    files.map((filename) => pfs.readFile(articleDir + filename))
  );

  return filesContent.map((byteContent, i) => {
    const content = new TextDecoder("utf-8").decode(byteContent);
    return parseArticle(files[i], content);
  });
}
