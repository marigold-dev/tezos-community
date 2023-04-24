import { BigMapKey, BigMapsService, MichelineFormat } from "@dipdup/tzkt-api";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonModal,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonSearchbar,
  IonSpinner,
  IonSplitPane,
  IonText,
  IonThumbnail,
  IonTitle,
  IonToolbar,
  useIonAlert,
} from "@ionic/react";
import { BigNumber } from "bignumber.js";
import { addCircle, ellipse, peopleCircle } from "ionicons/icons";
import React, { useEffect, useRef, useState } from "react";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import { Organization, PAGES, UserContext, UserContextType } from "../App";
import { Footer } from "../Footer";
import { Header } from "../Header";
import { TransactionInvalidBeaconError } from "../TransactionInvalidBeaconError";
import { getStatusColor } from "../Utils";
import { address } from "../type-aliases";
import { OrganizationScreen } from "./OrganizationScreen";
export const OrganizationsScreen: React.FC = () => {
  const [presentAlert] = useIonAlert();
  const history = useHistory();
  const location = useLocation();
  const match = useRouteMatch();

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

  const [myOrganizations, setMyOrganizations] = useState<Organization[]>([]);

  //modal ADD
  const modalAdd = useRef<HTMLIonModalElement>(null);
  const [business, setBusiness] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [ipfsNftUrl, setIpfsNftUrl] = useState<string>("");
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [siteUrl, setSiteUrl] = useState<string>("");

  //modal JOIN
  const modalJoin = useRef<HTMLIonModalElement>(null);
  const [contactId, setContactId] = useState<string>("");
  const [contactIdProvider, setContactIdProvider] = useState<string>("");
  const [reason, setReason] = useState<string>("");

  const [selectedOrganization, setSelectedOrganization] = useState<
    Organization | undefined
  >();

  const bigMapsService = new BigMapsService({
    baseUrl: "https://api.ghostnet.tzkt.io",
    version: "",
    withCredentials: false,
  });

  useEffect(() => {
    (async () => {
      if (storage && storage.organizations) {
        let orgMembers: Map<string, address[]> = new Map();
        await Promise.all(
          storage.organizations.map(async (organization) => {
            const membersBigMapId = (
              organization.members as unknown as { id: BigNumber }
            ).id.toNumber();

            const keys: BigMapKey[] = await bigMapsService.getKeys({
              id: membersBigMapId,
              micheline: MichelineFormat.JSON,
            });

            orgMembers.set(
              organization.name,
              Array.from(keys.map((key) => key.key))
            );
          })
        );

        setMyOrganizations(
          storage.organizations.filter((org) => {
            const members = orgMembers.get(org.name);

            if (
              members!.indexOf(userAddress as address) >= 0 ||
              org.admins.indexOf(userAddress as address) >= 0 ||
              storage.tezosOrganization.admins.indexOf(
                userAddress as address
              ) >= 0
            ) {
              return org;
            } else {
            }
          })
        );

        if (myOrganizations.length > 0 && !selectedOrganization)
          setSelectedOrganization(myOrganizations[0]);
      } else {
        console.log("storage is not ready yet");
      }
    })();
  }, [storage, userAddress]);

  useEffect(() => {
    (async () => await refreshStorage())();
  }, [wallet]);

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
    <IonPage className="container">
      <Header history={history} location={location} match={match} />
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={refreshStorage}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        {loading ? (
          <div className="loading">
            <IonItem>
              <IonLabel>Waiting for execution ...</IonLabel>
              <IonSpinner className="spinner"></IonSpinner>
            </IonItem>
          </div>
        ) : !userAddress ? (
          <>
            <h2 style={{ paddingTop: "10vh" }}>Welcome to Tezos Community !</h2>

            <IonImg
              style={{ paddingTop: "10vh" }}
              src={process.env.PUBLIC_URL + "/assets/TeamTezosPark.jpg"}
            />
          </>
        ) : (
          <IonSplitPane when="xs" contentId="main">
            <IonMenu contentId="main">
              <IonContent className="ion-padding">
                <IonItem lines="none">
                  <IonButton id="addFromOrganizations" color="transparent">
                    <IonIcon slot="start" icon={addCircle}></IonIcon>
                    Create an organization
                  </IonButton>
                </IonItem>
                <IonItem>
                  <IonButton id="joinFromOrganizations" color="transparent">
                    <IonIcon slot="start" icon={peopleCircle}></IonIcon>
                    Join an organization
                  </IonButton>
                </IonItem>

                <IonModal trigger="joinFromOrganizations" ref={modalJoin}>
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
                      {storage?.organizations
                        .filter(
                          (org) =>
                            myOrganizations.findIndex(
                              (orgItem) => orgItem.name === org.name
                            ) < 0
                        )
                        .map((organization) => (
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

                <IonModal trigger="addFromOrganizations" ref={modalAdd}>
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

                {storage &&
                storage.tezosOrganization.admins.indexOf(
                  userAddress as address
                ) >= 0 ? (
                  <IonItem
                    fill={
                      selectedOrganization?.name ===
                      storage.tezosOrganization.name
                        ? "outline"
                        : undefined
                    }
                    onClick={() =>
                      setSelectedOrganization(storage.tezosOrganization)
                    }
                    lines="none"
                    key={storage.tezosOrganization.name}
                  >
                    <IonThumbnail slot="start">
                      <img
                        alt="Tezos"
                        src={storage.tezosOrganization.logoUrl}
                      />
                    </IonThumbnail>
                    {storage.tezosOrganization.name}
                    <IonIcon
                      size="small"
                      slot="end"
                      icon={ellipse}
                      color={getStatusColor(storage.tezosOrganization)}
                    />
                  </IonItem>
                ) : (
                  <></>
                )}

                {myOrganizations?.map((organization) => (
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
                    {organization.name}
                    <IonThumbnail slot="start">
                      <img alt="." src={organization.logoUrl} />
                    </IonThumbnail>
                    <IonIcon
                      size="small"
                      slot="end"
                      icon={ellipse}
                      color={getStatusColor(organization)}
                    />
                  </IonItem>
                ))}
              </IonContent>
            </IonMenu>
            <OrganizationScreen organization={selectedOrganization} />
          </IonSplitPane>
        )}
      </IonContent>
      <Footer />
    </IonPage>
  );
};
