import { useEffect, useState } from "react";

import { listArticles } from "../../services/articles";

function articleNum() {}

export function Articles() {
  const [articles, setArticles] = useState([]);
  console.log(articles);

  useEffect(async () => {
    setArticles(await listArticles());
  }, []);

  return (
    <div>
      <h1 className="title">Articles</h1>
      <table className="table is-fullwidth">
        <thead>
          <tr>
            <th title="Published">Pub</th>
            <th>Article</th>
            <th>Date</th>
            <th>Tags</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((article) => (
            <Article key={article.filename} article={article} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Article({ article }) {
  return (
    <tr>
      <td>{!article.draft && <i className="fas fa-check"></i>}</td>
      <td>{article.title}</td>
      <td>{article.date}</td>
      <td>
        {(article.tags || []).map((tag) => (
          <Tag key={tag} name={tag} />
        ))}
      </td>
    </tr>
  );
}

function Tag({ name }) {
  return (
    <span key={name} className="tag">
      {name}
    </span>
  );
}
