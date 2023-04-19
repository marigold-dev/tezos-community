import {
  BigMap,
  MMap,
  address,
  bytes,
  contract,
  nat,
  unit,
} from "./type-aliases";
import {
  ContractAbstractionFromContractType,
  WalletContractAbstractionFromContractType,
} from "./type-utils";

export type Storage = {
  adminsMax: nat;
  ledger: BigMap<address, nat>;
  memberProfileVerified: Array<address>;
  metadata: BigMap<string, bytes>;
  operators: BigMap<address, Array<address>>;
  organizationMax: nat;
  organizations: Array<{
    admins: Array<address>;
    business: string;
    ipfsNftUrl: string;
    logoUrl: string;
    memberRequests: Array<{
      joinRequest: {
        contactId: string;
        contactIdProvider: string;
        orgName: string;
        reason: string;
      };
      user: address;
    }>;
    members: BigMap<address, unit>;
    name: string;
    siteUrl: string;
    status: { aCTIVE: unit } | { fROZEN: unit } | { pENDING_APPROVAL: unit };
    verified: boolean;
  }>;
  owners: Array<address>;
  tezosOrganization: {
    admins: Array<address>;
    business: string;
    ipfsNftUrl: string;
    logoUrl: string;
    memberRequests: Array<{
      joinRequest: {
        contactId: string;
        contactIdProvider: string;
        orgName: string;
        reason: string;
      };
      user: address;
    }>;
    members: BigMap<address, unit>;
    name: string;
    siteUrl: string;
    status: { aCTIVE: unit } | { fROZEN: unit } | { pENDING_APPROVAL: unit };
    verified: boolean;
  };
  token_metadata: BigMap<
    nat,
    {
      token_id: nat;
      token_info: MMap<string, bytes>;
    }
  >;
};

type Methods = {
  activateOrganization: (param: string) => Promise<void>;
  addOrganization: (
    business: string,
    ipfsNftUrl: string,
    logoUrl: string,
    name: string,
    siteUrl: string
  ) => Promise<void>;
  balance_of: (
    requests: Array<{
      owner: address;
      token_id: nat;
    }>,
    callback: contract
  ) => Promise<void>;
  freezeOrganization: (param: string) => Promise<void>;
  removeMember: (
    member: address,
    orgName: string,
    lastAdmin?: address
  ) => Promise<void>;
  removeOrganization: (param: string) => Promise<void>;
  requestToJoinOrganization: (
    contactId: string,
    contactIdProvider: string,
    orgName: string,
    reason: string
  ) => Promise<void>;
  responseToJoinOrganization: (
    membersToApprove: Array<address>,
    membersToDecline: Array<address>,
    orgName: string
  ) => Promise<void>;
  transfer: (
    param: Array<{
      from_: address;
      txs: Array<{
        to_: address;
        token_id: nat;
        amount: nat;
      }>;
    }>
  ) => Promise<void>;
  add_operator: (
    owner: address,
    operator: address,
    token_id: nat
  ) => Promise<void>;
  remove_operator: (
    owner: address,
    operator: address,
    token_id: nat
  ) => Promise<void>;
};

type MethodsObject = {
  activateOrganization: (param: string) => Promise<void>;
  addOrganization: (params: {
    business: string;
    ipfsNftUrl: string;
    logoUrl: string;
    name: string;
    siteUrl: string;
  }) => Promise<void>;
  balance_of: (params: {
    requests: Array<{
      owner: address;
      token_id: nat;
    }>;
    callback: contract;
  }) => Promise<void>;
  freezeOrganization: (param: string) => Promise<void>;
  removeMember: (params: {
    lastAdmin?: address;
    member: address;
    orgName: string;
  }) => Promise<void>;
  removeOrganization: (param: string) => Promise<void>;
  requestToJoinOrganization: (params: {
    contactId: string;
    contactIdProvider: string;
    orgName: string;
    reason: string;
  }) => Promise<void>;
  responseToJoinOrganization: (params: {
    membersToApprove: Array<address>;
    membersToDecline: Array<address>;
    orgName: string;
  }) => Promise<void>;
  transfer: (
    param: Array<{
      from_: address;
      txs: Array<{
        to_: address;
        token_id: nat;
        amount: nat;
      }>;
    }>
  ) => Promise<void>;
  add_operator: (params: {
    owner: address;
    operator: address;
    token_id: nat;
  }) => Promise<void>;
  remove_operator: (params: {
    owner: address;
    operator: address;
    token_id: nat;
  }) => Promise<void>;
};

type contractTypes = {
  methods: Methods;
  methodsObject: MethodsObject;
  storage: Storage;
  code: { __type: "MainCode"; protocol: string; code: object[] };
};
export type MainContractType =
  ContractAbstractionFromContractType<contractTypes>;
export type MainWalletType =
  WalletContractAbstractionFromContractType<contractTypes>;
