import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getArticle } from "../../services/articles";

export default function Editor() {
  const { filename } = useParams();
  const [article, setArticle] = useState([]);

  useEffect(() => {
    (async () => {
      setArticle(await getArticle(filename));
    })();
  }, []);

  if (!article) return <div></div>;

  return (
    <div>
      <h1 className="title is-4">{article.title}</h1>
      <div>{article.slug}</div>
      <div className="is-flex is-flex-direction-row">
        <textarea className="is-flex is-flex-grow-1">{article.body}</textarea>
      </div>
    </div>
  );
}
