import { NetworkType } from "@airgap/beacon-types";
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
import React, { useRef, useState } from "react";
import {
  PAGES,
  SOCIAL_ACCOUNT_TYPE,
  UserContext,
  UserContextType,
  UserProfile,
} from "./App";

import { Browser } from "@capacitor/browser";
import {
  arrowBackOutline,
  cardOutline,
  cash,
  home,
  logOut,
  personCircle,
  wallet as walletIcon,
} from "ionicons/icons";
import { useHistory } from "react-router-dom";
import { auth } from "twitter-api-sdk";
import { TransactionInvalidBeaconError } from "./TransactionInvalidBeaconError";
import { address } from "./type-aliases";
export const Footer: React.FC = () => {
  const history = useHistory();
  const [presentAlert] = useIonAlert();

  const {
    Tezos,
    wallet,
    userAddress,
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
    nftContratTokenMetadataMap,
  } = React.useContext(UserContext) as UserContextType;

  const modalProfile = useRef<HTMLIonModalElement>(null);

  const [proofUrl, setProofUrl] = useState<string>("");

  const connectWallet = async (): Promise<void> => {
    try {
      console.log("before requestPermissions");

      await wallet.requestPermissions({
        network: {
          type: NetworkType.GHOSTNET,
          rpcUrl: "https://ghostnet.tezos.marigold.dev",
        },
      });
      console.log("after requestPermissions");

      // gets user's address
      const userAddress = await wallet.getPKH();
      const balance = await Tezos.tz.getBalance(userAddress);
      setUserBalance(balance.toNumber());
      setUserAddress(userAddress);
      await refreshStorage();

      if (
        storageNFT &&
        storageNFT.owner_token_ids.findIndex(
          (obj) => obj[0] === (userAddress as address)
        ) < 0
      )
        modalProfile.current?.present();
    } catch (error) {
      console.log("error connectWallet", error);
    }
  };

  const disconnectWallet = async (): Promise<void> => {
    setUserAddress("");
    setUserBalance(0);
    setUserProfile({
      displayName: "",
      proof: "",
      proofDate: new Date(),
      socialAccountAlias: "",
      socialAccountType: SOCIAL_ACCOUNT_TYPE.TWITTER,
      verified: false,
    });
    console.log("disconnecting wallet");
    await wallet.clearActiveAccount();

    history.replace(PAGES.ORGANIZATIONS);
  };

  const login = async () => {
    const authClient = new auth.OAuth2User({
      client_id: process.env["REACT_APP_TWITTER_API_KEY"]!,
      client_secret: process.env["REACT_APP_TWITTER_API_SECRET"]!,
      callback: "http://localhost:3000",
      scopes: ["tweet.read", "users.read", "offline.access"],
    });

    console.log("twitterClient initialized");
    const authUrl = authClient.generateAuthURL({
      state: userAddress,
      code_challenge_method: "s256",
    });
    const POPUP_HEIGHT = 700;
    const POPUP_WIDTH = 600;
    await Browser.open({
      url: authUrl,
      height: POPUP_HEIGHT,
      width: POPUP_WIDTH,
      windowName: "Login",
    });
    /*
    const response = await fetch(
      process.env.REACT_APP_BACKEND_URL +
        "/user/" +
        userAddress +
        "/generateProof",
      {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          displayName,
          socialAccountAlias: contactId,
          socialAccountType: contactIdProvider,
        }),
      }
    );
    const json: UserProfile = await response.json();
    if (response.ok) {
      console.log("User proof", json);
      json.proofDate = new Date(json.proofDate);
      setUserProfile(json);
    } else {
      console.log("ERROR : " + response.status);
    }*/
  };

  const verifyProof = async () => {
    const response = await fetch(
      process.env.REACT_APP_BACKEND_URL +
        "/user/" +
        userAddress +
        "/verifyProof",
      {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ proofUrl }),
      }
    );
    const json: UserProfile = await response.json();
    if (response.ok) {
      console.log("User is verified", json);
      json.proofDate = new Date(json.proofDate);
      setUserProfile(json);
    } else {
      console.log("ERROR : " + response.status);
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

            <IonButton color="transparent" routerLink={PAGES.FUNDING}>
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
                      color={
                        userProfile && userProfile.verified
                          ? "success"
                          : "warning"
                      }
                    >
                      {userProfile && userProfile.verified
                        ? "Verified"
                        : "Unverified"}
                    </IonChip>
                    {userProfile && userProfile.verified ? (
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
                {userProfile.verified ? (
                  <>
                    <IonItem>
                      <IonLabel>Display name : </IonLabel>
                      {userProfile.displayName}
                    </IonItem>
                    <IonItem>
                      <IonLabel>Social account type : </IonLabel>
                      {userProfile.socialAccountType}
                    </IonItem>
                    <IonItem>
                      <IonLabel>Social account alias : </IonLabel>
                      {userProfile.socialAccountAlias}
                    </IonItem>
                    <IonItem>
                      <IonLabel>Proof : </IonLabel>
                      {userProfile.proof}
                    </IonItem>
                    <IonItem>
                      <IonLabel>Proof date : </IonLabel>
                      {userProfile.proofDate
                        ? userProfile.proofDate?.toLocaleString()
                        : ""}
                    </IonItem>
                    <IonItem>
                      <IonLabel>Verified : </IonLabel>
                      {userProfile.verified ? "true" : "false"}
                    </IonItem>
                  </>
                ) : (
                  <>
                    <IonItem>
                      <IonLabel>Address : </IonLabel>
                      <IonText>{userAddress}</IonText>
                    </IonItem>
                  </>
                )}

                {storageNFT &&
                storageNFT.owner_token_ids.findIndex(
                  (obj) => obj[0] === (userAddress as address)
                ) >= 0 ? (
                  <IonImg
                    src={nftContratTokenMetadataMap
                      .get(0)!
                      .thumbnailUri?.replace(
                        "ipfs://",
                        "https://gateway.pinata.cloud/ipfs/"
                      )}
                  />
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

/*
<IonTitle>Register and verify your social account</IonTitle>

                    {!userProfile.displayName ? (
                      <IonInput
                        labelPlacement="floating"
                        color="primary"
                        value={displayName}
                        label="Display name"
                        placeholder="John Doe"
                        type="text"
                        maxlength={32}
                        counter
                        required
                        onIonChange={(str) => {
                          if (str.detail.value === undefined) return;
                          setDisplayName(str.target.value! as string);
                        }}
                      />
                    ) : (
                      ""
                    )}

                    {!userProfile.socialAccountAlias ? (
                      <IonInput
                        labelPlacement="floating"
                        color="primary"
                        value={contactId}
                        label="Contact identifier/alias"
                        placeholder="@twitterAlias"
                        type="text"
                        maxlength={32}
                        counter
                        required
                        onIonChange={(str) => {
                          if (str.detail.value === undefined) return;
                          setContactId(str.target.value! as string);
                        }}
                      />
                    ) : (
                      ""
                    )}

                    {!userProfile.socialAccountType ? (
                      <IonSelect
                        labelPlacement="floating"
                        value={contactIdProvider}
                        label="Select your Social account"
                        onIonChange={(str) => {
                          if (str.detail.value === undefined) return;
                          setContactIdProvider(str.target.value! as string);
                        }}
                      >
                        {Object.keys(SOCIAL_ACCOUNT_TYPE).map((e) => (
                          <IonSelectOption key={e} value={e}>
                            {e}
                          </IonSelectOption>
                        ))}
                      </IonSelect>
                    ) : (
                      ""
                    )}

                    <IonButton onClick={login}>Login</IonButton>

                    {userProfile.proof ? (
                      <>
                        <IonItem>
                          <IonText>
                            You have 60s to copy this proof on your social
                            account. <br />
                            Ex : Copy/paste this proof on new message on Twitter{" "}
                            <br />
                            Then paste your link below anc click on Verify
                          </IonText>
                          <IonTextarea
                            contentEditable
                            onClick={() => writeToClipboard(userProfile.proof)}
                          >
                            {userProfile.proof}
                          </IonTextarea>
                        </IonItem>

                        <IonItem>
                          <IonLabel>Paste your proof url here</IonLabel>
                          <IonInput
                            labelPlacement="floating"
                            value={proofUrl}
                            label="Proof url"
                            placeholder="https://twitter.com/MYALIAS/status/STATUSID"
                            type="text"
                            maxlength={64}
                            counter
                            required
                            onIonChange={(str) => {
                              if (str.detail.value === undefined) return;
                              setProofUrl(str.target.value! as string);
                            }}
                          />

                          <IonButton onClick={verifyProof}>
                            Verify proof
                          </IonButton>
                        </IonItem>
                      </>
                    ) : (
                      ""
                    )}
*/
