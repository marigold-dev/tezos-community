import { NetworkType, SigningType } from "@airgap/beacon-types";

import { Clipboard } from "@capacitor/clipboard";
import {
  IonButton,
  IonCol,
  IonFooter,
  IonGrid,
  IonIcon,
  IonRow,
  IonToolbar,
} from "@ionic/react";
import { createMessagePayload, signIn } from "@siwt/sdk";
import {
  helpCircleOutline,
  home,
  personCircle,
  wallet as walletIcon,
} from "ionicons/icons";
import jwt_decode from "jwt-decode";
import React, { useRef } from "react";
import { LocalStorageKeys, PAGES, UserContext, UserContextType } from "./App";
import { address } from "./type-aliases";

export const Footer: React.FC = () => {
  const {
    Tezos,
    wallet,
    userAddress,
    userProfiles,
    setUserProfiles,
    userProfile,
    setUserProfile,
    storage,
    storageNFT,
    mainWalletType,
    nftWalletType,
    setStorage,
    setUserAddress,
    setUserBalance,
    setLoading,
    refreshStorage,
    getUserProfile,
    disconnectWallet,
    nftContratTokenMetadataMap,
    localStorage,
  } = React.useContext(UserContext) as UserContextType;

  const modalProfile = useRef<HTMLIonModalElement>(null);

  const connectWallet = async (): Promise<void> => {
    try {
      console.log("before requestPermissions");

      await wallet.requestPermissions({
        network: {
          type: process.env.REACT_APP_NETWORK
            ? NetworkType[
                process.env.REACT_APP_NETWORK.toUpperCase() as keyof typeof NetworkType
              ]
            : NetworkType.GHOSTNET,
          rpcUrl:
            "https://" + process.env.REACT_APP_NETWORK + ".tezos.marigold.dev",
        },
      });
      console.log("after requestPermissions");

      // gets user's address
      const userAddress = await wallet.getPKH();
      const balance = await Tezos.tz.getBalance(userAddress);
      setUserBalance(balance.toNumber());
      setUserAddress(userAddress);

      // create the message to be signed
      const messagePayload = createMessagePayload({
        dappUrl: "tezos-community.com",
        pkh: userAddress,
      });

      // request the signature
      const signedPayload = await wallet.client.requestSignPayload({
        ...messagePayload,
        signingType: SigningType.MICHELINE,
      });

      // sign in the user to our app
      const res = (await signIn(process.env.REACT_APP_BACKEND_URL! + "/siwt")({
        pk: (await wallet.client.getActiveAccount())?.publicKey!,
        pkh: userAddress,
        message: messagePayload.payload,
        signature: signedPayload.signature,
      })) as Promise<{
        data: {
          accessToken: string;
          idToken: string;
          refreshToken: string;
          tokenType: string;
        };
      }>;

      const { accessToken, idToken, refreshToken } = (await res).data;

      console.log("SIWT Connected to web2 backend", jwt_decode(idToken));

      await localStorage.set(LocalStorageKeys.access_token, accessToken);
      await localStorage.set(LocalStorageKeys.refresh_token, refreshToken);
      await localStorage.set(LocalStorageKeys.id_token, idToken);

      console.log("token stored");

      const up = await getUserProfile(userAddress);
      if (up) {
        setUserProfile(up);
        setUserProfiles(userProfiles.set(userAddress as address, up)); //add to cache
      }

      if (
        storageNFT &&
        storageNFT.owner_token_ids.findIndex(
          (obj) => obj[0] === (userAddress as address)
        ) < 0
      )
        modalProfile.current?.present();
    } catch (error) {
      console.error("error connectWallet", error);
    }
  };

  const writeToClipboard = async (content: string) => {
    console.log("writeToClipboard", content);

    await Clipboard.write({
      string: content,
    });

    const result = await Clipboard.read();
    console.log("reading clipboard", result);
  };

  return (
    <IonFooter>
      <IonToolbar>
        {userAddress ? (
          <>
            <IonButton color="dark" routerLink={PAGES.ORGANIZATIONS}>
              <IonIcon slot="icon-only" icon={home}></IonIcon>
            </IonButton>

            <IonButton color="dark" routerLink={PAGES.FAQ}>
              <IonIcon slot="start" icon={helpCircleOutline}></IonIcon>
              FAQ
            </IonButton>

            <IonButton color="dark" routerLink={PAGES.PROFILE}>
              <IonIcon slot="start" icon={personCircle}></IonIcon>
              Profile
            </IonButton>
          </>
        ) : (
          <IonGrid>
            <IonRow>
              <IonCol sizeSm="0" sizeXs="0" sizeMd="2" sizeXl="2" />
              <IonCol sizeSm="12" sizeXs="12" sizeMd="8" sizeXl="8">
                <IonButton color="dark" onClick={connectWallet}>
                  <IonIcon slot="start" icon={walletIcon}></IonIcon>
                  Connect your wallet
                </IonButton>
              </IonCol>
              <IonCol sizeSm="12" sizeXs="12" sizeMd="2" sizeXl="2">
                <a
                  style={{
                    fontSize: "0.8em",
                    margin: "1em",
                  }}
                  href={"https://www.marigold.dev/data-protection"}
                  target="_blank"
                >
                  Data Protection Policy & GDPR
                </a>
              </IonCol>
            </IonRow>
          </IonGrid>
        )}
      </IonToolbar>
    </IonFooter>
  );
};
