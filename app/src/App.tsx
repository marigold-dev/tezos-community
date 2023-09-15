import {
  IonApp,
  IonRouterOutlet,
  RefresherEventDetail,
  setupIonicReact,
} from "@ionic/react";

import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router-dom";
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
import { Storage as LocalStorage } from "@ionic/storage";
import Transport from "@ledgerhq/hw-transport";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { LedgerSigner } from "@taquito/ledger-signer";
import { TezosToolkit } from "@taquito/taquito";
import { TokenMetadata, tzip12 } from "@taquito/tzip12";
import * as api from "@tzkt/sdk-api";
import { BigMapKey } from "@tzkt/sdk-api";
import { BigNumber } from "bignumber.js";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { CachingService } from "./caching.service";
import { MainWalletType, Storage } from "./main.types";
import { NftWalletType, Storage as StorageNFT } from "./nft.types";
import { FAQScreen } from "./pages/FAQScreen";
import { OrganizationScreen } from "./pages/OrganizationScreen";
import { OrganizationsScreen } from "./pages/OrganizationsScreen";
import { ProfileScreen } from "./pages/ProfileScreen";
import { socket } from "./socket";
import { BigMap, address, nat, unit } from "./type-aliases";

//FIXME waiting fix for https://github.com/airgap-it/beacon-sdk/issues/576
export declare type MichelineMichelsonV1Expression =
  | {
      int: string;
    }
  | {
      string: string;
    }
  | {
      bytes: string;
    }
  | MichelineMichelsonV1Expression[]
  | {
      prim: MichelsonPrimitives;
      args?: MichelineMichelsonV1Expression[];
      annots?: string[];
    };

setupIonicReact();

const localStorage = new CachingService(new LocalStorage());

export enum LocalStorageKeys {
  access_token = "access_token",
  refresh_token = "refresh_token",
  id_token = "id_token",
  bigMapsGetKeys = "bigMapsGetKeys",
}

export type TZIP21TokenMetadata = TokenMetadata & {
  artifactUri?: string; //A URI (as defined in the JSON Schema Specification) to the asset.
  displayUri?: string; //A URI (as defined in the JSON Schema Specification) to an image of the asset.
  thumbnailUri?: string; //A URI (as defined in the JSON Schema Specification) to an image of the asset for wallets and client applications to have a scaled down image to present to end-users.
  description?: string; //General notes, abstracts, or summaries about the contents of an asset.
  minter?: string; //The tz address responsible for minting the asset.
  creators?: string[]; //The primary person, people, or organization(s) responsible for creating the intellectual content of the asset.
  isBooleanAmount?: boolean; //Describes whether an account can have an amount of exactly 0 or 1. (The purpose of this field is for wallets to determine whether or not to display balance information and an amount field when transferring.)
};

export enum PROVIDER {
  BEACON,
  LEDGER,
  UNKNOWN,
}

export enum SOCIAL_ACCOUNT_TYPE {
  google = "google",
  twitter = "twitter",
  // facebook = "facebook",
  github = "github",
  gitlab = "gitlab",
  // microsoft = "microsoft",
  slack = "slack",
  //reddit = "reddit",
  //telegram = "telegram",
}

export type UserProfile = {
  displayName: string;
  socialAccountType: SOCIAL_ACCOUNT_TYPE;
  socialAccountAlias: string;
  photo: string;
};

