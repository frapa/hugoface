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
        <div className="logo">
          <img src={logo} alt="Hugoface" />
        </div>

        <div className="menu">
          <div>
            <Link to="/dashboard">Dashboard</Link>
          </div>
          <div>
            <Link to="/articles">Articles</Link>
          </div>
          <div>
            <Link to="/pages">Pages</Link>
          </div>
        </div>

        <div className="user">
          <a href="#" onClick={() => triggerLogout()}>
            Logout
          </a>
        </div>
      </nav>

      <div className="page section">
        <main className="container">{children}</main>
      </div>
    </div>
  );
}
