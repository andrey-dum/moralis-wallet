import logo from "../logo.svg";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      <img src={logo} className="homeLogo" alt="logo" />
      <h2 className="homeTitle">Hey There 👋</h2>
      <h4>Welcome to your Web3 Wallet</h4>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Button
          className="homeBtn"
          type="primary"
          style={{ marginBottom: "15px" }}
          onClick={() => navigate("/your-wallet")}
        >
          Create A Wallet
        </Button>
        <div>
          <Button
            className="fullWidth"
            type="default"
            onClick={() => navigate("/recover")}
          >
            Sign In With Seed Phrase
          </Button>
        </div>
      </div>

      <p style={{ fontSize: "12px" }}>
        Find Alt Coins Gems:{" "}
        <a href="https://coinmarketcap.com/">coinmarketcap.com</a>
      </p>
    </div>
  );
}

export default Home;
