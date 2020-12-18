import "./SearchBar.css";
import PublishButton from "../PublishButton/PublishButton";
import { AppContext } from "../../services/context";

export default function SearchBar() {
  return (
    <div className="search-bar has-background-white-bis">
      <div className="columns">
        <div className="column is-narrow"></div>

        <div className="column px-2">
          <p className="control has-icons-left">
            <input
              className="input"
              id="search"
              type="text"
              placeholder="Go to..."
            />
            <span className="icon is-small is-left">
              <i className="fas fa-search"></i>
            </span>
          </p>
        </div>

        <div className="column is-narrow">
          <PublishButton />
        </div>
      </div>
    </div>
  );
}
