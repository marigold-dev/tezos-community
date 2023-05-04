import { BigMap, address, nat, unit } from "./type-aliases";
import {
  ContractAbstractionFromContractType,
  WalletContractAbstractionFromContractType,
} from "./type-utils";

export type Storage = {
  adminsMax: nat;
  memberProfileVerified: Array<address>;
  nftAddress: address;
  organizationMax: nat;
  organizations: Array<{
    admins: Array<address>;
    business: string;
    fundingAddress?: address;
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
  tezosOrganization: {
    admins: Array<address>;
    business: string;
    fundingAddress?: address;
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
};

type Methods = {
  activateOrganization: (param: string) => Promise<void>;
  addOrganization: (
    business: string,
    fundingAddress: address | undefined,
    ipfsNftUrl: string,
    logoUrl: string,
    name: string,
    siteUrl: string
  ) => Promise<void>;
  freezeOrganization: (param: string) => Promise<void>;
  removeMember: (
    lastAdmin: address | undefined,
    member: address,
    orgName: string
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
};

type MethodsObject = {
  activateOrganization: (param: string) => Promise<void>;
  addOrganization: (params: {
    business: string;
    fundingAddress?: address;
    ipfsNftUrl: string;
    logoUrl: string;
    name: string;
    siteUrl: string;
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