export type MemberRequest = {
  joinRequest: {
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
  autoRegistration: boolean;
  business: string;
  fundingAddress: { Some: address } | null;
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

export type UserContextType = {
  storage: Storage | null;
  setStorage: Dispatch<SetStateAction<Storage | null>>;
  storageNFT: StorageNFT | null;
  userAddress: string;
  setUserAddress: Dispatch<SetStateAction<string>>;

  userProfiles: Map<address, UserProfile>; //cache to avoid to run more queries on userProfiles
  setUserProfiles: Dispatch<SetStateAction<Map<address, UserProfile>>>;
  transportWebHID: Transport | undefined;
  setTransportWebHID: Dispatch<SetStateAction<Transport | undefined>>;
  userProfile: UserProfile | null;
  setUserProfile: Dispatch<SetStateAction<UserProfile | null>>;
  Tezos: TezosToolkit & { beaconWallet?: BeaconWallet };
  setTezos: Dispatch<SetStateAction<TezosToolkit>>;
  mainWalletType: MainWalletType | null;
  nftWalletType: NftWalletType | null;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  disconnectWallet: () => Promise<void>;
  getUserProfile: (whateverUserAddress: string) => Promise<UserProfile | null>;
  refreshStorage: (event?: CustomEvent<RefresherEventDetail>) => Promise<void>;
  nftContratTokenMetadataMap: Map<number, TZIP21TokenMetadata>;
  localStorage: CachingService;
  socket: Socket;
};
export let UserContext = React.createContext<UserContextType | null>(null);

const App: React.FC = () => {
  api.defaults.baseUrl =
    "https://api." + import.meta.env.VITE_NETWORK + ".tzkt.io";

  const [Tezos, setTezos] = useState<
    TezosToolkit & { beaconWallet?: BeaconWallet }
  >(
    new TezosToolkit(
      "https://" + import.meta.env.VITE_NETWORK + ".tezos.marigold.dev"
    )
  );

  const [transportWebHID, setTransportWebHID] = useState<
    Transport | undefined
  >();

  const [userAddress, setUserAddress] = useState<string>("");
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
    address: import.meta.env.VITE_CONTRACT_ADDRESS!,
  });
  const organizationFrozenSubscription = Tezos.stream.subscribeEvent({
    tag: "organizationFrozen",
    address: import.meta.env.VITE_CONTRACT_ADDRESS!,
  });
  const organizationAddedSubscription = Tezos.stream.subscribeEvent({
    tag: "organizationAdded",
    address: import.meta.env.VITE_CONTRACT_ADDRESS!,
  });
  const joinOrganizationRequestSubscription = Tezos.stream.subscribeEvent({
    tag: "joinOrganizationRequest",
    address: import.meta.env.VITE_CONTRACT_ADDRESS!,
  });
  const orgMemberRequestsUpdatedSubscription = Tezos.stream.subscribeEvent({
    tag: "orgMemberRequestsUpdated",
    address: import.meta.env.VITE_CONTRACT_ADDRESS!,
  });
  const orgMessagesSubscription = Tezos.stream.subscribeEvent({
    tag: "message",
    address: import.meta.env.VITE_CONTRACT_ADDRESS!,
  });
  const repliesSubscription = Tezos.stream.subscribeEvent({
    tag: "reply",
    address: import.meta.env.VITE_CONTRACT_ADDRESS!,
  });

  const [notificationId, setNotificationId] = useState<number>(0);
  const getNextNotificationId = () => {
    const newNextNotificationId = notificationId + 1;
    setNotificationId(newNextNotificationId);
    return newNextNotificationId;
  };

  useEffect(() => {
    console.warn(
      "**************************userAddress changed***************",
      userAddress
    );

    if (userAddress) {
      (async () => {
        await refreshStorage();
      })();
    } else {
      (async () => {
        //console.log("Tezos", Tezos, "Tezos.beaconWallet", Tezos.beaconWallet);
        if (!Tezos.beaconWallet) {
          console.log(
            "We lost userAddress cause of page refresh, reload it from web Beacon local cache"
          );

          //we need to recreate the wallet completely because of page reload
          let wallet = new BeaconWallet({
            name: "TzCommunity",
            preferredNetwork: import.meta.env.VITE_NETWORK
              ? NetworkType[
                  import.meta.env.VITE_NETWORK.toUpperCase() as keyof typeof NetworkType
                ]
              : NetworkType.GHOSTNET,
          });
          Tezos.setWalletProvider(wallet);
          Tezos.beaconWallet = wallet;
          setTezos(Tezos); //object changed and needs propagation

          const activeAccount =
            await Tezos.beaconWallet.client.getActiveAccount();
          var userAddress: string;
          if (activeAccount) {
            userAddress = activeAccount.address;
            setUserAddress(userAddress);
          } else {
            console.warn("There is no more active user");
          }
        } else {
          console.warn("Cannot restore user from page refresh");
          disconnectWallet();
        }
      })();
    }
  }, [userAddress]);

  //subscriptions
  useEffect(() => {
    console.warn(
      "**************************storage changed***************",
      storage
    );

    if (storage) {
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
              storage?.tezosOrganization.admins.indexOf(
                userAddress as address
              ) >= 0
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
                } else
                  console.log(
                    "Warning : here we ignore a failing transaction event"
                  );
              });
            }

            //only for organization administrators
            const myOrganizationsAsAdmin = storage?.organizations.filter(
              (orgItem: Organization) =>
                orgItem.admins.indexOf(userAddress as address) >= 0
                  ? true
                  : false
            );

            // if super admin ?
            if (
              storage?.tezosOrganization.admins.indexOf(
                userAddress as address
              ) >= 0
            )
              myOrganizationsAsAdmin.push(storage?.tezosOrganization);
            //console.log("myOrganizationsAsAdmin", myOrganizationsAsAdmin);

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
              }
            });

            console.log("Configuring SUBSCRIPTIONS (user+storage)");

            // pre fetch some info
            let myOrganizationsAsMember: Organization[] = [];

            await Promise.all(
              storage!.organizations.map(async (orgItem: Organization) => {
                const membersBigMapId = (
                  orgItem.members as unknown as { id: BigNumber }
                ).id.toNumber();
                const url = LocalStorageKeys.bigMapsGetKeys + membersBigMapId;
                let keys: BigMapKey[] = await localStorage.getWithTTL(url);

                if (!keys) {
                  //console.warn("cache is empty for key : ", url);
                  try {
                    keys = await api.bigMapsGetKeys(membersBigMapId, {
                      micheline: "Json",
                      active: true,
                    });
                    await localStorage.setWithTTL(url, keys);
                  } catch (error) {
                    console.error("TZKT call failed", error);
                  }
                }

                if (keys) {
                  //check if member is part of it OR super admin
                  if (
                    keys.findIndex((key) => key.key === userAddress) >= 0 ||
                    storage.tezosOrganization.admins.indexOf(
                      userAddress as address
                    ) >= 0
                  ) {
                    myOrganizationsAsMember.push(orgItem);

                    //cache userprofiles
                    for (const key of keys) {
                      if (
                        await localStorage.get(LocalStorageKeys.access_token)
                      ) {
                        const up = await getUserProfile(key.key);
                        if (up) {
                          userProfiles.set(key.key, up);

                          // console.log("APP CALLING setUserProfiles", userProfiles);
                          setUserProfiles(userProfiles);
                        }
                      }
                    }
                  }
                }
              })
            );

            // *FOR Member of org  messages push notif

            orgMessagesSubscription.on("data", async (e) => {
              // console.log("on orgMessagesSubscription event :", e);

              const orgname: string = (
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
                  string: string;
                }
              ).string;

              const message: string = (
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

              if (
                myOrganizationsAsMember.findIndex(
                  (orgItem) => orgItem.name === orgname
                ) >= 0
              ) {
                await LocalNotifications.schedule({
                  notifications: [
                    {
                      title:
                        "TzCommunity - Message posted on " + orgname + " team",
                      body: message,
                      id: getNextNotificationId(),
                      autoCancel: true,
                    },
                  ],
                });
              }
            });

            // *FOR Reply messge to my inbox

            repliesSubscription.on("data", async (e) => {
              console.log("on repliesSubscription event :", e);
              //Tezos.get_source(), replyUser,replyId, message

              const replyUser: string = (
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
                  string: string;
                }
              ).string;

              const replyId: string = (
                (
                  (
                    e.payload! as {
                      prim: MichelsonPrimitives;
                      args?: MichelineMichelsonV1Expression[] | undefined;
                      annots?: string[] | undefined;
                    }
                  ).args![1] as {
                    prim: MichelsonPrimitives;
                    args?: MichelineMichelsonV1Expression[] | undefined;
                    annots?: string[] | undefined;
                  }
                ).args![0] as {
                  int: string;
                }
              ).int;

              const message: string = (
                (
                  (
                    e.payload! as {
                      prim: MichelsonPrimitives;
                      args?: MichelineMichelsonV1Expression[] | undefined;
                      annots?: string[] | undefined;
                    }
                  ).args![1] as {
                    prim: MichelsonPrimitives;
                    args?: MichelineMichelsonV1Expression[] | undefined;
                    annots?: string[] | undefined;
                  }
                ).args![1] as {
                  string: string;
                }
              ).string;

              if (replyUser === userAddress) {
                await LocalNotifications.schedule({
                  notifications: [
                    {
                      title: "TzCommunity - Reply on your message n°" + replyId,
                      body: message,
                      id: getNextNotificationId(),
                      autoCancel: true,
                    },
                  ],
                });
              } else {
                //alert("Reply not for me" + replyUser + " - " + userAddress);
              }
            });

            setSubscriptionsDone(true);
            console.log("Event subscription done");
          } else {
          }
        } catch (error) {
          console.log(
            "********************Error*************************",
            error
          );
        }
      })();
    } else {
    }
  }, [storage]);

  const refreshStorage = async (
    event?: CustomEvent<RefresherEventDetail>
  ): Promise<void> => {
    console.log("************  Calling refreshStorage");

    if (userAddress) {
      //only refresh userProfile if there is SIWT
      if (await localStorage.get(LocalStorageKeys.access_token)) {
        const newUserProfile = await getUserProfile(userAddress);
        if (newUserProfile) {
          userProfiles.set(userAddress as address, newUserProfile);

          //   console.log("APP CALLING setUserProfiles", userProfiles);
          setUserProfiles(userProfiles); //cache

          setUserProfile(newUserProfile); //cache
          /* console.log(
              "userProfile refreshed for " + userAddress,
              newUserProfile
            );*/
        }
      } else {
        console.error(
          "************  cannot find access_token ...",
          localStorage
        );
      }

      console.log(
        "VITE_CONTRACT_ADDRESS:",
        import.meta.env.VITE_CONTRACT_ADDRESS!
      );
      console.log("VITE_BACKEND_URL:", import.meta.env.VITE_BACKEND_URL!);

      const mainWalletType: MainWalletType =
        await Tezos.wallet.at<MainWalletType>(
          import.meta.env.VITE_CONTRACT_ADDRESS!
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
      console.log("No useraddress no need to refresh storage yet");
    }

    event?.detail.complete();
  };

  function onConnect() {
    console.log("Socket connected");
  }

  function onDisconnect(reason: any) {
    console.log(`Socket disconnected due to ${reason}`);
  }

  function onError(err: any) {
    console.log("received socket error:");
    console.log(err);
  }

  useEffect(() => {
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("error", onError);

    (async () => {
      await localStorage.initStorage();
    })();

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("error", onError);
    };
  }, []);

  const disconnectWallet = async (): Promise<void> => {
    setUserAddress("");
    setUserProfile(null);

    console.log("Tezos.wallet", Tezos.wallet);

    if (Tezos.signer instanceof LedgerSigner) {
      await transportWebHID!.close();
      console.log("disconnecting ledger");
    } else if (Tezos.beaconWallet) {
      try {
        console.log("disconnecting wallet");

        await Tezos.beaconWallet.clearActiveAccount();
      } catch (error) {
        console.log("wallet dead anyway ...");
      }
    }

    if (localStorage.initialized) {
      console.log("localStorage is initialized, removing access tokens");
      await localStorage.remove(LocalStorageKeys.access_token); //remove SIWT tokens
      await localStorage.remove(LocalStorageKeys.id_token); //remove SIWT tokens
      await localStorage.remove(LocalStorageKeys.refresh_token); //remove SIWT tokens
    } else {
      console.warn("localStorage not initialized, cannot remove access tokens");
    }
  };

  const getUserProfile = async (
    whateverUserAddress: string
  ): Promise<UserProfile | null> => {
    try {
      const accessToken = await localStorage.get(LocalStorageKeys.access_token);

      if (!accessToken) {
        console.error("you lost the SIWT accessToken, disconnecting...");
        disconnectWallet();
        return null;
      }
      const url =
        import.meta.env.VITE_BACKEND_URL + "/user/" + whateverUserAddress;
      const up = await localStorage.getWithTTL(url);

      if (up && Object.keys(up).length > 0) {
        //not empty
        return new Promise((resolve, _) => resolve(up));
      } else if (up && Object.keys(up).length === 0) {
        //empty
        return new Promise((resolve, _) => resolve(null));
      } else {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            authorization: `Bearer ${accessToken}`,
          },
        });

        const json = await response.json();

        if (response.ok) {
          await localStorage.setWithTTL(url, json);
          return new Promise((resolve, _) => resolve(json));
        } else if (response.status === 401 || response.status === 403) {
          console.warn("Silently refreshing token", response);
          try {
            await refreshToken(userAddress);
            return await getUserProfile(whateverUserAddress);
          } catch (error) {
            console.error("Cannot refresh token, disconnect");
            disconnectWallet();
            return null;
          }
        } else {
          //console.warn("User Profile not found", response);
          await localStorage.setWithTTL(url, {});
          return new Promise((resolve, _) => resolve(null));
        }
      }
    } catch (error) {
      console.error("error", error);
      return new Promise((resolve, _) => resolve(null));
    }
  };

  const refreshToken = async (userAddress: string) => {
    try {
      const response = await fetch(
        import.meta.env.VITE_BACKEND_URL + "/siwt/refreshToken",
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

        await localStorage.set(LocalStorageKeys.access_token, accessToken);
        await localStorage.set(LocalStorageKeys.refresh_token, refreshToken);
        await localStorage.set(LocalStorageKeys.id_token, idToken);

        console.log(
          "tokens stored",
          await localStorage.get(LocalStorageKeys.id_token)
        );
      } else {
        console.error("error trying to refresh token", response);
        return new Promise((resolve, _) => resolve(null));
      }
    } catch (error) {
      console.error("error", error); //cannot do more because session is dead
      disconnectWallet();
    }
  };

  return (
    <IonApp>
      <UserContext.Provider
        value={{
          transportWebHID,
          setTransportWebHID,
          userAddress,
          userProfiles,
          setUserProfiles,
          userProfile,
          setUserProfile,
          Tezos,
          storage,
          storageNFT,
          mainWalletType,
          nftWalletType,
          setUserAddress,
          setStorage,
          loading,
          setLoading,
          refreshStorage,
          getUserProfile,
          nftContratTokenMetadataMap,
          localStorage,
          disconnectWallet,
          socket,
          setTezos,
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
            <Route path={"/" + PAGES.FAQ} component={FAQScreen} />
            <Route path={"/" + PAGES.PROFILE} component={ProfileScreen} />
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
  FAQ = "faq",
  PROFILE = "profile",
}

export default App;
