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
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonPopover,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonText,
  IonTextarea,
  IonThumbnail,
  IonTitle,
  IonToolbar,
  useIonAlert,
} from "@ionic/react";
import React, { useRef, useState } from "react";
import {
  Organization,
  PAGES,
  SOCIAL_ACCOUNT_TYPE,
  UserContext,
  UserContextType,
  UserProfile,
} from "./App";

import { ellipse } from "ionicons/icons";
import { useHistory } from "react-router-dom";
import { TransactionInvalidBeaconError } from "./TransactionInvalidBeaconError";
import { getStatusColor } from "./Utils";

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
    mainWalletType,
    setStorage,
    setUserAddress,
    setUserBalance,
    setLoading,
    refreshStorage,
  } = React.useContext(UserContext) as UserContextType;

  const modalJoin = useRef<HTMLIonModalElement>(null);
  const modalAdd = useRef<HTMLIonModalElement>(null);
  const modalProfile = useRef<HTMLIonModalElement>(null);

  const [selectedOrganization, setSelectedOrganization] = useState<
    Organization | undefined
  >();

  const [displayName, setDisplayName] = useState<string>("");
  const [contactId, setContactId] = useState<string>("");
  const [contactIdProvider, setContactIdProvider] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [proofUrl, setProofUrl] = useState<string>("");

  const [business, setBusiness] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [ipfsNftUrl, setIpfsNftUrl] = useState<string>("");
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [siteUrl, setSiteUrl] = useState<string>("");

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

  const joinOrganization = async (
    e: React.MouseEvent<HTMLIonButtonElement, MouseEvent>
  ) => {
    console.log("joinOrganization");
    e.preventDefault();

    try {
      setLoading(true);
      const op = await mainWalletType!.methods
        .requestToJoinOrganization(
          contactId,
          contactIdProvider,
          selectedOrganization!.name,
          reason
        )
        .send();
      await op?.confirmation();
      const newStorage = await mainWalletType!.storage();
      setStorage(newStorage);
      setLoading(false);
      history.push(PAGES.ORGANIZATIONS); //it was the id created
      await modalJoin.current?.dismiss();
      console.log("newStorage", newStorage);
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

  const addOrganization = async (
    e: React.MouseEvent<HTMLIonButtonElement, MouseEvent>
  ) => {
    console.log("addOrganization");
    e.preventDefault();

    try {
      setLoading(true);
      const op = await mainWalletType!.methods
        .addOrganization(business, ipfsNftUrl, logoUrl, name, siteUrl)
        .send();
      await op?.confirmation();
      const newStorage = await mainWalletType!.storage();
      setStorage(newStorage);
      setLoading(false);
      await modalAdd.current?.dismiss();
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

  const requestProof = async () => {
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
    }
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
              {PAGES.ORGANIZATIONS}
            </IonButton>

            <IonButton id="join" color="transparent">
              Join
            </IonButton>

            <IonButton id="add" color="transparent">
              Add
            </IonButton>

            <IonButton color="transparent" routerLink={PAGES.FUNDING}>
              {PAGES.FUNDING}
            </IonButton>

            <IonButton id="profile" color="transparent">
              Profile
            </IonButton>

            <IonButton color="transparent" onClick={disconnectWallet}>
              logOut
            </IonButton>

            <IonModal trigger="join" ref={modalJoin}>
              <IonHeader>
                <IonToolbar>
                  <IonButtons slot="start">
                    <IonButton onClick={() => modalJoin.current?.dismiss()}>
                      Cancel
                    </IonButton>
                  </IonButtons>
                  <IonTitle>Join an organization</IonTitle>
                  <IonButtons slot="end">
                    <IonButton onClick={joinOrganization}>Done</IonButton>
                  </IonButtons>
                </IonToolbar>
                <IonToolbar>
                  <IonSearchbar></IonSearchbar>
                </IonToolbar>
              </IonHeader>

              <IonContent color="light" class="ion-padding">
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
                <IonInput
                  labelPlacement="floating"
                  value={contactIdProvider}
                  label="Contact Provider (Twitter,Facebook,Gmail,etc...)"
                  placeholder="Twitter"
                  type="text"
                  maxlength={20}
                  counter
                  required
                  onIonChange={(str) => {
                    if (str.detail.value === undefined) return;
                    setContactIdProvider(str.target.value! as string);
                  }}
                />
                <IonInput
                  labelPlacement="floating"
                  value={reason}
                  label="Why do you want to join ?"
                  placeholder="because ..."
                  type="text"
                  maxlength={255}
                  counter
                  required
                  onIonChange={(str) => {
                    if (str.detail.value === undefined) return;
                    setReason(str.target.value! as string);
                  }}
                />

                <IonText>Select an organization*</IonText>
                <IonList id="modal-list" inset={true}>
                  {storage?.organizations.map((organization) => (
                    <IonItem
                      fill={
                        selectedOrganization?.name === organization.name
                          ? "outline"
                          : undefined
                      }
                      onClick={() => {
                        setSelectedOrganization(organization);
                      }}
                      lines="none"
                      key={organization.name}
                    >
                      <IonTitle>{organization.name}</IonTitle>
                      <IonText>
                        <i>{organization.business}</i>
                      </IonText>
                      <IonThumbnail slot="start">
                        <img
                          alt="Tezos"
                          src="https://uploads-ssl.webflow.com/616ab4741d375d1642c19027/61793ee65c891c190fcaa1d0_Vector(1).png"
                        />
                      </IonThumbnail>
                      <IonIcon
                        size="small"
                        slot="end"
                        icon={ellipse}
                        color={getStatusColor(organization)}
                      />
                    </IonItem>
                  ))}
                </IonList>
              </IonContent>
            </IonModal>

            <IonModal trigger="add" ref={modalAdd}>
              <IonHeader>
                <IonToolbar>
                  <IonButtons slot="start">
                    <IonButton onClick={() => modalAdd.current?.dismiss()}>
                      Cancel
                    </IonButton>
                  </IonButtons>
                  <IonTitle>Add an organization</IonTitle>
                  <IonButtons slot="end">
                    <IonButton onClick={addOrganization}>Done</IonButton>
                  </IonButtons>
                </IonToolbar>
              </IonHeader>

              <IonContent color="light" class="ion-padding">
                <IonInput
                  labelPlacement="floating"
                  color="primary"
                  value={name}
                  label="Name"
                  placeholder="my organization name"
                  type="text"
                  maxlength={32}
                  counter
                  required
                  onIonChange={(str) => {
                    if (str.detail.value === undefined) return;
                    setName(str.target.value! as string);
                  }}
                />
                <IonInput
                  labelPlacement="floating"
                  value={business}
                  label="Business goal"
                  placeholder="Save the planet ..."
                  type="text"
                  maxlength={255}
                  counter
                  required
                  onIonChange={(str) => {
                    if (str.detail.value === undefined) return;
                    setBusiness(str.target.value! as string);
                  }}
                />

                <IonInput
                  labelPlacement="floating"
                  value={ipfsNftUrl}
                  label="IPFS NFT url"
                  placeholder="ipfs://"
                  type="text"
                  maxlength={255}
                  counter
                  required
                  onIonChange={(str) => {
                    if (str.detail.value === undefined) return;
                    setIpfsNftUrl(str.target.value! as string);
                  }}
                />

                <IonInput
                  labelPlacement="floating"
                  value={logoUrl}
                  label="Logo url"
                  placeholder="https://"
                  type="text"
                  maxlength={255}
                  counter
                  required
                  onIonChange={(str) => {
                    if (str.detail.value === undefined) return;
                    setLogoUrl(str.target.value! as string);
                  }}
                />

                <IonInput
                  labelPlacement="floating"
                  value={siteUrl}
                  label="Site url goal"
                  placeholder="https://"
                  type="text"
                  maxlength={255}
                  counter
                  required
                  onIonChange={(str) => {
                    if (str.detail.value === undefined) return;
                    setSiteUrl(str.target.value! as string);
                  }}
                />
              </IonContent>
            </IonModal>

            <IonModal trigger="profile" ref={modalProfile}>
              <IonHeader>
                <IonToolbar>
                  <IonButtons slot="start">
                    <IonButton onClick={() => modalProfile.current?.dismiss()}>
                      Cancel
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
                          You require to verify you social account in order to
                          join an organization
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

                    <IonButton onClick={requestProof}>
                      Request a proof
                    </IonButton>

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
                  </>
                )}
              </IonContent>
            </IonModal>
          </>
        ) : (
          <IonButton color="transparent" onClick={connectWallet}>
            Connect your wallet
          </IonButton>
        )}
      </IonToolbar>
    </IonFooter>
  );
};
