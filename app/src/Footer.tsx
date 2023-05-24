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
    socket,
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

      console.log("****************** Connect to web2 backend now");

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
      const { data } = await signIn("http://localhost:3001")({
        pk: (await wallet.client.getActiveAccount())?.publicKey!,
        pkh: userAddress,
        message: messagePayload.payload,
        signature: signedPayload.signature,
      });

      const { accessToken, idToken } = data;

      console.log(
        "*********************** accessToken, idToken",
        accessToken,
        jwt_decode(idToken)
      );

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
    console.log("disconnecting wallet");
    await wallet.clearActiveAccount();

    history.replace(PAGES.ORGANIZATIONS);
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
                      color={
                        userProfiles.get(userAddress as address)
                          ? "success"
                          : "warning"
                      }
                    >
                      {userProfiles.get(userAddress as address)
                        ? "Verified"
                        : "Unverified"}
                    </IonChip>
                    {userProfiles.get(userAddress as address) ? (
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
                {userProfiles.get(userAddress as address) ? (
                  <UserProfileChip
                    address={userAddress as address}
                    userProfiles={userProfiles}
                  />
                ) : (
                  <>
                    <IonItem>
                      <IonLabel>Address : </IonLabel>
                      <IonText>{userAddress}</IonText>
                    </IonItem>
                    <div>
                      {providers.map((provider) => (
                        <OAuth key={provider} provider={provider} />
                      ))}
                    </div>
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
