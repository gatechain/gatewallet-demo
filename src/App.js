import { ethers } from "ethers";
import { useState } from "react";
import { createWalletFromGateChainAccount } from "gatewallet";
import "./App.css";
const config = {
  85: {
    CONTRACT_ADDRESSES: {
      GateChain: "0x71aa80b6360e59eDA365A75DB417e12d3E948C3c",
    },
    contractNames: [
      "BTC_USDT",
      "ETH_USDT",
      "LQTY_USDT",
      "BNX_USDT",
      "ASTR_USDT",
      "INJ_USDT",
      "LTC_USDT",
      "AAVE_USDT",
      "APE_USDT",
      "DOT_USDT",
      "FLOKI_USDT",
      "ADA_USDT",
      "ANKR_USDT",
      "SAND_USDT",
      "BLUR_USDT",
      "LUNC_USDT",
      "SRM_USDT",
      "AXS_USDT",
      "MAGIC_USDT",
      "BONK_USDT",
      "LINK_USDT",
      "CFX_USDT",
      "DYDX_USDT",
      "LUNA_USDT",
      "FTM_USDT",
      "SHIB_USDT",
      "OG_USDT",
      "XEM_USDT",
      "MINA_USDT",
      "OP_USDT",
      "ACH_USDT",
      "SUSHI_USDT",
      "ARB_USDT",
      "NEAR_USDT",
      "BCH_USDT",
      "FIL_USDT",
      "PEOPLE_USDT",
      "GALA_USDT",
      "SXP_USDT",
      "JOE_USDT",
      "AVAX_USDT",
      "EOS_USDT",
      "XRP_USDT",
      "MATIC_USDT",
      "LINA_USDT",
      "ETC_USDT",
      "MASK_USDT",
      "STX_USDT",
      "JASMY_USDT",
      "HOOK_USDT",
      "APT_USDT",
      "DOGE_USDT",
      "AGIX_USDT",
      "RDNT_USDT",
      "RACA_USDT",
      "LDO_USDT",
      "RNDR_USDT",
      "VGX_USDT",
      "ID_USDT",
    ],
  },
};

function App() {
  const [account, setAccount] = useState();
  const [_gateWallet, setGateWallet] = useState(null);

  // 1. 连接钱包
  async function connect() {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setAccount(accounts[0]);
  }

  // 2. 派生钱包
  async function createGateWallet() {
    // 获取provider
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // 获取signer
    const signer = provider.getSigner();
    let chainId = 85; // TODO:项目中需要获取链的ID (demo这里硬编码了)

    const res = await createWalletFromGateChainAccount(
      signer,
      config[chainId], // 这里不同链的合约地址不同
      null
    );
    // 保存 res.publicKeyCompressedHex 压缩公钥 uid 账户地址 + publicKeyCompressedHex
    // 通过服务端来获取 publicKeyCompressedHex ， 如果没有，就重新关联
    const localData =
      JSON.parse(localStorage.getItem("accountAuthSignatures")) || {};

    const _chainId = (await provider.getNetwork()).chainId;
    const isNotAccountSignature =
      _chainId &&
      res.gateAddress &&
      localData[_chainId] &&
      localData[_chainId][res.gateAddress]
        ? false
        : true;

    console.log(_chainId, "chainId");
    // 如果没有签名的需要调用, [交互优化，为了不频繁签名]
    if (isNotAccountSignature) {
      // Metamask 再次对 eddsa pubkey 进行签名，然后将 eddsa pubkey、签名发送到后台
      const accountSignature =
        await res.gateWallet.signCreateAccountAuthorization(signer);

      const data = JSON.stringify({
        ...localData,
        [_chainId]: {
          [res.gateAddress]: accountSignature,
        },
      });
      console.log(accountSignature);
      localStorage.setItem("accountAuthSignatures", data);
    }

    console.log("私钥:", res?.gateWallet.privateKeyHex);
    console.log("gateAddress:", res.gateAddress);
    setGateWallet(res.gateWallet);
  }

  // 3. 签名订单
  function signOrder() {
    // order,cancelOrder的交易体
    // const tx = {
    //   contract: "BTC_USDT",
    //   price: "13458.9",
    //   size: 10000,
    //   user_id: 12,
    // };
    const tx1 = {
      contract: "BTC_USDT",
      price: "86815",
      size: "10000",
      user_id: "1679001941",
    };
    // const tx = {
    //   order_id: 11,
    //   user_id: 12,
    // };
    // withdraw的交易体
    // const tx = {
    //   user_id: 12,
    //   amount: 10000,
    // };
    const type = "order"; // "order" "cancelOrder", "withdraw"
    console.log("type:", type);
    console.log("tx:", tx1);
    console.log(_gateWallet, "-----");
    //签名交易 （第一个参数是tx，第二个参数type）
    try {
      const signature = _gateWallet.getSignature(tx1, type);
      console.log("signature:", signature);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="App">
      <p>Account: {account}</p>
      <button onClick={connect}>1. 连接钱包</button>
      <button onClick={createGateWallet}>2. 派生GateWallet</button>
      <button onClick={signOrder}>3. 签名订单</button>
    </div>
  );
}

export default App;
