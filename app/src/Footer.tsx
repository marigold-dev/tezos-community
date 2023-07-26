import {
  BeaconMessageType,
  NetworkType,
  SignPayloadResponse,
  SigningType,
} from "@airgap/beacon-types";

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
import TransportWebHID from "@ledgerhq/hw-transport-webhid";
import { createMessagePayload, signIn } from "@siwt/sdk";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { LedgerSigner } from "@taquito/ledger-signer";
import { helpCircleOutline, home, personCircle } from "ionicons/icons";
import jwt_decode from "jwt-decode";
import React from "react";
import { LocalStorageKeys, PAGES, UserContext, UserContextType } from "./App";
export const Footer: React.FC = () => {
  const {
    Tezos,
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
    setLoading,
    refreshStorage,
    getUserProfile,
    disconnectWallet,
    setTransportWebHID,
    nftContratTokenMetadataMap,
    localStorage,
    setTezos,
  } = React.useContext(UserContext) as UserContextType;

  const connectWallet = async (): Promise<void> => {
    try {
      console.log("connectWallet before requestPermissions");

      const wallet = new BeaconWallet({
        name: "TzCommunity",
        preferredNetwork: process.env.REACT_APP_NETWORK
          ? NetworkType[
              process.env.REACT_APP_NETWORK.toUpperCase() as keyof typeof NetworkType
            ]
          : NetworkType.GHOSTNET,
      });

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

      Tezos.setWalletProvider(wallet);
      setTezos(Tezos); //object changed and needs propagation

      // gets user's address
      const userAddress = await wallet.getPKH();

      setUserAddress(userAddress);

      await connectToWeb2Backend(await Tezos.signer.publicKey());
    } catch (error) {
      console.error("error connectWallet", error);
    }
  };

  const connectLedger = async (): Promise<void> => {
    console.log("connectLedger before requestPermissions");

    try {
      //Ledger init
      const transportWebHID = await TransportWebHID.create();
      setTransportWebHID(transportWebHID);
      const ledgerSigner = new LedgerSigner(transportWebHID);

      Tezos.setSignerProvider(ledgerSigner);
      setTezos(Tezos); //object changed and needs propagation

      const userAddress = await Tezos.signer.publicKeyHash();
      setUserAddress(userAddress);

      await connectToWeb2Backend(await Tezos.signer.publicKey());
    } catch (error) {
      console.error("error connectLedger", error);
      disconnectWallet();
      alert("unlock your Ledger and try again");
    }
  };

  const connectToWeb2Backend = async (publicKey: string) => {
    // create the message to be signed
    const messagePayload = createMessagePayload({
      dappUrl: "tezos-community.com",
      pkh: userAddress,
    });

    // request the signature
    let signedPayload: SignPayloadResponse | undefined = undefined;
    if (Tezos.wallet instanceof BeaconWallet) {
      signedPayload = await Tezos.wallet.client.requestSignPayload({
        ...messagePayload,
        signingType: SigningType.MICHELINE,
      });
    } else if (Tezos.signer instanceof LedgerSigner) {
      let signed: {
        bytes: string;
        sig: string;
        prefixSig: string;
        sbytes: string;
      } = await Tezos.signer.sign(messagePayload.payload);
      signedPayload = {
        signingType: SigningType.MICHELINE,
        signature: signed.sig,
        type: BeaconMessageType.SignPayloadResponse, //dummy
        version: "string", //dummy
        id: "string", //dummy
        senderId: "string", //dummy
      };

      console.log("signed", signed);
    }

    // sign in the user to our app
    const res = (await signIn(process.env.REACT_APP_BACKEND_URL! + "/siwt")({
      pk: publicKey,
      pkh: userAddress,
      message: messagePayload.payload,
      signature: signedPayload!.signature,
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

    //refresh the global storage, as we have an access token now, we can fetch other user profiles
    await refreshStorage();
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
                  <IonIcon slot="start" src={"/assets/beacon.svg"}></IonIcon>
                  Connect your wallet
                </IonButton>
                <IonButton color="dark" onClick={connectLedger}>
                  <IonIcon slot="start" src={"/assets/ledger.svg"}></IonIcon>
                  Connect your ledger
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
