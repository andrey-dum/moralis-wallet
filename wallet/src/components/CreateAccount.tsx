import { useState } from "react";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Button, Card } from "antd";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";

interface Props {
  setSeedPhrase: (val: string) => void;
  setWallet: (val: string) => void;
}

function CreateAccount({ setSeedPhrase, setWallet }: Props) {
  const [newSeedPhrase, setNewSeedPhrase] = useState<string | undefined>("");

  const navigate = useNavigate();

  const generateWallet = () => {
    const mnemonic = ethers.Wallet.createRandom().mnemonic?.phrase;
    setNewSeedPhrase(mnemonic);
  };

  const setWalletAndMnemonic = () => {
    if (newSeedPhrase) {
      setSeedPhrase(newSeedPhrase);
      setWallet(ethers.Wallet.fromPhrase(newSeedPhrase).address);
    }
  };

  return (
    <>
      <div className="content">
        <div className="mnemonic">
          <ExclamationCircleOutlined style={{ fontSize: "20px" }} />
          <div>
            Once you generate the seed phrase, save it securely in order to
            recover your wallet in the future.
          </div>
        </div>
        <Button
          type="primary"
          className="fullWidth"
          style={{ marginBottom: "20px" }}
          onClick={generateWallet}
        >
          Generate Seed Phrase
        </Button>
        <Card className="seedContainer">
          {newSeedPhrase && (
            <pre style={{ whiteSpace: "pre-wrap" }}>{newSeedPhrase}</pre>
          )}
        </Card>
        <Button
          type="default"
          className="fullWidth"
          style={{ marginTop: "20px" }}
          onClick={setWalletAndMnemonic}
          disabled={!newSeedPhrase}
        >
          Open Your Wallet
        </Button>
      </div>

      <Button
        type="text"
        className="fullWidth"
        style={{ marginTop: "40px" }}
        onClick={() => navigate("/")}
      >
        Back To Home
      </Button>
    </>
  );
}

export default CreateAccount;
