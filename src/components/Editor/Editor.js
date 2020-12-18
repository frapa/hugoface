import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import fromMarkdown from "mdast-util-from-markdown";

import "./Editor.css";
import { getArticle, saveArticle } from "../../services/articles";
import { AppContext } from "../../services/context";
import { isDirty } from "../../services/git";

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function unescapeHtml(unsafe) {
  return unsafe
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");
}

function formatParagraph(paragraph, parent) {
  const ending = parent.type === "root" ? "<br /><br />" : "";

  const content = toMarkdown(paragraph);
  const trimmedContent = toMarkdown(paragraph).trim();

  // TODO: add support for {{% %}} shortcodes and split shortcodes
  if (
    trimmedContent.slice(0, 6) === "{{&lt;" &&
    trimmedContent.slice(-6) === "&gt;}}"
  ) {
    // const shortcode = trimmedContent.split(" ", 2)[1];
    return `<span class="has-text-grey-light">${content}</span>${ending}`;
  } else {
    return `${content}${ending}`;
  }
}

function toMarkdown(tree) {
  let markdown = "";

  let i = 0;
  for (const child of tree.children) {
    // HEADING
    if (child.type === "heading") {
      const prefix = "#".repeat(child.depth);
      const title = toMarkdown(child);
      markdown += `<strong class="">${prefix} ${title}</strong><br /><br />`;
      // TEXT
    } else if (child.type === "text") {
      markdown += escapeHtml(child.value)
        .replace(/\r/g, "")
        .replace(/\n/g, "<br />");
      // PARAGRAPH
    } else if (child.type === "paragraph") {
      markdown += formatParagraph(child, tree);
      // LINK
    } else if (child.type === "link") {
      const content = toMarkdown(child);
      markdown +=
        `<a href="#">` +
        `<span class="has-text-grey-light">[</span>` +
        content +
        `<span class="has-text-grey-light">](${child.url})</span>` +
        `</a>`;
      // LIST
    } else if (child.type === "list") {
      markdown += toMarkdown(child) + "<br />";
      // LIST ITEM
    } else if (child.type === "listItem") {
      const content = toMarkdown(child);
      markdown += `<strong>-</strong> ${content}<br />`;
      // WARN
    } else {
      console.warn(`Unsupported child type: ${child.type}`);
    }

    i++;
  }

  return markdown;
}

function fromEditorHtml(editorHtml) {
  return unescapeHtml(
    editorHtml
      .replace(/<br>|<br \/>/g, "\n")
      .replace(/<\/div>/g, "\n")
      .replace(/<.+?>/g, "")
  );
}

function toEditorHtml(tree) {
  console.log(tree);
  const markdown = toMarkdown(tree);
  return markdown;
}

// function lineNumbersHtml(articleBody) {
//   return (articleBody || "")
//     .trimStart()
//     .split("\n")
//     .slice(0, -1)
//     .map((line, i) => {
//       const extraLines = Math.floor(line.length / 72);
//       const postfix = extraLines > 0 ? "<br />".repeat(extraLines) : "";
//       return `${i + 1}${postfix}`;
//     })
//     .join("<br />");
// }

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
}

export default function Editor() {
  const { filename } = useParams();
  const { context, setContext } = useContext(AppContext);

  const [article, setArticle] = useState([]);
  const [tree, setTree] = useState(null);

  useEffect(() => {
    (async () => {
      const article = await getArticle(filename);
      setArticle(article);
      setTree(fromMarkdown(article.body));
    })();
  }, [filename]);

  function setAndSaveArticle(article) {
    if (!article) return;

    setArticle(article);
    saveArticle(article);

    (async () => {
      setContext({
        ...context,
        dirty: await isDirty(),
      });
    })();
  }

  function setBody(editorHtml) {
    if (!article) return;

    const markdown = fromEditorHtml(editorHtml);
    const newArticle = { ...article, body: markdown };

    setAndSaveArticle(newArticle);
  }

  function setTitle(title) {
    // Only change the slug if it wasn't changed by the user
    let slug = article.slug;
    const currentTitleSlug = slugify(article.title);
    if (article.slug === currentTitleSlug) {
      slug = slugify(title);
    }

    setAndSaveArticle({ ...article, title, slug });
  }

  if (!article) return <div></div>;

  const editorContent = tree ? toEditorHtml(tree) : "";

  return (
    <div className="is-flex is-justify-content-center">
      <div className="article-data">
        <input
          className="input title"
          type="text"
          value={article.title || ""}
          onChange={(event) => setTitle(event.target.value)}
        />

        {/* <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">Published</label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="control is-expanded has-icons-left">
                <span class="icon is-small is-left">
                  <i class="fas fa-calendar-alt"></i>
                </span>
                <input
                  className="input"
                  type="date"
                  value={
                    article.date && article.date.toISOString().split("T")[0]
                  }
                  onChange={(event) =>
                    setAndSaveArticle({
                      ...article,
                      date: new Date(event.target.value),
                    })
                  }
                />
              </div>
            </div>
          </div>
        </div> */}

        <div className="field is-horizontal">
          <div className="field-label is-normal">
            <label className="label">Slug</label>
          </div>
          <div className="field-body">
            <div className="field has-addons">
              <div className="control is-expanded has-icons-left">
                <span className="icon is-small is-left">
                  <i className="fas fa-link"></i>
                </span>
                <input
                  className="input"
                  type="text"
                  value={article.slug || ""}
                  onChange={(event) =>
                    setAndSaveArticle({
                      ...article,
                      slug: event.target.value,
                    })
                  }
                />
              </div>
              <p className="control">
                <button
                  className="button has-tooltip-bottom"
                  data-tooltip="Reset slug based on title"
                  onClick={() =>
                    setAndSaveArticle({
                      ...article,
                      slug: slugify(article.title),
                    })
                  }
                >
                  <span className="icon">
                    <i className="fas fa-undo"></i>
                  </span>
                </button>
              </p>
            </div>
          </div>
        </div>

        {/* <div>{article.slug}</div> */}

        <div className="editor-container">
          {/* <div
            className="gutter has-text-grey-lighter has-text-right"
            dangerouslySetInnerHTML={{
              __html: lineNumbersHtml(article.body),
            }}
          ></div> */}
          <div
            className="editor"
            dangerouslySetInnerHTML={{
              __html: editorContent,
            }}
            contentEditable={true}
            // TODO: other events such as paste, keyup and blur
            // TODO: debounce
            onInput={(event) => setBody(event.target.innerHTML)}
          ></div>
        </div>
      </div>
    </div>
  );
}
