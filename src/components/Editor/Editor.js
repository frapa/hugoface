import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import fromMarkdown from "mdast-util-from-markdown";

import "./Editor.css";
import { getArticle } from "../../services/articles";

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function toMarkdown(tree) {
  let markdown = "";
  for (const child of tree.children) {
    if (child.type == "heading") {
      const prefix = "#".repeat(child.depth);
      const title = toMarkdown(child);
      markdown += `<div class="title is-${
        child.depth + 2
      }">${prefix} ${title}</div><br />\n`;
    } else if (child.type == "text") {
      markdown += escapeHtml(child.value);
    } else if (child.type == "paragraph") {
      markdown += toMarkdown(child);
    }
  }
  return markdown;
}

function toEditorHtml(tree) {
  console.log(tree);

  const markdown = toMarkdown(tree);
  return markdown;

  // let editorHtml = escapeHtml(markdown);

  // editorHtml = editorHtml.replace(/\r/g, "").replace(/\n/g, "<br />\n");
  // editorHtml = editorHtml.replace(
  //   /^(#+.*)$/gm,
  //   '<div class="title is-4">$1</div>'
  // );

  // return editorHtml;
}

export default function Editor() {
  const { filename } = useParams();

  const [article, setArticle] = useState([]);
  const [tree, setTree] = useState(null);

  useEffect(() => {
    (async () => {
      const article = await getArticle(filename);
      setArticle(article);
      if (article.body) {
        setTree(fromMarkdown(article.body));
      }
    })();
  }, []);

  if (!article) return <div></div>;

  return (
    <div>
      <h1 className="title is-4">{article.title}</h1>
      <div>{article.slug}</div>
      <div>
        <div
          dangerouslySetInnerHTML={{
            __html: tree ? toEditorHtml(tree) : "",
          }}
          contentEditable={true}
          // TODO: other events such as paste, keyup and blur
          onInput={(event) => console.log(event.target.innerHTML)}
        ></div>
      </div>
    </div>
  );
}
