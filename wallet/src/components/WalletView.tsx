import { useCallback, useEffect, useState } from "react";
import { LoginOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Divider,
  Input,
  List,
  Spin,
  Tabs,
  Tooltip,
} from "antd";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import logo from "../logo.svg";
import { tokensApi } from "../api";
import { CHAINS_CONFIG } from "../chains";

interface IToken {
  token_address: string;
  name: string;
  symbol: string;
  logo: string;
  thumbnail: string;
  decimals: number;
  balance: string;
  possible_spam: boolean;
}

interface Props {
  wallet: any;
  setWallet: any;
  seedPhrase: any;
  setSeedPhrase: any;
  selectedChain: any;
}

function WalletView({
  wallet,
  setWallet,
  seedPhrase,
  setSeedPhrase,
  selectedChain,
}: Props) {
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [tokens, setTokens] = useState<IToken[]>([]);
  const [nfts, setNfts] = useState<string[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [sendToAddress, setSendToAddress] = useState<string>("");
  const [amountToSend, setAmountToSend] = useState<string>("");
  const [processing, setProcessing] = useState<boolean>(false);
  const [hash, setHash] = useState<string>("");

  const getTokens = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await tokensApi.getTokens({
        userAddress: wallet,
        chain: selectedChain,
      });
      setTokens(data.tokens);
      setNfts(data.nfts);
      setBalance(data.balance);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [wallet, selectedChain]);

  useEffect(() => {
    if (wallet && selectedChain) {
      getTokens();
    }
  }, [getTokens, selectedChain, wallet]);

  const sendTransaction = async (to: string, amount: string) => {
    const chain = CHAINS_CONFIG[selectedChain];

    const provider = new ethers.JsonRpcProvider(chain.rpcUrl);
    const privateKey = ethers.Wallet.fromPhrase(seedPhrase).privateKey;
    const wallet = new ethers.Wallet(privateKey, provider);

    const tx = {
      to,
      value: ethers.parseEther(amount.toString()),
    };
    setProcessing(true);
    try {
      const transaction = await wallet.sendTransaction(tx);
      setHash(transaction.hash);
      const receipt = await transaction.wait();

      setHash("");
      setProcessing(false);
      setAmountToSend("");
      setSendToAddress("");

      if (receipt?.status === 1) {
        getTokens();
      } else {
        console.log("failed");
      }
    } catch (error) {
      setHash("");
      setProcessing(false);
      setAmountToSend("");
      setSendToAddress("");
    }
  };

  const tabs = [
    {
      key: "3",
      label: "Tokens",
      children: (
        <>
          {tokens?.length ? (
            <>
              <List
                bordered
                itemLayout="horizontal"
                dataSource={tokens}
                renderItem={(item, index) => (
                  <List.Item style={{ textAlign: "left" }}>
                    <List.Item.Meta
                      avatar={<Avatar src={item?.logo || logo} />}
                      title={item.symbol}
                      description={item.name}
                    ></List.Item.Meta>
                    <div>
                      {(
                        Number(item.balance) /
                        100 ** Number(item.decimals)
                      ).toFixed(2)}{" "}
                      {item.symbol}
                    </div>
                  </List.Item>
                )}
              ></List>
            </>
          ) : (
            <div>
              <span>You seem to not have any tokens yet</span>
              <p style={{ fontSize: "12px" }}>
                Find Alt Coins Gems:{" "}
                <a href="https://coinmarketcap.com/">coinmarketcap.com</a>
              </p>
            </div>
          )}
        </>
      ),
    },
    {
      key: "2",
      label: "NFTs",
      children: (
        <>
          {nfts?.length ? (
            <>
              {nfts.map((item, index) => (
                <img
                  key={index}
                  src={item}
                  className="nftImage"
                  alt={"nftImage"}
                />
              ))}
            </>
          ) : (
            <div>
              <span>You seem to not have any tokens yet</span>
              <p style={{ fontSize: "12px" }}>
                Find Alt Coins Gems:{" "}
                <a href="https://coinmarketcap.com/">coinmarketcap.com</a>
              </p>
            </div>
          )}
        </>
      ),
    },
    {
      key: "1",
      label: "Transfer",
      children: (
        <>
          <h3 style={{ margin: 0, color: "#888" }}>Native Balance</h3>
          <h1 style={{ marginTop: 0 }}>
            {balance.toFixed(2)} {CHAINS_CONFIG[selectedChain].ticker}
          </h1>
          <div className="sendRow">
            <p style={{ width: "90px", textAlign: "left" }}> To:</p>
            <Input
              value={sendToAddress}
              onChange={(e) => setSendToAddress(e.target.value)}
              placeholder="0x..."
            />
          </div>
          <div className="sendRow">
            <p style={{ width: "90px", textAlign: "left" }}> Amount:</p>
            <Input
              value={amountToSend}
              onChange={(e) => setAmountToSend(e.target.value)}
              placeholder="Native tokens you wish to send..."
            />
          </div>
          <Button
            className="fullWidth"
            style={{
              marginTop: "20px",
              marginBottom: "20px",
            }}
            type="primary"
            onClick={() => sendTransaction(sendToAddress, amountToSend)}
          >
            Send Tokens
          </Button>
          {processing && (
            <>
              <Spin />
              {hash && (
                <Tooltip title={hash}>
                  <p>Hover For Tx Hash</p>
                </Tooltip>
              )}
            </>
          )}
        </>
      ),
    },
  ];

  const logout = () => {
    setWallet("");
    setSeedPhrase("");
    setTokens([]);
    setNfts([]);
    setBalance(0);
    navigate("/");
  };

  return (
    <>
      <div className="content">
        <div className="logoutButton" onClick={logout}>
          <LoginOutlined />
        </div>
        <div className="walletName" style={{ textAlign: "left" }}>
          <h4 style={{ marginBottom: 0 }}>Wallet</h4>
          {/* <p style={{ fontSize: "12px" }}>{wallet}</p> */}
          <Tooltip title={wallet}>
            <div>
              {wallet.slice(0, 4)}...{wallet.slice(38)}
            </div>
          </Tooltip>
        </div>
        <Divider />
        {loading ? (
          <Spin />
        ) : (
          <Tabs defaultActiveKey="1" items={tabs} className="walletView" />
        )}
      </div>
    </>
  );
}

export default WalletView;
