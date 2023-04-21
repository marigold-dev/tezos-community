import { BigMapKey, BigMapsService, MichelineFormat } from "@dipdup/tzkt-api";
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonText,
  IonThumbnail,
  IonTitle,
  IonToolbar,
  useIonAlert,
} from "@ionic/react";
import { BigNumber } from "bignumber.js";
import { addCircle, ellipse, peopleCircle } from "ionicons/icons";
import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";
import { Organization, PAGES, UserContext, UserContextType } from "../App";
import { TransactionInvalidBeaconError } from "../TransactionInvalidBeaconError";
import { getStatusColor } from "../Utils";
import { address } from "../type-aliases";
import { OrganizationAdministration } from "./OrganizationAdministration";
import { OrganizationMessages } from "./OrganizationMessages";

type OrganizationProps = {
  organization: Organization | undefined;
};

enum TABS {
  DESCRIPTION = "DESCRIPTION",
  MESSAGES = "MESSAGES",
  ADMINISTRATION = "ADMINISTRATION",
}

export const OrganizationScreen = ({
  organization,
}: OrganizationProps): JSX.Element => {
  const {
    Tezos,
    wallet,
    userAddress,
    userBalance,
    storage,
    mainWalletType,
    setStorage,
    setUserAddress,
    setUserBalance,
    setLoading,
    loading,
    refreshStorage,
  } = React.useContext(UserContext) as UserContextType;

  const [presentAlert] = useIonAlert();
  const history = useHistory();

  const [selectedOrganization, setSelectedOrganization] = useState<
    Organization | undefined
  >();

  //modal JOIN
  const modalJoin = useRef<HTMLIonModalElement>(null);
  const [contactId, setContactId] = useState<string>("");
  const [contactIdProvider, setContactIdProvider] = useState<string>("");
  const [reason, setReason] = useState<string>("");

  //modal ADD
  const modalAdd = useRef<HTMLIonModalElement>(null);
  const [business, setBusiness] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [ipfsNftUrl, setIpfsNftUrl] = useState<string>("");
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [siteUrl, setSiteUrl] = useState<string>("");

  const [selectedTab, setSelectedTab] = useState<TABS>(TABS.DESCRIPTION);
  const [members, setMembers] = useState<address[]>([]);

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

  const bigMapsService = new BigMapsService({
    baseUrl: "https://api.ghostnet.tzkt.io",
    version: "",
    withCredentials: false,
  });

  useEffect(() => {
    (async () => {
      if (organization) {
        const membersBigMapId = (
          organization?.members as unknown as { id: BigNumber }
        ).id.toNumber();

        const keys: BigMapKey[] = await bigMapsService.getKeys({
          id: membersBigMapId,
          micheline: MichelineFormat.JSON,
        });

        setMembers(Array.from(keys.map((key) => key.key as address)));
      } else {
        console.log("selected org is null", organization);
      }
    })();
  }, [organization, userAddress]);

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
      await modalAdd.current?.dismiss();
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

  return (
    <div className="ion-page" id="main">
      {organization ? (
        <IonContent className="ion-padding">
          <IonToolbar>
            <IonSegment
              onIonChange={(e) =>
                setSelectedTab(TABS[e.target.value! as keyof typeof TABS])
              }
              value={selectedTab}
            >
              <IonSegmentButton value={TABS.DESCRIPTION}>
                <IonLabel>Description</IonLabel>
              </IonSegmentButton>
              <IonSegmentButton value={TABS.MESSAGES}>
                <IonLabel>Messages</IonLabel>
              </IonSegmentButton>

              {organization.admins.indexOf(userAddress as address) >= 0 ? (
                <IonSegmentButton value={TABS.ADMINISTRATION}>
                  <IonLabel>Administration</IonLabel>
                </IonSegmentButton>
              ) : (
                ""
              )}
            </IonSegment>
          </IonToolbar>

          {selectedTab == TABS.DESCRIPTION ? (
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>
                  {organization.name}
                  {" (" + (members ? members.length : 0) + " members)"}
                </IonCardTitle>
              </IonCardHeader>

              <IonCardContent>
                <IonList>
                  <IonItem>
                    <IonTitle>Website</IonTitle>
                    {organization.siteUrl}
                  </IonItem>
                  <IonItem>
                    <IonTitle>Logo</IonTitle>
                    {organization.logoUrl}
                  </IonItem>
                  <IonItem>
                    <IonTitle>IPFS membership card url</IonTitle>
                    {organization.ipfsNftUrl}
                  </IonItem>
                  <IonItem>
                    <IonTitle>Objective</IonTitle>
                    {organization.business}
                  </IonItem>
                  <IonItem>
                    <IonTitle>Social account verified ?</IonTitle>
                    {organization.verified ? "true" : "false"}
                  </IonItem>
                  <IonItem>
                    <IonTitle>Members</IonTitle>
                    <IonList>
                      {members
                        ? members.map((member) => (
                            <IonItem key={member}>{member}</IonItem>
                          ))
                        : ""}
                    </IonList>
                  </IonItem>
                </IonList>
              </IonCardContent>
            </IonCard>
          ) : selectedTab == TABS.MESSAGES ? (
            <OrganizationMessages organization={organization} />
          ) : (
            <OrganizationAdministration
              organization={organization}
              members={members}
            />
          )}
        </IonContent>
      ) : (
        <>
          <IonText>
            <h1>Not part of an organization yet ?</h1>
            <IonButton id="join" color="transparent">
              <IonIcon slot="start" icon={peopleCircle}></IonIcon>
              Join organization
            </IonButton>
            <h3>or</h3>
            <IonButton id="addFromOrganization" color="transparent">
              <IonIcon slot="start" icon={addCircle}></IonIcon>
              Create organization
            </IonButton>
          </IonText>

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

          <IonModal trigger="addFromOrganization" ref={modalAdd}>
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
        </>
      )}
    </div>
  );
};
