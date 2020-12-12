import { useState } from "react";
import { useHistory } from "react-router-dom";

import { logIn } from "../../services/login";

export default function Login() {
  const history = useHistory();

  const [repo, setRepo] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");

  async function triggerLogin() {
    try {
      await logIn(repo, username, password, rememberMe);
      history.push("/dashboard");
    } catch {
      setError("Repository URL, username or password are invalid.");
    }
  }

  return (
    <div className="container">
      <div className="field">
        <label className="label">Repository URL</label>
        <div className="control">
          <input
            className="input"
            type="text"
            placeholder="https://git.com/user/example.git"
            value={repo}
            onChange={(event) => setRepo(event.target.value)}
          />
        </div>
      </div>

      <div className="field">
        <label className="label">Username</label>
        <div className="control">
          <input
            className="input"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>
      </div>

      <div className="field">
        <label className="label">Password</label>
        <div className="control">
          <input
            className="input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
      </div>

      <div className="field">
        <div className="control">
          <label className="checkbox">
            <input
              className="mr-3"
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            Remember me
          </label>
        </div>
      </div>

      {error ? <div class="notification is-danger">{error}</div> : ""}

      <div className="field">
        <div className="control">
          <button className="button is-link" onClick={() => triggerLogin()}>
            Start
          </button>
        </div>
      </div>
    </div>
  );
}
