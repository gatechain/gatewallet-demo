interface Config {
  CONTRACT_ADDRESSES: {
    GateChain: string;
  };
  contractLeftMap: {
    [key: string]: number;
  };
  contractRightMap: {
    [key: string]: number;
  };
  // 一下是默认参数，非必传
  METAMASK_MESSAGE?: string;
  EIP_712_PROVIDER?: string;
  EIP_712_VERSION?: string;
  CREATE_ACCOUNT_AUTH_MESSAGE?: string;
}
const config: Config = {
  CONTRACT_ADDRESSES: {
    GateChain: "11",
  },
  contractLeftMap: {
    123: 1,
  },
  contractRightMap: {
    123: 1,
  },
};
