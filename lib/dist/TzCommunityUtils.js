import { SigningType } from "@airgap/beacon-types";
import { createMessagePayload, signIn } from "@siwt/sdk";
import * as api from "@tzkt/sdk-api";
import jwt_decode from "jwt-decode";
api.defaults.baseUrl =
    "https://api." + import.meta.env.VITE_NETWORK + ".tzkt.io";
export var TzCommunityErrorType;
(function (TzCommunityErrorType) {
    TzCommunityErrorType["ACCESS_TOKEN_NULL"] = "ACCESS_TOKEN_NULL";
    TzCommunityErrorType["ACCESS_TOKEN_EXPIRED"] = "ACCESS_TOKEN_EXPIRED";
})(TzCommunityErrorType || (TzCommunityErrorType = {}));
export class TzCommunityError extends Error {
    constructor(message, type) {
        super(message);
        Object.defineProperty(this, "type", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.type = type;
    }
}
export var LocalStorageKeys;
(function (LocalStorageKeys) {
    LocalStorageKeys["access_token"] = "access_token";
    LocalStorageKeys["refresh_token"] = "refresh_token";
    LocalStorageKeys["id_token"] = "id_token";
    LocalStorageKeys["bigMapsGetKeys"] = "bigMapsGetKeys";
})(LocalStorageKeys || (LocalStorageKeys = {}));
export var SOCIAL_ACCOUNT_TYPE;
(function (SOCIAL_ACCOUNT_TYPE) {
    SOCIAL_ACCOUNT_TYPE["google"] = "google";
    SOCIAL_ACCOUNT_TYPE["twitter"] = "twitter";
    // facebook = "facebook",
    SOCIAL_ACCOUNT_TYPE["github"] = "github";
    SOCIAL_ACCOUNT_TYPE["gitlab"] = "gitlab";
    // microsoft = "microsoft",
    SOCIAL_ACCOUNT_TYPE["slack"] = "slack";
    //reddit = "reddit",
    //telegram = "telegram",
})(SOCIAL_ACCOUNT_TYPE || (SOCIAL_ACCOUNT_TYPE = {}));
export const connectToWeb2Backend = async (wallet, userAddress, publicKey, localStorage) => {
    // create the message to be signed
    const messagePayload = createMessagePayload({
        dappUrl: "tezos-community.com",
        pkh: userAddress,
    });
    // request the signature
    let signedPayload = await wallet.client.requestSignPayload({
        ...messagePayload,
        signingType: SigningType.MICHELINE,
    });
    // sign in the user to our app
    const res = (await signIn(import.meta.env.VITE_TZCOMMUNITY_BACKEND_URL + "/siwt")({
        pk: publicKey,
        pkh: userAddress,
        message: messagePayload.payload,
        signature: signedPayload.signature,
    }));
    const { accessToken, idToken, refreshToken } = (await res).data;
    console.log("SIWT Connected to web2 backend", jwt_decode(idToken));
    await localStorage.set(LocalStorageKeys.access_token, accessToken);
    await localStorage.set(LocalStorageKeys.refresh_token, refreshToken);
    await localStorage.set(LocalStorageKeys.id_token, idToken);
    console.log("tokens stored", await localStorage.get(LocalStorageKeys.id_token));
};
export const loadUserProfiles = async (Tezos, userAddress, localStorage) => {
    const accessToken = await localStorage.get(LocalStorageKeys.access_token);
    if (!accessToken) {
        console.error("you lost the SIWT accessToken, please reconnect...");
        throw new TzCommunityError("you lost the SIWT accessToken, please reconnect...", TzCommunityErrorType.ACCESS_TOKEN_NULL);
    }
    let userProfiles = new Map();
    const mainWalletType = await Tezos.wallet.at(import.meta.env.VITE_TZCOMMUNITY_CONTRACT_ADDRESS);
    const storage = await mainWalletType.storage();
    await Promise.all(storage.organizations.map(async (orgItem) => {
        const membersBigMapId = orgItem.members.id.toNumber();
        const url = LocalStorageKeys.bigMapsGetKeys + membersBigMapId;
        let keys = await localStorage.getWithTTL(url);
        if (!keys) {
            //console.warn("cache is empty for key : ", url);
            try {
                keys = await api.bigMapsGetKeys(membersBigMapId, {
                    micheline: "Json",
                    active: true,
                });
                await localStorage.setWithTTL(url, keys);
            }
            catch (error) {
                console.error("TZKT call failed", error);
            }
        }
        if (keys) {
            //check if member is part of it OR super admin
            if (keys.findIndex((key) => key.key === userAddress) >= 0 ||
                storage.tezosOrganization.admins.indexOf(userAddress) >= 0) {
                console.log("cache userprofiles as member is part of it OR super admin", keys);
                for (const key of keys) {
                    const up = await getUserProfile(key.key, localStorage);
                    if (up) {
                        userProfiles.set(key.key, up);
                    }
                }
            }
        }
    }));
    return userProfiles;
};
export const getUserProfile = async (whateverUserAddress, localStorage) => {
    console.log("getUserProfile", whateverUserAddress);
    try {
        const accessToken = await localStorage.get(LocalStorageKeys.access_token);
        if (!accessToken) {
            console.warn("you lost the SIWT accessToken, please reconnect...");
            throw new TzCommunityError("you lost the SIWT accessToken, please reconnect...", TzCommunityErrorType.ACCESS_TOKEN_NULL);
        }
        const url = import.meta.env.VITE_TZCOMMUNITY_BACKEND_URL +
            "/user/" +
            whateverUserAddress;
        const up = await localStorage.getWithTTL(url);
        //console.log("getUserProfile - localStorage.getWithTTL", up, url);
        if (up && Object.keys(up).length > 0) {
            //not empty
            return new Promise((resolve, _) => resolve(up));
        }
        else if (up && Object.keys(up).length === 0) {
            //empty
            return new Promise((resolve, _) => resolve(null));
        }
        else {
            console.log("getUserProfile - fetch", url);
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    authorization: "Bearer " + accessToken,
                },
            });
            const json = await response.json();
            console.log("getUserProfile - fetch", url, json);
            if (response.ok) {
                await localStorage.setWithTTL(url, json);
                return new Promise((resolve, _) => resolve(json));
            }
            else if (response.status === 401 || response.status === 403) {
                console.error("SIWT accessToken expired, try to refresh the token...");
                throw new TzCommunityError("SIWT accessToken expired, try to refresh the token...", TzCommunityErrorType.ACCESS_TOKEN_EXPIRED);
            }
            else {
                //console.warn("User Profile not found", response);
                await localStorage.setWithTTL(url, {});
                return new Promise((resolve, _) => resolve(null));
            }
        }
    }
    catch (error) {
        console.error("error", error);
        if (error instanceof TzCommunityError) {
            return new Promise((_, reject) => reject(error));
        }
        else {
            return new Promise((resolve, _) => resolve(null));
        }
    }
};
export const refreshToken = async (userAddress, localStorage) => {
    try {
        console.log("**************refreshToken", userAddress, localStorage);
        const response = await fetch(import.meta.env.VITE_TZCOMMUNITY_BACKEND_URL + "/siwt/refreshToken", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                refreshToken: await localStorage.get("refresh_token"),
                pkh: userAddress,
            }),
        });
        const data = await response.json();
        if (response.ok) {
            const { accessToken, idToken, refreshToken } = data;
            console.log("SIWT reconnected to web2 backend", jwt_decode(idToken));
            await localStorage.set(LocalStorageKeys.access_token, accessToken);
            await localStorage.set(LocalStorageKeys.refresh_token, refreshToken);
            await localStorage.set(LocalStorageKeys.id_token, idToken);
            console.log("tokens stored", await localStorage.get(LocalStorageKeys.id_token));
        }
        else {
            console.error("error trying to refresh token", response);
            return new Promise((resolve, _) => resolve(null));
        }
    }
    catch (error) {
        console.error("error refreshToken", error); //cannot do more because session is dead
        throw new TzCommunityError("you lost the SIWT accessToken, please reconnect...", TzCommunityErrorType.ACCESS_TOKEN_EXPIRED);
    }
};
