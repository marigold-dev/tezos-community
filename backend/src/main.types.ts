import { BigMap, address, nat, unit } from './type-aliases';
import {
  ContractAbstractionFromContractType,
  WalletContractAbstractionFromContractType,
} from './type-utils';

export type Storage = {
  limits: {
    adminsMax: nat;
    memberRequestMax: nat;
    organizationMax: nat;
  };
  nftAddress: address;
  organizations: Array<{
    admins: Array<address>;
    autoRegistration: boolean;
    business: string;
    fundingAddress?: address;
    ipfsNftUrl: string;
    logoUrl: string;
    memberRequests: Array<{
      joinRequest: {
        orgName: string;
        reason: string;
      };
      user: address;
    }>;
    members: BigMap<address, unit>;
    name: string;
    siteUrl: string;
    status: { active: unit } | { frozen: unit } | { pendingApproval: unit };
  }>;
  tezosOrganization: {
    admins: Array<address>;
    autoRegistration: boolean;
    business: string;
    fundingAddress?: address;
    ipfsNftUrl: string;
    logoUrl: string;
    memberRequests: Array<{
      joinRequest: {
        orgName: string;
        reason: string;
      };
      user: address;
    }>;
    members: BigMap<address, unit>;
    name: string;
    siteUrl: string;
    status: { active: unit } | { frozen: unit } | { pendingApproval: unit };
  };
};

type Methods = {
  activateOrganization: (param: string) => Promise<void>;
  addAdmin: (admin: address, orgName: string) => Promise<void>;
  addOrganization: (
    autoRegistration: boolean,
    business: string,
    fundingAddress: address | null,
    ipfsNftUrl: string,
    logoUrl: string,
    name: string,
    siteUrl: string,
  ) => Promise<void>;
  addTezosAdmin: (param: address) => Promise<void>;
  changeLimits: (
    adminsMax: nat,
    memberRequestMax: nat,
    organizationMax: nat,
  ) => Promise<void>;
  freezeOrganization: (param: string) => Promise<void>;
  removeAdmin: (
    admin: address,
    lastAdmin: address | null,
    orgName: string,
  ) => Promise<void>;
  removeMember: (member: address, orgName: string) => Promise<void>;
  removeOrganization: (param: string) => Promise<void>;
  replyToMessage: (_0: nat, _1: string, _2: string) => Promise<void>;
  requestToJoinOrganization: (orgName: string, reason: string) => Promise<void>;
  responseToJoinOrganization: (
    membersToApprove: Array<address>,
    membersToDecline: Array<address>,
    orgName: string,
  ) => Promise<void>;
  sendMessage: (_0: string, _1: string) => Promise<void>;
  updateOrganization: (
    autoRegistration: boolean,
    business: string,
    fundingAddress: address | null,
    ipfsNftUrl: string,
    logoUrl: string,
    name: string,
    siteUrl: string,
  ) => Promise<void>;
};

type MethodsObject = {
  activateOrganization: (param: string) => Promise<void>;
  addAdmin: (params: { admin: address; orgName: string }) => Promise<void>;
  addOrganization: (params: {
    autoRegistration: boolean;
    business: string;
    fundingAddress?: address;
    ipfsNftUrl: string;
    logoUrl: string;
    name: string;
    siteUrl: string;
  }) => Promise<void>;
  addTezosAdmin: (param: address) => Promise<void>;
  changeLimits: (params: {
    adminsMax: nat;
    memberRequestMax: nat;
    organizationMax: nat;
  }) => Promise<void>;
  freezeOrganization: (param: string) => Promise<void>;
  removeAdmin: (params: {
    admin: address;
    lastAdmin?: address;
    orgName: string;
  }) => Promise<void>;
  removeMember: (params: { member: address; orgName: string }) => Promise<void>;
  removeOrganization: (param: string) => Promise<void>;
  replyToMessage: (params: { 0: nat; 1: string; 2: string }) => Promise<void>;
  requestToJoinOrganization: (params: {
    orgName: string;
    reason: string;
  }) => Promise<void>;
  responseToJoinOrganization: (params: {
    membersToApprove: Array<address>;
    membersToDecline: Array<address>;
    orgName: string;
  }) => Promise<void>;
  sendMessage: (params: { 0: string; 1: string }) => Promise<void>;
  updateOrganization: (params: {
    autoRegistration: boolean;
    business: string;
    fundingAddress?: address;
    ipfsNftUrl: string;
    logoUrl: string;
    name: string;
    siteUrl: string;
  }) => Promise<void>;
};

type contractTypes = {
  methods: Methods;
  methodsObject: MethodsObject;
  storage: Storage;
  code: { __type: 'MainCode'; protocol: string; code: object[] };
};
export type MainContractType =
  ContractAbstractionFromContractType<contractTypes>;
export type MainWalletType =
  WalletContractAbstractionFromContractType<contractTypes>;
