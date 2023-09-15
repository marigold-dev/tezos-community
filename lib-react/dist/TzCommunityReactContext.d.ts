import { BeaconWallet } from "@taquito/beacon-wallet";
import { Dispatch, SetStateAction } from "react";
import { CachingService, UserProfile } from "@marigold-dev/tezos-community";
import { address } from "@marigold-dev/tezos-community/dist/type-aliases";
export type TzCommunityReactContextType = {
    userProfiles: Map<address, UserProfile>;
    setUserProfiles: Dispatch<SetStateAction<Map<address, UserProfile>>>;
    userProfile: UserProfile | undefined;
    setUserProfile: Dispatch<SetStateAction<UserProfile | undefined>>;
    localStorage: CachingService;
    connectToWeb2Backend: (wallet: BeaconWallet, userAddress: string, publicKey: string, localStorage: CachingService) => Promise<void>;
};
export declare let TzCommunityReactContext: any;
