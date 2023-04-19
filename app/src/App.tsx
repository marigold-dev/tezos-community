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
import "./theme/variables.css";

import { NetworkType } from "@airgap/beacon-types";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { TezosToolkit } from "@taquito/taquito";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { MainWalletType, Storage } from "./main.types";
import { FundingScreen } from "./pages/FundingScreen";
import { OrganizationScreen } from "./pages/OrganizationScreen";
import { OrganizationsScreen } from "./pages/OrganizationsScreen";
import { BigMap, address, unit } from "./type-aliases";

setupIonicReact();

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
  status: { aCTIVE: unit } | { fROZEN: unit } | { pENDING_APPROVAL: unit };
};

export type UserContextType = {
  storage: Storage | null;
  setStorage: Dispatch<SetStateAction<Storage | null>>;
  userAddress: string;
  setUserAddress: Dispatch<SetStateAction<string>>;
  userProfile: UserProfile;
  setUserProfile: Dispatch<SetStateAction<UserProfile>>;
  userBalance: number;
  setUserBalance: Dispatch<SetStateAction<number>>;
  Tezos: TezosToolkit;
  wallet: BeaconWallet;
  mainWalletType: MainWalletType | null;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  refreshStorage: (event?: CustomEvent<RefresherEventDetail>) => Promise<void>;
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
  const [userProfile, setUserProfile] = useState<UserProfile>({
    displayName: "",
    proof: "",
    proofDate: new Date(),
    socialAccountAlias: "",
    socialAccountType: SOCIAL_ACCOUNT_TYPE.TWITTER,
    verified: false,
  });
  const [storage, setStorage] = useState<Storage | null>(null);
  const [mainWalletType, setMainWalletType] = useState<MainWalletType | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    Tezos.setWalletProvider(wallet);
    (async () => await refreshStorage())();
  }, [wallet]);

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
          const newUserProfile = await getUserProfile(userAddress);
          newUserProfile.proofDate = new Date(newUserProfile.proofDate); //convert dates
          setUserProfile(newUserProfile);
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
      setStorage(storage);
      console.log("Storage refreshed");
    } else {
      console.log("Not yet a wallet");
    }
    event?.detail.complete();
  };

  const getUserProfile = async (userAddress: string): Promise<UserProfile> => {
    const response = await fetch(
      process.env.REACT_APP_BACKEND_URL + "/user/" + userAddress
    );
    const json = await response.json();
    if (response.ok) {
      console.log("data is : ", json);
      return new Promise((resolve, reject) => resolve(json));
    } else {
      return new Promise((resolve, reject) =>
        reject("ERROR : " + response.status)
      );
    }
  };

  return (
    <IonApp>
      <UserContext.Provider
        value={{
          userAddress,
          userBalance,
          userProfile,
          setUserProfile,
          Tezos,
          wallet,
          storage,
          mainWalletType,
          setUserAddress,
          setUserBalance,
          setStorage,
          loading,
          setLoading,
          refreshStorage,
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
