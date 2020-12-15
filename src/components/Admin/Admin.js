import { useHistory, Link } from "react-router-dom";

import "./Admin.css";
import logo from "../../logo.svg";
import { logOut } from "../../services/login";

export default function Admin({ children }) {
  const history = useHistory();

  function triggerLogout() {
    logOut();
    history.push("/login");
  }

  return (
    <div className="app">
      <nav className="sidebar has-background-light">
        <div className="logo has-text-centered">
          <img src={logo} alt="Hugoface" />
        </div>

        <div className="menu">
          <Link to="/dashboard">
            <div className="menu-item">
              <span>Dashboard</span>
            </div>
          </Link>
          <Link to="/articles">
            <div className="menu-item">
              <span>Articles</span>
            </div>
          </Link>
          <Link to="/pages">
            <div className="menu-item">
              <span>Pages</span>
            </div>
          </Link>
        </div>

        <div className="user">
          <a href="#" onClick={() => triggerLogout()}>
            Logout
          </a>
        </div>
      </nav>

      <div className="main">
        <div className="search-bar">
          <div className="columns">
            <div className="column"></div>

            <div className="column is-half">
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
              <button className="button is-primary" disabled>
                Publish
              </button>
            </div>
          </div>
        </div>

        <div className="page section">
          <main className="container">{children}</main>
        </div>
      </div>
    </div>
  );
}
