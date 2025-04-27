export const DisputeManager = {
  address: "0x15a22976037B6aD359d644a281536BFBBc8797C3",
  abi: [
    {
      inputs: [
        {
          internalType: "address",
          name: "_insuranceContract",
          type: "address",
        },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "owner",
          type: "address",
        },
      ],
      name: "OwnableInvalidOwner",
      type: "error",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
      ],
      name: "OwnableUnauthorizedAccount",
      type: "error",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "policyId",
          type: "uint256",
        },
      ],
      name: "DisputeInitiated",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "uint256",
          name: "policyId",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "bool",
          name: "approved",
          type: "bool",
        },
      ],
      name: "DisputeResolved",
      type: "event",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_policyId",
          type: "uint256",
        },
        {
          internalType: "bool",
          name: "_approved",
          type: "bool",
        },
      ],
      name: "executeResolution",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "uint256",
          name: "_policyId",
          type: "uint256",
        },
      ],
      name: "initiateDispute",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "previousOwner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "OwnershipTransferred",
      type: "event",
    },
    {
      inputs: [],
      name: "renounceOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "_governanceDao",
          type: "address",
        },
      ],
      name: "setGovernanceDao",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        {
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "transferOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "governanceDao",
      outputs: [
        {
          internalType: "contract GovernanceDao",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "insuranceContract",
      outputs: [
        {
          internalType: "contract InsuranceContract",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "owner",
      outputs: [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      stateMutability: "view",
      type: "function",
    },
  ],
} as const;
