import { BeaconWallet } from "@taquito/beacon-wallet";
import { TezosToolkit } from "@taquito/taquito";
import { CachingService } from "./caching.service";
import { address } from "./type-aliases";
export declare enum TzCommunityErrorType {
    ACCESS_TOKEN_NULL = "ACCESS_TOKEN_NULL",
    ACCESS_TOKEN_EXPIRED = "ACCESS_TOKEN_EXPIRED"
}
export declare class TzCommunityError extends Error {
    type: TzCommunityErrorType;
    constructor(message: string, type: TzCommunityErrorType);
}
export declare enum LocalStorageKeys {
    access_token = "access_token",
    refresh_token = "refresh_token",
    id_token = "id_token",
    bigMapsGetKeys = "bigMapsGetKeys"
}
export declare enum SOCIAL_ACCOUNT_TYPE {
    google = "google",
    twitter = "twitter",
    github = "github",
    gitlab = "gitlab",
    slack = "slack"
}
export type UserProfile = {
    displayName: string;
    socialAccountType: SOCIAL_ACCOUNT_TYPE;
    socialAccountAlias: string;
    photo: string;
};
export declare const connectToWeb2Backend: (wallet: BeaconWallet, userAddress: string, publicKey: string, localStorage: CachingService) => Promise<void>;
export declare const loadUserProfiles: (Tezos: TezosToolkit, userAddress: string, localStorage: CachingService) => Promise<Map<address, UserProfile>>;
export declare const getUserProfile: (whateverUserAddress: string, localStorage: CachingService) => Promise<UserProfile | null>;
export declare const refreshToken: (userAddress: string, localStorage: CachingService) => Promise<unknown>;
