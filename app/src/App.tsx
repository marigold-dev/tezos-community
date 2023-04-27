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
import "./theme/variables.css";

import { NetworkType } from "@airgap/beacon-types";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { TezosToolkit } from "@taquito/taquito";
import { TokenMetadata, tzip12 } from "@taquito/tzip12";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { getUserProfile } from "./Utils";
import { MainWalletType, Storage } from "./main.types";
import { NftWalletType, Storage as StorageNFT } from "./nft.types";
import { FundingScreen } from "./pages/FundingScreen";
import { OrganizationScreen } from "./pages/OrganizationScreen";
import { OrganizationsScreen } from "./pages/OrganizationsScreen";
import { BigMap, address, unit } from "./type-aliases";

setupIonicReact();

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
  TWITTER = "TWITTER",
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
  proof: string;
  proofDate: Date;
  verified: boolean;
};

export type Organization = {
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

export type UserContextType = {
  storage: Storage | null;
  setStorage: Dispatch<SetStateAction<Storage | null>>;
  storageNFT: StorageNFT | null;
  userAddress: string;
  setUserAddress: Dispatch<SetStateAction<string>>;
  userProfiles: Map<address, UserProfile>;
  setUserProfiles: Dispatch<SetStateAction<Map<address, UserProfile>>>;
  userBalance: number;
  setUserBalance: Dispatch<SetStateAction<number>>;
  Tezos: TezosToolkit;
  wallet: BeaconWallet;
  mainWalletType: MainWalletType | null;
  nftWalletType: NftWalletType | null;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  refreshStorage: (event?: CustomEvent<RefresherEventDetail>) => Promise<void>;
  nftContratTokenMetadataMap: Map<number, TZIP21TokenMetadata>;
};
export let UserContext = React.createContext<UserContextType | null>(null);

const App: React.FC = () => {
  const [Tezos, setTezos] = useState<TezosToolkit>(
    new TezosToolkit("https://ghostnet.tezos.marigold.dev")
  );
  const [wallet, setWallet] = useState<BeaconWallet>(
    new BeaconWallet({
      name: "TzCommunity",
      preferredNetwork: NetworkType.GHOSTNET,
    })
  );
  const [userAddress, setUserAddress] = useState<string>("");
  const [userBalance, setUserBalance] = useState<number>(0);
  const [userProfiles, setUserProfiles] = useState<Map<address, UserProfile>>(
    new Map()
  );
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

  const [notificationId, setNotificationId] = useState<number>(0);
  const getNextNotificationId = () => {
    const newNextNotificationId = notificationId + 1;
    setNotificationId(newNextNotificationId);
    return newNextNotificationId;
  };

  useEffect(() => {
    Tezos.setWalletProvider(wallet);
    (async () => {
      console.log("After wallet change I refresh storage");
      await refreshStorage();
    })();
  }, [wallet]);

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
              if (!e.result.errors || e.result.errors.length === 0)
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
              else
                console.log(
                  "Warning : here we ignore a failing transaction event"
                );
            });

            organizationFrozenSubscription.on("data", async (e) => {
              console.log("on organizationFrozen event :", e);
              if (!e.result.errors || e.result.errors.length === 0)
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
              else
                console.log(
                  "Warning : here we ignore a failing transaction event"
                );
            });

            organizationAddedSubscription.on("data", async (e) => {
              console.log("on organizationAdded event :", e);
              if (!e.result.errors || e.result.errors.length === 0)
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
              else
                console.log(
                  "Warning : here we ignore a failing transaction event"
                );
            });
          }

          //only for organization administrators
          /*
          if( storage &&
            storage?.organizations.findIndex( i am on at least 1 org admin ) >=0 ){
            //TODO joinOrganizationRequest
            //filter messages only for my orgs
          }*/

          //for all users

          //TODO orgMemberRequestsUpdated
          // look at this org member to see if I am in and sent msg, if yes, refresh sotrage to list new org

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

        try {
          //always refresh userProfile
          const newUserProfile = await getUserProfile(userAddress);
          userProfiles.set(userAddress as address, newUserProfile);
          setUserProfiles(userProfiles);
          console.log("userProfile refreshed for " + userAddress);
        } catch (error) {
          console.log("No user profile found..");
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

  return (
    <IonApp>
      <UserContext.Provider
        value={{
          userAddress,
          userBalance,
          userProfiles,
          setUserProfiles,
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
          nftContratTokenMetadataMap,
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
}

export default App;
