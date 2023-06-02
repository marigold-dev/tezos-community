import {
  IonApp,
  IonRouterOutlet,
  RefresherEventDetail,
  setupIonicReact,
} from "@ionic/react";
import { useHistory } from "react-router-dom";

import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router-dom";
import { Socket, io } from "socket.io-client";
/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/display.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";

/* Theme variables */
import { LocalNotifications } from "@capacitor/local-notifications";
import jwt_decode from "jwt-decode";
import "./theme/variables.css";

import { MichelsonPrimitives, NetworkType } from "@airgap/beacon-types";
import { MichelineMichelsonV1Expression } from "@airgap/beacon-types/dist/esm/types/tezos/MichelineMichelsonV1Expression";
import { Storage as LocalStorage } from "@ionic/storage";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { TezosToolkit } from "@taquito/taquito";
import { TokenMetadata, tzip12 } from "@taquito/tzip12";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { MainWalletType, Storage } from "./main.types";
import { NftWalletType, Storage as StorageNFT } from "./nft.types";
import { FAQScreen } from "./pages/FAQScreen";
import { FundingScreen } from "./pages/FundingScreen";
import { OrganizationScreen } from "./pages/OrganizationScreen";
import { OrganizationsScreen } from "./pages/OrganizationsScreen";
import { BigMap, address, nat, unit } from "./type-aliases";
setupIonicReact();

const localStorage = new LocalStorage();

export const refreshToken = async (userAddress: string) => {
  try {
    const response = await fetch(
      process.env.REACT_APP_BACKEND_URL + "/siwt/refreshToken",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refreshToken: await localStorage.get("refresh_token"),
          pkh: userAddress,
        }),
      }
    );
    const data = await response.json();
    if (response.ok) {
      const { accessToken, idToken, refreshToken } = data;
      console.log("SIWT reconnected to web2 backend", jwt_decode(idToken));

      localStorage.set("access_token", accessToken);
      localStorage.set("refresh_token", refreshToken);
      localStorage.set("id_token", idToken);
    } else {
      console.error("error trying to refresh token", response);
      return new Promise((resolve, reject) => resolve(null));
    }
  } catch (error) {
    console.error("error", error);
    return new Promise((resolve, reject) => resolve(null));
  }
};

export type TZIP21TokenMetadata = TokenMetadata & {
  artifactUri?: string; //A URI (as defined in the JSON Schema Specification) to the asset.
  displayUri?: string; //A URI (as defined in the JSON Schema Specification) to an image of the asset.
  thumbnailUri?: string; //A URI (as defined in the JSON Schema Specification) to an image of the asset for wallets and client applications to have a scaled down image to present to end-users.
  description?: string; //General notes, abstracts, or summaries about the contents of an asset.
  minter?: string; //The tz address responsible for minting the asset.
  creators?: string[]; //The primary person, people, or organization(s) responsible for creating the intellectual content of the asset.
  isBooleanAmount?: boolean; //Describes whether an account can have an amount of exactly 0 or 1. (The purpose of this field is for wallets to determine whether or not to display balance information and an amount field when transferring.)
};

export enum SOCIAL_ACCOUNT_TYPE {
  // GOOGLE = "GOOGLE",
  TWITTER = "twitter",
  /* WHATSAPP = "WHATSAPP",
  FACEBOOK = "FACEBOOK",
  DISCORD = "DISCORD",
  TELEGRAM = "TELEGRAM",
  SLACK = "SLACK",*/
}

export type UserProfile = {
  displayName: string;
  socialAccountType: SOCIAL_ACCOUNT_TYPE;
  socialAccountAlias: string;
  photo: string;
};

export type MemberRequest = {
  joinRequest: {
    contactId: string;
    contactIdProvider: string;
    orgName: string;
    reason: string;
  };
  user: address;
};

export type Limits = {
  adminsMax: nat;
  memberRequestMax: nat;
  organizationMax: nat;
};

