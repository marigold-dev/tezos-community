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
  home,
  logOut,
  personCircle,
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

      localStorage.set("access_token", accessToken);
      localStorage.set("refresh_token", refreshToken);
      localStorage.set("id_token", idToken);

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
            <IonButton color="transparent" routerLink={PAGES.ORGANIZATIONS}>
              <IonIcon slot="icon-only" icon={home}></IonIcon>
            </IonButton>

            <IonButton disabled color="transparent" routerLink={PAGES.FUNDING}>
              <IonIcon slot="start" icon={cash}></IonIcon>
              Funding
            </IonButton>

            <IonButton id="profile" color="transparent">
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
                          Soon, you will be required to verify your social
                          account in order to create/join an organization and
                          receive urgent/important messages
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
          <IonButton color="transparent" onClick={connectWallet}>
            <IonIcon slot="start" icon={walletIcon}></IonIcon>
            Connect your wallet
          </IonButton>
        )}
      </IonToolbar>
    </IonFooter>
  );
};
