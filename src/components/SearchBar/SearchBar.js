import "./SearchBar.css";

export default function SearchBar() {
  return (
    <div className="search-bar has-background-white-bis">
      <div className="columns">
        <div className="column"></div>

        <div className="column is-half px-2">
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

        <div className="column has-text-right">
          <button className="button is-primary is-outlined" disabled>
            Publish
          </button>
        </div>
      </div>
    </div>
  );
}
