import { Link } from "react-router-dom";

export default function ServerError() {
  return (
    <div
      className="App"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "10px",
          marginLeft: "5%",
          marginRight: "5%",
        }}
      >
        <h1>
          Server Error. Please try to re-login. If the error persists, contact
          Support!
        </h1>
        <Link to="/logout">
          <h1
            style={{
              color: "#fff",
              padding: "12px 0",
              borderRadius: "20px",
              width: "120px",
              fontSize: "14px",
              cursor: "pointer",
              backgroundColor: "#13395a",
              margin: "10px",
            }}
          >
            logout
          </h1>
        </Link>
      </div>
    </div>
  );
}