export type Organization = {
  admins: Array<address>;
  business: string;
  fundingAddress: address | null;
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
  status: { active: unit } | { frozen: unit } | { pendingApproval: unit };
};

export type UserContextType = {
  storage: Storage | null;
  setStorage: Dispatch<SetStateAction<Storage | null>>;
  storageNFT: StorageNFT | null;
  userAddress: string;
  setUserAddress: Dispatch<SetStateAction<string>>;
  userProfiles: Map<address, UserProfile>;
  setUserProfiles: Dispatch<SetStateAction<Map<address, UserProfile>>>;
  userProfile: UserProfile | null;
  setUserProfile: Dispatch<SetStateAction<UserProfile | null>>;
  userBalance: number;
  setUserBalance: Dispatch<SetStateAction<number>>;
  Tezos: TezosToolkit;
  wallet: BeaconWallet;
  mainWalletType: MainWalletType | null;
  nftWalletType: NftWalletType | null;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  disconnectWallet: () => Promise<void>;
  getUserProfile: (whateverUserAddress: string) => Promise<UserProfile | null>;
  refreshStorage: (event?: CustomEvent<RefresherEventDetail>) => Promise<void>;
  nftContratTokenMetadataMap: Map<number, TZIP21TokenMetadata>;
  socket: Socket;
  localStorage: LocalStorage;
};
export let UserContext = React.createContext<UserContextType | null>(null);

