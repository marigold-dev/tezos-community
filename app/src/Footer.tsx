import { NetworkType, SigningType } from "@airgap/beacon-types";

import { Clipboard } from "@capacitor/clipboard";
import {
  IonButton,
  IonButtons,
  IonChip,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonModal,
  IonPopover,
  IonText,
  IonTitle,
  IonToolbar,
  useIonAlert,
} from "@ionic/react";
import { createMessagePayload, signIn } from "@siwt/sdk";
import {
  arrowBackOutline,
  cardOutline,
  cash,
  helpCircleOutline,
  home,
  logOut,
  personCircle,
  unlinkOutline,
  wallet as walletIcon,
} from "ionicons/icons";
import jwt_decode from "jwt-decode";
import React, { useRef } from "react";
import { useHistory } from "react-router-dom";
import { PAGES, UserContext, UserContextType } from "./App";
import { OAuth } from "./OAuth";
import { TransactionInvalidBeaconError } from "./TransactionInvalidBeaconError";
import { UserProfileChip } from "./components/UserProfileChip";
import { address } from "./type-aliases";
const providers = ["twitter"];

export const Footer: React.FC = () => {
  const history = useHistory();
  const [presentAlert] = useIonAlert();

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
        dappUrl: "tzCommunity.marigold.dev",
        pkh: userAddress,
      });

      // request the signature
      const signedPayload = await wallet.client.requestSignPayload({
        ...messagePayload,
        signingType: SigningType.MICHELINE,
      });

      // sign in the user to our app
      const { data } = await signIn(
        process.env.REACT_APP_BACKEND_URL! + "/siwt"
      )({
        pk: (await wallet.client.getActiveAccount())?.publicKey!,
        pkh: userAddress,
        message: messagePayload.payload,
        signature: signedPayload.signature,
      });

      const { accessToken, idToken, refreshToken } = data;

      console.log("SIWT Connected to web2 backend", jwt_decode(idToken));

      await localStorage.set("access_token", accessToken);
      await localStorage.set("refresh_token", refreshToken);
      await localStorage.set("id_token", idToken);

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

  const claimNFT = async () => {
    console.log("claimNFT");

    try {
      setLoading(true);
      const op = await nftWalletType!.methods.createNFTCardForMember().send();
      await op?.confirmation();
      await refreshStorage();
      history.replace(PAGES.ORGANIZATIONS);
    } catch (error) {
      console.table(`Error: ${JSON.stringify(error, null, 2)}`);
      let tibe: TransactionInvalidBeaconError =
        new TransactionInvalidBeaconError(error);
      presentAlert({
        header: "Error",
        message: tibe.data_message,
        buttons: ["Close"],
      });
      setLoading(false);
    }
    setLoading(false);
  };

  const unlinkSocialAccount = async () => {
    const accessToken = await localStorage.get("access_token");
    if (!accessToken) throw Error("You lost your SIWT accessToken");

    const response = await fetch(
      process.env.REACT_APP_BACKEND_URL + "/user" + "/unlink",
      {
        method: "POST",
        headers: {
          authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.ok) {
      console.log("UserProfile unlinked on backend");
      setUserProfile(null);
      userProfiles.delete(userAddress as address);
      setUserProfiles(userProfiles); //update cache
    } else {
      console.log("ERROR : " + response.status);
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

            <IonButton disabled color="dark" routerLink={PAGES.FUNDING}>
              <IonIcon slot="start" icon={cash}></IonIcon>
              Funding
            </IonButton>

            <IonButton color="dark" routerLink={PAGES.FAQ}>
              <IonIcon slot="start" icon={helpCircleOutline}></IonIcon>
              FAQ
            </IonButton>

            <IonButton id="profile" color="dark">
              <IonIcon slot="start" icon={personCircle}></IonIcon>
              Profile
            </IonButton>

            <IonModal trigger="profile" ref={modalProfile}>
              <IonHeader>
                <IonToolbar>
                  <IonButtons slot="start">
                    <IonButton onClick={() => modalProfile.current?.dismiss()}>
                      <IonIcon slot="start" icon={arrowBackOutline}></IonIcon>
                      BACK
                    </IonButton>
                  </IonButtons>
                  <IonButtons slot="end">
                    <IonButton onClick={disconnectWallet}>
                      <IonIcon slot="start" icon={logOut}></IonIcon>
                      Logout
                    </IonButton>
                  </IonButtons>
                  <IonTitle>
                    Profile
                    <IonChip
                      id="verified"
                      color={userProfile ? "success" : "warning"}
                    >
                      {userProfile ? "Verified" : "Unverified"}
                    </IonChip>
                    {userProfile ? (
                      ""
                    ) : (
                      <IonPopover trigger="verified" triggerAction="hover">
                        <IonContent class="ion-padding">
                          Optionally, you can link with your preferred social
                          account to be able to receive urgent/important
                          messages and also display a human-readable alias
                          instead of tz1xxx
                        </IonContent>
                      </IonPopover>
                    )}
                  </IonTitle>
                </IonToolbar>
              </IonHeader>
              <IonContent color="light" class="ion-padding">
                {userProfile ? (
                  <IonItem>
                    <UserProfileChip
                      address={userAddress as address}
                      userProfiles={userProfiles}
                    />
                    <IonButton
                      color="danger"
                      slot="end"
                      onClick={(e) => unlinkSocialAccount()}
                    >
                      <IonIcon icon={unlinkOutline} />
                      Unlink social account
                    </IonButton>
                  </IonItem>
                ) : (
                  <>
                    <IonItem>
                      <IonLabel>Address : </IonLabel>
                      <IonText>{userAddress}</IonText>
                    </IonItem>
                    <IonItem>
                      <IonLabel color="warning">
                        Link your address to a social network
                      </IonLabel>
                      {providers.map((provider) => (
                        <OAuth key={provider} provider={provider} />
                      ))}
                    </IonItem>
                  </>
                )}

                {storageNFT &&
                storageNFT.owner_token_ids.findIndex(
                  (obj) => obj[0] === (userAddress as address)
                ) >= 0 ? (
                  <IonItem>
                    <IonImg
                      src={nftContratTokenMetadataMap
                        .get(0)!
                        .thumbnailUri?.replace(
                          "ipfs://",
                          "https://gateway.pinata.cloud/ipfs/"
                        )}
                    />
                  </IonItem>
                ) : (
                  <IonButton size="large" onClick={claimNFT} color="warning">
                    <IonIcon slot="start" icon={cardOutline}></IonIcon>
                    Claim your Tezos membership NFT card
                  </IonButton>
                )}
              </IonContent>
            </IonModal>
          </>
        ) : (
          <IonButton color="dark" onClick={connectWallet}>
            <IonIcon slot="start" icon={walletIcon}></IonIcon>
            Connect your wallet
          </IonButton>
        )}
      </IonToolbar>
    </IonFooter>
  );
};
