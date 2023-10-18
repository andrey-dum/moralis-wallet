import { useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import { Select } from "antd";
import { Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import CreateAccount from "./components/CreateAccount";
import RecoverAccount from "./components/RecoverAccount";
import WalletView from "./components/WalletView";

const CHAINS = [
  {
    label: "Ethereum",
    value: "0x1",
  },
  {
    label: "Mumbai Testnet",
    value: "0x13881",
  },
  {
    label: "Polygon",
    value: "0x89",
  },
  {
    label: "Avalanche",
    value: "0xa86a",
  },
];

function App() {
  const [wallet, setWallet] = useState<string | undefined>("");
  const [seedPhrase, setSeedPhrase] = useState<string | undefined>("");
  const [selectedChain, setSelectedChain] = useState<string>("0x1");

  const handleChange = (val: any) => {
    setSelectedChain(val);
  };

  return (
    <div className="App">
      <header className="header">
        <img src={logo} className="logo" alt="logo" />

        {wallet ? (
          <div className="selectWrapper">
            <Select
              value={selectedChain}
              options={CHAINS}
              className="selectChain"
              onChange={handleChange}
            />
          </div>
        ) : (
          <div style={{ fontSize: "20px", fontWeight: 600 }}>mWallet</div>
        )}
      </header>

      {wallet && seedPhrase ? (
        <Routes>
          <Route
            path="/your-wallet"
            element={
              <WalletView
                wallet={wallet}
                setWallet={setWallet}
                seedPhrase={seedPhrase}
                setSeedPhrase={setSeedPhrase}
                selectedChain={selectedChain}
              />
            }
          />
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/your-wallet"
            element={
              <CreateAccount
                setWallet={setWallet}
                setSeedPhrase={setSeedPhrase}
              />
            }
          />
          <Route
            path="/recover"
            element={
              <RecoverAccount
                setWallet={setWallet}
                setSeedPhrase={setSeedPhrase}
              />
            }
          />
        </Routes>
      )}
    </div>
  );
}

export default App;
