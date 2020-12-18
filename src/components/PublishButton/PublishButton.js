import { useContext, useEffect, useState } from "react";
import { getArticle } from "../../services/articles";
import { AppContext } from "../../services/context";
import { commit, gitStatus } from "../../services/git";

export default function PublishButton() {
  const { context } = useContext(AppContext);

  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState([]);
  const [commitMessage, setCommitMessage] = useState("");

  useEffect(() => {
    (async () => {
      setStatus(await gitStatus());
    })();
  });

  return (
    <div>
      <button
        className="button is-primary is-outlined"
        disabled={!context.dirty}
        onClick={() => setShowModal(true)}
      >
        Publish
      </button>

      {showModal ? (
        <div className="modal is-active">
          <div className="modal-background"></div>
          <div className="modal-card">
            <header className="modal-card-head">
              <p className="modal-card-title">Publish</p>
              <button
                className="delete"
                aria-label="close"
                onClick={() => setShowModal(false)}
              ></button>
            </header>

            <section className="modal-card-body">
              You are going to publish the following changes:
              <table className="table is-fullwidth my-4">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {status.map((fileStatus) => (
                    <FileStatusRow
                      fileStatus={fileStatus}
                      key={fileStatus.path}
                    />
                  ))}
                </tbody>
              </table>
              <textarea
                className="input"
                placeholder="Describe your changes"
                onInput={(event) => setCommitMessage(event.target.value)}
                value={commitMessage}
              ></textarea>
            </section>

            <footer className="modal-card-foot">
              <div
                className="mr-3 has-tooltip-right"
                data-tooltip={
                  commitMessage ? null : "Describe your changes to publish."
                }
              >
                <button
                  className="button is-primary"
                  disabled={!commitMessage}
                  onClick={() => commit(commitMessage)}
                >
                  Publish
                </button>
              </div>
              <button className="button" onClick={() => setShowModal(false)}>
                Cancel
              </button>
            </footer>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}

function FileStatusRow({ fileStatus }) {
  let [itemName, setItemName] = useState("");

  useEffect(() => {
    (async () => {
      const article = await getArticle(fileStatus.filename);

      let itemName;
      if (fileStatus.type === "article") {
        itemName = <span>Article "{article.title}"</span>;
      } else {
        throw new Error(
          "Display in publish dialog not implemented for file type: " +
            fileStatus.type
        );
      }

      setItemName(itemName);
    })();
  });

  return (
    <tr>
      <td>{itemName}</td>
      <td>{fileStatus.humanReadableState}</td>
    </tr>
  );
}
