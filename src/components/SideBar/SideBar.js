import { useHistory, Link } from "react-router-dom";

import "./SideBar.css";
import logo from "../../logo.svg";
import { logOut } from "../../services/login";
import { isDirty } from "../../services/git";

export default function SideBar() {
  const history = useHistory();

  isDirty();

  function triggerLogout() {
    logOut();
    history.push("/login");
  }

  return (
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
        {/* <Link to="/pages">
        <div className="menu-item">
          <span>Pages</span>
        </div>
      </Link> */}
      </div>

      <div className="user">
        <a href="#" onClick={() => triggerLogout()}>
          Logout
        </a>
      </div>
    </nav>
  );
}
