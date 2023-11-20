import ClipLoader from "react-spinners/ClipLoader";

export default function LoadingScreen() {
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
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#fff",
          padding: "20px",
          borderRadius: "10px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <h1>loading</h1>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              margin: "100px",
            }}
          >
            <ClipLoader
              size={100}
              cssOverride={{
                margin: "0px",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
