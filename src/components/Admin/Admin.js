import "./Admin.css";
import SearchBar from "../SearchBar/SearchBar";
import SideBar from "../SideBar/SideBar";

export default function Admin({ children }) {
  return (
    <div className="app">
      <SideBar />

      <div className="main">
        <SearchBar />

        <div className="page section">
          <main className="container">{children}</main>
        </div>
      </div>
    </div>
  );
}
