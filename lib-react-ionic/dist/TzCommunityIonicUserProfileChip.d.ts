import { address } from "@marigold-dev/tezos-community/dist/type-aliases";
import { CSSProperties } from "react";
import { UserProfile } from "@marigold-dev/tezos-community";
type TzCommunityIonicUserProfileChipProps = {
    userProfiles: Map<address, UserProfile>;
    address: address;
    color?: string;
    style?: CSSProperties;
};
export declare const TzCommunityIonicUserProfileChip: ({ userProfiles, address, color, style, }: TzCommunityIonicUserProfileChipProps) => any;
export {};
