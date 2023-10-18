const express = require("express");
const cors = require("cors");
const Moralis = require("moralis").default;
require("dotenv").config();

const app = express();
const port = 5000;
app.use(cors())
app.use(express.json());

app.get("/tokens", async (req, res) => {
  const { userAddress, chain } = req.query;

  const tokens = await Moralis.EvmApi.token.getWalletTokenBalances({
    chain,
    address: userAddress,
  });

  const nfts = await Moralis.EvmApi.nft.getWalletNFTs({
    chain,
    address: userAddress,
    mediaItems: true,
  });


  const balance = await Moralis.EvmApi.balance.getNativeBalance({
    chain,
    address: userAddress,
  });

  const jsonResponse = {
    tokens: tokens.raw,
    nfts: nfts.raw.result.map((e) => {
      if (
        e?.media?.media_collection?.high?.url &&
        !e?.possible_spam &&
        e?.media?.category !== "video"
      ) {
        return e["media"]["media_collection"]["high"]["url"];
      }
    }).filter((e) => !!e),
    balance: balance.raw.balance / (10 ** 18)
  };

  return res.status(200).json(jsonResponse);
});

Moralis.start({
  apiKey: process.env.API_KEY,
}).then(() => {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
});
