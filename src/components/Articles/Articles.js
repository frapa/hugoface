import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import { listArticles } from "../../services/articles";

export function Articles() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    (async () => {
      const articles = await listArticles();
      const sortedArticles = articles.sort((a, b) =>
        a.date <= b.date ? 1 : -1
      );
      setArticles(sortedArticles);
    })();
  }, []);

  return (
    <div>
      <h1 className="title">Articles</h1>
      <table className="table is-fullwidth is-hoverable">
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
  const history = useHistory();

  return (
    <tr
      className="pointer"
      onClick={() => history.push(`/article/${article.filename}`)}
    >
      <td className="has-text-centered">
        {!article.draft && <i className="fas fa-check"></i>}
      </td>
      <td>{article.title}</td>
      <td>{article.date && article.date.toLocaleDateString()}</td>
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
    <span key={name} className="tag mr-2">
      {name}
    </span>
  );
}
