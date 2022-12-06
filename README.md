# GateWallet Demo

### start

> TODO: gatewallet@1.0.24

```
yarn start
```

### Function

```js
import { createWalletFromGateChainAccount } from "gatewallet";

// 派生钱包 (弹窗第1次)
const res = await createWalletFromGateChainAccount(signer, config, null);
// 获取签名 (弹窗第2次)
const accountSignature = await res.gateWallet.signCreateAccountAuthorization(
  provider,
  signer
);

// 交易签名
// tx: 交易体
// type: "order" | "cancelOrder" | "withdraw"
const signature = res.gateWallet.getSignature(tx, type);
```
