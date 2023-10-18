import { useState } from "react";
import { BulbOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";

interface Props {
  setSeedPhrase: (val: string) => void;
  setWallet: (val: string) => void;
}

function RecoverAccount({ setSeedPhrase, setWallet }: Props) {
  const navigate = useNavigate();

  const [typedSeed, setTypedSeed] = useState("");
  const [nonValid, setNonValid] = useState(false);

  const seedAdjust = (e: any) => {
    setNonValid(false);
    setTypedSeed(e.target.value);
  };

  const recoverWallet = async () => {
    let recoveredWallet;
    try {
      recoveredWallet = ethers.Wallet.fromPhrase(typedSeed);
    } catch (error) {
      setNonValid(true);
      return;
    }

    setSeedPhrase(typedSeed)
    setWallet(recoveredWallet.address)
    navigate('/your-wallet')
    return
  };

  return (
    <>
      <div className="content">
        <div className="mnemonic">
          <BulbOutlined style={{ fontSize: "20px" }} />
          <div>
            Type your seed phrase in the field below to recover your wallet (it
            should include 12 word separeted by spaces)
          </div>
        </div>

        <TextArea
          value={typedSeed}
          onChange={seedAdjust}
          rows={4}
          placeholder="Type your seed phrase here..."
          style={{ maxHeight: '80px' }}
        />
        <Button
          className="fullWidth"
          type="primary"
          style={{ marginTop: "20px" }}
          disabled={
            typedSeed.split(" ").length !== 12 || typedSeed.slice(-1) === " "
          }
          onClick={recoverWallet}
        >
          Recover Wallet
        </Button>
        {nonValid && (
          <p style={{ color: "red", fontSize: "12px" }}>Invalid Seed Phrase</p>
        )}
      </div>
      <Button
        type="text"
        className="fullWidth"
        style={{ marginTop: "40px" }}
        onClick={() => navigate("/")}
      >
        Back Home
      </Button>
    </>
  );
}

export default RecoverAccount;