const App: React.FC = () => {
  const socket: Socket = io(process.env.REACT_APP_BACKEND_URL!);

  const history = useHistory();

  const [Tezos, setTezos] = useState<TezosToolkit>(
    new TezosToolkit(
      "https://" + process.env.REACT_APP_NETWORK + ".tezos.marigold.dev"
    )
  );
  const [wallet, setWallet] = useState<BeaconWallet>(
    new BeaconWallet({
      name: "TzCommunity",
      preferredNetwork: process.env.REACT_APP_NETWORK
        ? NetworkType[
            process.env.REACT_APP_NETWORK.toUpperCase() as keyof typeof NetworkType
          ]
        : NetworkType.GHOSTNET,
    })
  );
  const [userAddress, setUserAddress] = useState<string>("");
  const [userBalance, setUserBalance] = useState<number>(0);
  const [userProfiles, setUserProfiles] = useState<Map<address, UserProfile>>(
    new Map()
  );
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [storage, setStorage] = useState<Storage | null>(null);
  const [mainWalletType, setMainWalletType] = useState<MainWalletType | null>(
    null
  );
  const [storageNFT, setStorageNFT] = useState<StorageNFT | null>(null);
  const [nftWalletType, setNftWalletType] = useState<NftWalletType | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);

  //NFT
  const [nftContratTokenMetadataMap, setNftContratTokenMetadataMap] = useState<
    Map<number, TZIP21TokenMetadata>
  >(new Map());

  //for the message subscriptions
  const [subscriptionsDone, setSubscriptionsDone] = useState<boolean>(false); //do registration only once
  const organizationActivatedSubscription = Tezos.stream.subscribeEvent({
    tag: "organizationActivated",
    address: process.env.REACT_APP_CONTRACT_ADDRESS!,
  });
  const organizationFrozenSubscription = Tezos.stream.subscribeEvent({
    tag: "organizationFrozen",
    address: process.env.REACT_APP_CONTRACT_ADDRESS!,
  });
  const organizationAddedSubscription = Tezos.stream.subscribeEvent({
    tag: "organizationAdded",
    address: process.env.REACT_APP_CONTRACT_ADDRESS!,
  });
  const joinOrganizationRequestSubscription = Tezos.stream.subscribeEvent({
    tag: "joinOrganizationRequest",
    address: process.env.REACT_APP_CONTRACT_ADDRESS!,
  });
  const orgMemberRequestsUpdatedSubscription = Tezos.stream.subscribeEvent({
    tag: "orgMemberRequestsUpdated",
    address: process.env.REACT_APP_CONTRACT_ADDRESS!,
  });

  const [notificationId, setNotificationId] = useState<number>(0);
  const getNextNotificationId = () => {
    const newNextNotificationId = notificationId + 1;
    setNotificationId(newNextNotificationId);
    return newNextNotificationId;
  };

  useEffect(() => {
    Tezos.setWalletProvider(wallet);
    setTezos(Tezos); //object changed and needs propagation

    (async () => {
      console.log("After wallet change I refresh storage");
      await refreshStorage();
    })();
  }, [userAddress]);

  //subscriptions
  useEffect(() => {
    (async () => {
      try {
        // Request/ check permissions
        const ps = await LocalNotifications.checkPermissions();
        if (ps.display == "prompt") {
          await LocalNotifications.requestPermissions();
          console.log("Ask to allow notifications");
        } else {
          console.log("Notifications status : ", ps.display);
        }

        if (storage && !subscriptionsDone) {
          // Clear old notifications in prep for refresh (OPTIONAL)
          const pending = await LocalNotifications.getPending();
          if (pending.notifications.length > 0)
            await LocalNotifications.cancel(pending);

          //only for Tezos admins
          if (
            storage &&
            storage?.tezosOrganization.admins.indexOf(userAddress as address) >=
              0
          ) {
            organizationActivatedSubscription.on("data", async (e) => {
              console.log("on organizationActivated event :", e);
              if (!e.result.errors || e.result.errors.length === 0) {
                await LocalNotifications.schedule({
                  notifications: [
                    {
                      title: "TzCommunity - Organization activated",
                      body:
                        "Tezos organization '" +
                        Object.entries(e.payload!)[0][1] +
                        "' has been activated",
                      id: getNextNotificationId(),
                      autoCancel: true,
                    },
                  ],
                });
                await refreshStorage();
              } else
                console.log(
                  "Warning : here we ignore a failing transaction event"
                );
            });

            organizationFrozenSubscription.on("data", async (e) => {
              console.log("on organizationFrozen event :", e);
              if (!e.result.errors || e.result.errors.length === 0) {
                await LocalNotifications.schedule({
                  notifications: [
                    {
                      title: "TzCommunity - Organization frozen",
                      body:
                        "Tezos organization '" +
                        Object.entries(e.payload!)[0][1] +
                        "' has been frozen",
                      id: getNextNotificationId(),
                    },
                  ],
                });
                await refreshStorage();
              } else
                console.log(
                  "Warning : here we ignore a failing transaction event"
                );
            });

            organizationAddedSubscription.on("data", async (e) => {
              console.log("on organizationAdded event :", e);
              if (!e.result.errors || e.result.errors.length === 0) {
                await LocalNotifications.schedule({
                  notifications: [
                    {
                      title: "TzCommunity - Organization added",
                      body:
                        "Tezos organization '" +
                        Object.entries(e.payload!)[0][1] +
                        "' has been added",
                      id: getNextNotificationId(),
                      autoCancel: true,
                    },
                  ],
                });

                await refreshStorage();
              } else
                console.log(
                  "Warning : here we ignore a failing transaction event"
                );
            });
          }

          //only for organization administrators
          const myOrganizationsAsAdmin = storage?.organizations.filter(
            (orgItem: Organization) =>
              orgItem.admins.indexOf(userAddress as address) >= 0 ? true : false
          );
          console.log("myOrganizationsAsAdmin", myOrganizationsAsAdmin);

          if (storage && myOrganizationsAsAdmin.length > 0) {
            joinOrganizationRequestSubscription.on("data", async (e) => {
              console.log("on joinOrganizationRequest event :", e);
              const orgname = (
                e.payload! as {
                  string: string;
                }
              ).string;
              if (
                (!e.result.errors || e.result.errors.length === 0) &&
                myOrganizationsAsAdmin.findIndex(
                  (orgItem: Organization) => orgItem.name === orgname
                ) >= 0
              ) {
                await LocalNotifications.schedule({
                  notifications: [
                    {
                      title: "TzCommunity - Join organization request",
                      body:
                        "As organization administrator of '" +
                        orgname +
                        "', you have a new member request",
                      id: getNextNotificationId(),
                      autoCancel: true,
                    },
                  ],
                });

                await refreshStorage(); //we need to refresh automaticcaly to display new user requests
              } else
                console.log(
                  "Warning : here we ignore a failing transaction event"
                );
            });
          }

          //for all users
          orgMemberRequestsUpdatedSubscription.on("data", async (e) => {
            console.log("on orgMemberRequestsUpdated event :", e);
            const membersToApprove: address[] = (
              (
                (
                  e.payload! as {
                    prim: MichelsonPrimitives;
                    args?: MichelineMichelsonV1Expression[] | undefined;
                    annots?: string[] | undefined;
                  }
                ).args![0] as {
                  prim: MichelsonPrimitives;
                  args?: MichelineMichelsonV1Expression[] | undefined;
                  annots?: string[] | undefined;
                }
              ).args![0] as {
                bytes: string;
              }[]
            ).map((addr) => addr.bytes as address);

            const membersToDecline: address[] = (
              (
                (
                  e.payload! as {
                    prim: MichelsonPrimitives;
                    args?: MichelineMichelsonV1Expression[] | undefined;
                    annots?: string[] | undefined;
                  }
                ).args![0] as {
                  prim: MichelsonPrimitives;
                  args?: MichelineMichelsonV1Expression[] | undefined;
                  annots?: string[] | undefined;
                }
              ).args![1] as {
                bytes: string;
              }[]
            ).map((addr) => addr.bytes as address);
            const orgname: string = (
              (
                e.payload! as {
                  prim: MichelsonPrimitives;
                  args?: MichelineMichelsonV1Expression[] | undefined;
                  annots?: string[] | undefined;
                }
              ).args![1] as {
                string: string;
              }
            ).string;
            console.log(
              "membersToApprove",
              membersToApprove,
              "membersToDecline",
              membersToDecline,
              "orgname",
              orgname
            );

            if (
              (!e.result.errors || e.result.errors.length === 0) &&
              (membersToApprove.indexOf(userAddress as address) >= 0 ||
                membersToDecline.indexOf(userAddress as address) >= 0)
            ) {
              await LocalNotifications.schedule({
                notifications: [
                  {
                    title: "TzCommunity - Member join request updated",
                    body:
                      "Tezos organization '" +
                      orgname +
                      "' has been " +
                      (membersToApprove.indexOf(userAddress as address) >= 0
                        ? "accepted"
                        : "rejected") +
                      " your request to join",
                    id: getNextNotificationId(),
                    autoCancel: true,
                  },
                ],
              });
              await refreshStorage();
            }
          });

          setSubscriptionsDone(true);
          console.log("Event subscription done");
        } else {
        }
      } catch (error) {
        console.log("Error", error);
      }
    })();
  }, [storage]);

  const refreshStorage = async (
    event?: CustomEvent<RefresherEventDetail>
  ): Promise<void> => {
    if (wallet) {
      const activeAccount = await wallet.client.getActiveAccount();
      var userAddress: string;
      if (activeAccount) {
        userAddress = activeAccount.address;
        setUserAddress(userAddress);
        const balance = await Tezos.tz.getBalance(userAddress);
        setUserBalance(balance.toNumber());

        //only refresh userProfile if there is SIWT
        if (await localStorage.get("access_token")) {
          const newUserProfile = await getUserProfile(userAddress);
          if (newUserProfile) {
            userProfiles.set(userAddress as address, newUserProfile);
            setUserProfiles(userProfiles);
            console.log(
              "userProfile refreshed for " + userAddress,
              newUserProfile
            );
          }
        }
      }

      console.log(
        "REACT_APP_CONTRACT_ADDRESS:",
        process.env.REACT_APP_CONTRACT_ADDRESS!
      );
      console.log("REACT_APP_BACKEND_URL:", process.env.REACT_APP_BACKEND_URL!);

      const mainWalletType: MainWalletType =
        await Tezos.wallet.at<MainWalletType>(
          process.env.REACT_APP_CONTRACT_ADDRESS!
        );
      const storage: Storage = await mainWalletType.storage();
      setMainWalletType(mainWalletType);

      const nftWalletType: NftWalletType = await Tezos.wallet.at<NftWalletType>(
        storage.nftAddress
      );
      const storageNFT: StorageNFT = await nftWalletType.storage();
      setNftWalletType(nftWalletType);

      let c = await Tezos.contract.at(storage.nftAddress, tzip12);

      let tokenMetadata: TZIP21TokenMetadata = (await c
        .tzip12()
        .getTokenMetadata(0)) as TZIP21TokenMetadata;
      nftContratTokenMetadataMap.set(0, tokenMetadata);

      setNftContratTokenMetadataMap(new Map(nftContratTokenMetadataMap)); //new Map to force refresh
      console.log("User NFT refreshed");

      //it has to be last one
      setStorageNFT(storageNFT);
      setStorage(storage);
      console.log("Storage refreshed");
    } else {
      console.log("Not yet a wallet");
    }
    event?.detail.complete();
  };

  useEffect(() => {
    (async () => {
      await localStorage.create();
    })();
  }, []);

  const disconnectWallet = async (): Promise<void> => {
    setUserAddress("");
    setUserProfile(null);
    setUserBalance(0);
    console.log("disconnecting wallet");
    await wallet.clearActiveAccount();
    await localStorage.clear(); //remove SIWT tokens
    history.replace(PAGES.ORGANIZATIONS);
  };

  const getUserProfile = async (
    whateverUserAddress: string
  ): Promise<UserProfile | null> => {
    try {
      const accessToken = await localStorage.get("access_token");
      if (!accessToken) {
        console.error("you lost the SIWT accessToken, disconnecting...");
        disconnectWallet();
        return null;
      }

      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "/user/" + whateverUserAddress,
        {
          method: "GET",
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const json = await response.json();
      if (response.ok) {
        json.proofDate = new Date(json.proofDate); //convert dates
        return new Promise((resolve, reject) => resolve(json));
      } else if (response.status === 401 || response.status === 403) {
        console.warn("Silently refreshing token", response);
        try {
          await refreshToken(whateverUserAddress);
        } catch (error) {
          console.error("Cannot refresh token, disconnect");
          disconnectWallet();
          return null;
        }
        return await getUserProfile(whateverUserAddress);
      } else {
        console.warn("User Profile not found", response);
        return new Promise((resolve, reject) => resolve(null));
      }
    } catch (error) {
      console.error("error", error);
      return new Promise((resolve, reject) => resolve(null));
    }
  };

  return (
    <IonApp>
      <UserContext.Provider
        value={{
          userAddress,
          userBalance,
          userProfiles,
          setUserProfiles,
          userProfile,
          setUserProfile,
          Tezos,
          wallet,
          storage,
          storageNFT,
          mainWalletType,
          nftWalletType,
          setUserAddress,
          setUserBalance,
          setStorage,
          loading,
          setLoading,
          refreshStorage,
          getUserProfile,
          nftContratTokenMetadataMap,
          socket,
          localStorage,
          disconnectWallet,
        }}
      >
        <IonReactRouter>
          <IonRouterOutlet>
            <Route
              path={"/" + PAGES.ORGANIZATIONS}
              component={OrganizationsScreen}
            />
            <Route
              path={"/" + PAGES.ORGANIZATION}
              component={OrganizationScreen}
            />
            <Route path={"/" + PAGES.FUNDING} component={FundingScreen} />
            <Route path={"/" + PAGES.FAQ} component={FAQScreen} />
            <Redirect exact from="/" to={PAGES.ORGANIZATIONS} />
          </IonRouterOutlet>
        </IonReactRouter>
      </UserContext.Provider>
    </IonApp>
  );
};

export enum PAGES {
  ORGANIZATIONS = "organizations",
  ORGANIZATION = "organization",
  FUNDING = "funding",
  FAQ = "faq",
}

export default App;
