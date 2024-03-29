import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCheckbox,
  IonCol,
  IonContent,
  IonGrid,
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
  IonRow,
  IonSearchbar,
  IonSkeletonText,
  IonSpinner,
  IonSplitPane,
  IonText,
  IonTextarea,
  IonThumbnail,
  IonTitle,
  IonToolbar,
  useIonAlert,
} from "@ionic/react";
import * as api from "@tzkt/sdk-api";
import { BigMapKey } from "@tzkt/sdk-api";
import { BigNumber } from "bignumber.js";
import {
  addCircle,
  constructOutline,
  ellipse,
  keyOutline,
  mailOutline,
  mapOutline,
  peopleCircle,
  sendOutline,
} from "ionicons/icons";
import React, { useEffect, useRef, useState } from "react";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import {
  Organization,
  PAGES,
  PROVIDER,
  UserContext,
  UserContextType,
} from "../App";
import { Footer } from "../Footer";
import { Header } from "../Header";
import { TransactionInvalidBeaconError } from "../TransactionInvalidBeaconError";
import { getStatusColor } from "../Utils";
import { OrganizationScreen, TABS } from "./OrganizationScreen";

import { LocalStorageKeys } from "@marigold-dev/tezos-community";
import {
  TzCommunityReactContext,
  TzCommunityReactContextType,
} from "@marigold-dev/tezos-community-reactcontext";
import { address } from "../type-aliases";
export const OrganizationsScreen: React.FC = () => {
  api.defaults.baseUrl =
    "https://api." + import.meta.env.VITE_NETWORK + ".tzkt.io";

  const { localStorage } = React.useContext(
    TzCommunityReactContext
  ) as TzCommunityReactContextType;

  const [presentAlert] = useIonAlert();
  const history = useHistory();
  const location = useLocation();
  const match = useRouteMatch();

  const {
    Tezos,
    userAddress,

    storage,
    mainContractType,
    mainWalletType,
    setStorage,
    setLoading,
    loading,
    refreshStorage,
    provider,
  } = React.useContext(UserContext) as UserContextType;

  const [myOrganizations, setMyOrganizations] = useState<Organization[]>([]);

  const [orgMembers, setOrgMembers] = useState<Map<string, address[]>>(
    new Map()
  );

  //modal ADD
  const modalAdd = useRef<HTMLIonModalElement>(null);
  const [autoRegistration, setAutoRegistration] = useState<boolean>(false);
  const [business, setBusiness] = useState<string>("");
  const [businessIsValid, setBusinessIsValid] = useState<boolean>(false);
  const [businessMarkTouched, setBusinessMarkTouched] =
    useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [nameIsValid, setNameIsValid] = useState<boolean>(false);
  const [nameMarkTouched, setNameMarkTouched] = useState<boolean>(false);
  const [ipfsNftUrl, setIpfsNftUrl] = useState<string>("");
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [siteUrl, setSiteUrl] = useState<string>("");
  const [fundingAddress, setFundingAddress] = useState<address | null>(null);

  //modal JOIN
  const modalJoin = useRef<HTMLIonModalElement>(null);

  const [reason, setReason] = useState<string>("");
  const [reasonIsValid, setReasonIsValid] = useState<boolean>(false);
  const [reasonMarkTouched, setReasonMarkTouched] = useState<boolean>(false);

  const [joiningOrganization, setJoiningOrganization] = useState<
    Organization | undefined
  >();
  const [joiningOrganizations, setJoiningOrganizations] =
    useState<Organization[]>();

  //modal write
  const modalWrite = useRef<HTMLIonModalElement>(null);
  const [message, setMessage] = useState<string>("");
  const [messageIsValid, setMessageIsValid] = useState<boolean>(false);
  const [messageMarkTouched, setMessageMarkTouched] = useState<boolean>(false);

  const [messagingOrganizations, setMessagingOrganizations] =
    useState<Organization[]>();
  const [messagingOrganization, setMessagingOrganization] = useState<
    Organization | undefined
  >();

  //////////////

  const [selectedOrganizationName, setSelectedOrganizationName] = useState<
    string | undefined
  >();
  const [selectedTab, setSelectedTab] = useState<TABS>(TABS.DESCRIPTION);

  const [isTezosOrganization, setIsTezosOrganization] =
    useState<boolean>(false);

  const refreshMyOrganizations = async () => {
    console.log("refreshMyOrganizations");
    if (storage) {
      //filter my orgs
      let myOrgs = myOrganizations;

      await Promise.all(
        storage.organizations.map(async (organization: Organization) => {
          const membersBigMapId = (
            organization.members as unknown as { id: BigNumber }
          ).id.toNumber();

          //bring until some random seconds wait to avoid beign rejected by TZKT quotas
          setTimeout(async () => {
            const url = LocalStorageKeys.bigMapsGetKeys + membersBigMapId;
            let keys: BigMapKey[] = await localStorage.getWithTTL(url);

            if (!keys) {
              try {
                keys = await api.bigMapsGetKeys(membersBigMapId, {
                  micheline: "Json",
                  active: true,
                });
                await localStorage.setWithTTL(url, keys);
              } catch (error) {
                console.warn("TZKT call failed", error);
              }
            }

            const members = Array.from(keys.map((key) => key.key));

            orgMembers.set(organization.name, members); //push to React state also
            setOrgMembers(orgMembers);

            if (
              (members!.indexOf(userAddress as address) >= 0 ||
                organization.admins.indexOf(userAddress as address) >= 0 ||
                storage.tezosOrganization.admins.indexOf(
                  userAddress as address
                ) >= 0) &&
              myOrganizations.findIndex(
                (org) => org.name === organization.name
              ) < 0
            ) {
              myOrgs.push(organization);
              setMyOrganizations([...myOrgs]); //avoid dup & force refresh
            }
          }, Math.floor(Math.random() * 3000));
        })
      );
    } else {
      //storage not ready yet
      console.warn("storage not ready yet");
    }
  };

  useEffect(() => {
    if (myOrganizations.length > 0 && !selectedOrganizationName) {
      setSelectedOrganizationName(myOrganizations[0].name); //init
      setIsTezosOrganization(false);
    } else if (myOrganizations.length == 0) {
      setSelectedOrganizationName(undefined);
    }
  }, [myOrganizations.length]);

  useEffect(() => {
    (async () => {
      if (storage && storage.organizations) {
        await refreshMyOrganizations();
      } else {
        console.log("storage is not ready yet");
      }
    })();
  }, [storage, userAddress]);

  useEffect(() => {
    (async () => {
      if (storage && storage.organizations) {
        await refreshMyOrganizations();
      } else {
        console.log("storage is not ready yet");
      }
    })();
  }, []);

  useEffect(
    //default organization to join. I can join only organization I am not member of
    () => {
      setJoiningOrganizations(
        storage?.organizations.filter(
          (org: Organization) =>
            orgMembers.get(org.name)!?.indexOf(userAddress as address) < 0 &&
            "active" in org.status
        )
      );

      setMessagingOrganizations(
        storage?.organizations.filter(
          (org: Organization) => "active" in org.status
        )
      );
    },
    [myOrganizations]
  );
  /*
  useEffect(() => {
    (async () => await refreshStorage())();
  }, [storage]);*/

  const joinOrganization = async (
    e: React.MouseEvent<HTMLIonButtonElement, MouseEvent>
  ) => {
    console.log("joinOrganization");
    e.preventDefault();

    try {
      setLoading(true);
      const op = await (provider === PROVIDER.LEDGER
        ? mainContractType!
        : mainWalletType!
      ).methods
        .requestToJoinOrganization(joiningOrganization!.name, reason)
        .send();
      await op?.confirmation();
      const newStorage = await (provider === PROVIDER.LEDGER
        ? mainContractType!
        : mainWalletType!
      ).storage();
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
      const op = await (provider === PROVIDER.LEDGER
        ? mainContractType!
        : mainWalletType!
      ).methods
        .addOrganization(
          autoRegistration,
          business,
          fundingAddress ? { Some: fundingAddress } : null,
          ipfsNftUrl,
          logoUrl,
          name,
          siteUrl
        )
        .send();
      await op?.confirmation();
      const newStorage = await (provider === PROVIDER.LEDGER
        ? mainContractType!
        : mainWalletType!
      ).storage();
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

  const writeToOrganization = async () => {
    console.log("writeToOrganization", Tezos);

    try {
      setLoading(true);

      const op = await (provider === PROVIDER.LEDGER
        ? mainContractType!
        : mainWalletType!
      ).methods
        .sendMessage(messagingOrganization!.name, message)
        .send();

      await op.confirmation();

      await modalWrite.current?.dismiss();
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
          <IonContent
            style={{
              "--background": "none",
              backgroundImage: "url(/assets/TeamTezosPark.jpg)",
              backgroundPosition: "center",
              backgroundSize: "cover",
              backgroundBlendMode: "overlay",
              backgroundColor: "rgba(0, 0, 0, 0.8)",
            }}
          >
            <IonContent style={{ "--background": "none", color: "primary" }}>
              <h1 style={{ paddingTop: "10vh" }}>
                Entering Tezos Social Graph
              </h1>
              <IonGrid>
                <IonRow>
                  <IonCol sizeSm="12" sizeXs="12" sizeMd="6" sizeXl="6">
                    <IonCard style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                      <IonCardHeader>
                        <IonCardTitle>
                          <IonIcon icon={mapOutline}></IonIcon>
                          &nbsp;&nbsp; Social graph registry
                        </IonCardTitle>
                      </IonCardHeader>
                      <IonCardContent>
                        Build and manage your own community onchain. Control who
                        can join or not and deliver NFT membership cards
                      </IonCardContent>
                    </IonCard>
                  </IonCol>
                  <IonCol sizeSm="12" sizeXs="12" sizeMd="6" sizeXl="6">
                    <IonCard style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                      <IonCardHeader>
                        <IonCardTitle>
                          <IonIcon icon={keyOutline}></IonIcon>
                          &nbsp;&nbsp; Preserve pseudonymity
                        </IonCardTitle>
                      </IonCardHeader>
                      <IonCardContent>
                        You are identified by your Tezos address. Only people
                        from same organization can see your social profile, if
                        you decide to link it.
                      </IonCardContent>
                    </IonCard>
                  </IonCol>
                  <IonCol sizeSm="12" sizeXs="12" sizeMd="6" sizeXl="6">
                    <IonCard style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                      <IonCardHeader>
                        <IonCardTitle>
                          <IonIcon icon={sendOutline}></IonIcon>
                          &nbsp;&nbsp; Send secure onchain alerts
                        </IonCardTitle>
                      </IonCardHeader>
                      <IonCardContent>
                        Notify you community or others one via onchain events.
                        Receive important messages on your phone or via web push
                        (gas cost applies to avoid spam)
                      </IonCardContent>
                    </IonCard>
                  </IonCol>
                  <IonCol sizeSm="12" sizeXs="12" sizeMd="6" sizeXl="6">
                    <IonCard style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                      <IonCardHeader>
                        {" "}
                        <IonCardTitle>
                          <IonIcon icon={constructOutline}></IonIcon>
                          &nbsp;&nbsp; Free integration to other dapps
                        </IonCardTitle>
                      </IonCardHeader>
                      <IonCardContent>
                        Leverage Tezos social graph as user registry for other
                        dapps, like an universal contact list, custom player
                        registry, or community database builder and more ..
                      </IonCardContent>
                    </IonCard>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonContent>
          </IonContent>
        ) : (
          <IonSplitPane when="xs" contentId="main">
            <IonMenu
              contentId="main"
              style={{ height: "calc(100% - 56px - 56px)" }}
            >
              <IonContent className="ion-padding">
                <IonItem lines="none">
                  <IonButton id="addFromOrganizations" color="dark">
                    <IonIcon slot="start" icon={addCircle}></IonIcon>
                    Create an organization
                  </IonButton>
                </IonItem>
                <IonItem>
                  <IonButton id="joinFromOrganizations" color="dark">
                    <IonIcon slot="start" icon={peopleCircle}></IonIcon>
                    Join an organization
                  </IonButton>
                </IonItem>
                <IonItem lines="none">
                  <IonButton id="writeToOrganization" color="dark">
                    <IonIcon slot="start" icon={mailOutline}></IonIcon>
                    Write to an organization
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
                        <IonButton
                          onClick={joinOrganization}
                          disabled={!reasonIsValid || !joiningOrganization}
                        >
                          Done
                        </IonButton>
                      </IonButtons>
                    </IonToolbar>
                    <IonToolbar>
                      <IonSearchbar
                        onIonInput={(ev) => {
                          const target = ev.target as HTMLIonSearchbarElement;
                          console.log("target.value", target.value);

                          if (
                            target &&
                            target !== undefined &&
                            target.value?.trim() !== ""
                          ) {
                            setJoiningOrganizations(
                              storage?.organizations
                                .filter(
                                  (org: Organization) =>
                                    orgMembers
                                      .get(org.name)!
                                      ?.indexOf(userAddress as address) < 0 &&
                                    "active" in org.status
                                )
                                .filter(
                                  (orgItem: Organization) =>
                                    orgItem.name
                                      .toLowerCase()
                                      .indexOf(target.value!.toLowerCase()) >= 0
                                )
                            );
                          } else {
                            setJoiningOrganizations(
                              storage?.organizations.filter(
                                (org: Organization) =>
                                  orgMembers
                                    .get(org.name)!
                                    ?.indexOf(userAddress as address) < 0 &&
                                  "active" in org.status
                              )
                            );
                          }
                        }}
                      ></IonSearchbar>
                    </IonToolbar>
                  </IonHeader>

                  <IonContent color="light" class="ion-padding">
                    <IonInput
                      labelPlacement="floating"
                      value={reason}
                      label="Reason * (ASCII characters only)"
                      placeholder="because ..."
                      type="text"
                      maxlength={255}
                      counter
                      onIonChange={(str) => {
                        if (
                          str.detail.value === undefined ||
                          !str.target.value ||
                          str.target.value === ""
                        ) {
                          setReasonIsValid(false);
                        } else {
                          setReason(
                            (str.target.value as string).replace(
                              /[^\x00-\x7F]/g,
                              ""
                            )
                          );
                          setReasonIsValid(true);
                        }
                      }}
                      helperText="Enter the reason why you want to join"
                      errorText="Reason required"
                      className={`${reasonIsValid && "ion-valid"} ${
                        reasonIsValid === false && "ion-invalid"
                      } ${reasonMarkTouched && "ion-touched"}`}
                      onIonBlur={() => setReasonMarkTouched(true)}
                    />

                    <IonText>Select an organization *</IonText>

                    <IonList id="modal-list" inset={true}>
                      {joiningOrganizations &&
                        joiningOrganizations.map((organization) => (
                          <IonItem
                            fill={
                              joiningOrganization?.name === organization.name
                                ? "outline"
                                : undefined
                            }
                            onClick={() => {
                              setJoiningOrganization(organization);
                            }}
                            lines="none"
                            key={"modal-list-" + organization.name}
                          >
                            <IonGrid>
                              <IonRow style={{ height: "4em" }}>
                                <IonCol size="auto">
                                  <IonThumbnail>
                                    <IonImg
                                      alt="."
                                      src={organization.logoUrl}
                                    />
                                  </IonThumbnail>
                                </IonCol>
                                <IonCol size="3">{organization.name}</IonCol>
                                <IonCol>
                                  <IonContent color="transparent" scrollY>
                                    {organization.business}
                                  </IonContent>
                                </IonCol>
                              </IonRow>
                            </IonGrid>
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
                        <IonButton
                          onClick={addOrganization}
                          disabled={!nameIsValid || !businessIsValid}
                        >
                          Done
                        </IonButton>
                      </IonButtons>
                    </IonToolbar>
                  </IonHeader>

                  <IonContent color="light" class="ion-padding">
                    <IonInput
                      labelPlacement="floating"
                      color="primary"
                      value={name}
                      label="Name *"
                      placeholder="my organization name"
                      type="text"
                      maxlength={36}
                      counter
                      onIonChange={(str) => {
                        if (
                          str.detail.value === undefined ||
                          !str.target.value ||
                          str.target.value === ""
                        ) {
                          setNameIsValid(false);
                        } else {
                          setName(str.target.value as string);
                          setNameIsValid(true);
                        }
                      }}
                      helperText="Enter a name"
                      errorText="Name required"
                      className={`${nameIsValid && "ion-valid"} ${
                        nameIsValid === false && "ion-invalid"
                      } ${nameMarkTouched && "ion-touched"}`}
                      onIonBlur={() => setNameMarkTouched(true)}
                    />
                    <IonInput
                      labelPlacement="floating"
                      value={business}
                      label="Business *"
                      placeholder="Save the planet ..."
                      type="text"
                      maxlength={255}
                      counter
                      required
                      onIonChange={(str) => {
                        if (
                          str.detail.value === undefined ||
                          !str.target.value ||
                          str.target.value === ""
                        ) {
                          setBusinessIsValid(false);
                        } else {
                          setBusiness(
                            (str.target.value as string).replace(
                              /[^\x00-\x7F]/g,
                              ""
                            )
                          );
                          setBusinessIsValid(true);
                        }
                      }}
                      helperText="Enter a business, goal or objective"
                      errorText="Business required"
                      className={`${businessIsValid && "ion-valid"} ${
                        businessIsValid === false && "ion-invalid"
                      } ${businessMarkTouched && "ion-touched"}`}
                      onIonBlur={() => setBusinessMarkTouched(true)}
                    />

                    <IonInput
                      labelPlacement="floating"
                      value={ipfsNftUrl}
                      label="IPFS NFT url"
                      placeholder="ipfs://"
                      type="text"
                      maxlength={255}
                      counter
                      helperText="Enter ipfs URL to your member card"
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
                      helperText="Enter logo image URL to display"
                      onIonChange={(str) => {
                        if (str.detail.value === undefined) return;
                        setLogoUrl(str.target.value! as string);
                      }}
                    />

                    <IonInput
                      labelPlacement="floating"
                      value={siteUrl}
                      label="Website"
                      placeholder="https://"
                      type="text"
                      maxlength={255}
                      counter
                      helperText="Enter your website url"
                      onIonChange={(str) => {
                        if (str.detail.value === undefined) return;
                        setSiteUrl(str.target.value! as string);
                      }}
                    />

                    <IonInput
                      labelPlacement="floating"
                      value={fundingAddress}
                      label="Funding address"
                      placeholder="tzxxxx or KT1xxxxx"
                      type="text"
                      maxlength={36}
                      counter
                      helperText="Enter your funding address (if you have)"
                      onIonChange={(str) => {
                        if (str.detail.value === undefined) return;
                        setFundingAddress(
                          str.target.value! as unknown as address
                        );
                      }}
                    />

                    <IonCheckbox
                      value={autoRegistration}
                      onIonChange={(str) => {
                        if (str.target.checked === undefined) return;
                        setAutoRegistration(str.target.checked!);
                      }}
                    >
                      AutoRegistration
                    </IonCheckbox>
                  </IonContent>
                </IonModal>

                <IonModal trigger="writeToOrganization" ref={modalWrite}>
                  <IonHeader>
                    <IonToolbar>
                      <IonButtons slot="start">
                        <IonButton
                          onClick={() => modalWrite.current?.dismiss()}
                        >
                          Cancel
                        </IonButton>
                      </IonButtons>
                      <IonTitle>Write message</IonTitle>
                      <IonButtons slot="end">
                        <IonButton
                          onClick={writeToOrganization}
                          disabled={!messageIsValid || !messagingOrganization}
                        >
                          Send
                        </IonButton>
                      </IonButtons>
                    </IonToolbar>
                    <IonToolbar>
                      <IonSearchbar
                        onIonInput={(ev) => {
                          const target = ev.target as HTMLIonSearchbarElement;
                          console.log("target.value", target.value);

                          if (
                            target &&
                            target !== undefined &&
                            target.value?.trim() !== ""
                          ) {
                            setMessagingOrganizations(
                              storage?.organizations.filter(
                                (orgItem: Organization) =>
                                  orgItem.name
                                    .toLowerCase()
                                    .indexOf(target.value!.toLowerCase()) >=
                                    0 && "active" in orgItem.status
                              )
                            );
                          } else {
                            setMessagingOrganizations(
                              storage?.organizations.filter(
                                (org: Organization) => "active" in org.status
                              )
                            );
                          }
                        }}
                      ></IonSearchbar>
                    </IonToolbar>
                  </IonHeader>

                  <IonContent color="light" class="ion-padding">
                    <IonTextarea
                      rows={4}
                      labelPlacement="floating"
                      color="primary"
                      value={message}
                      label="Message *   (ASCII characters only)"
                      placeholder="Type here ..."
                      maxlength={250}
                      counter
                      onIonChange={(str) => {
                        let input = str.detail.value;
                        //cleaning non ascii

                        if (input === undefined || !input || input === "") {
                          setMessageIsValid(false);
                        } else {
                          setMessage(
                            (input as string).replace(/[^\x00-\x7F]/g, "")
                          );
                          setMessageIsValid(true);
                        }
                      }}
                      helperText="Enter a message"
                      errorText="Message is required"
                      className={`${messageIsValid && "ion-valid"} ${
                        messageIsValid === false && "ion-invalid"
                      } ${messageMarkTouched && "ion-touched"}`}
                      onIonBlur={() => setMessageMarkTouched(true)}
                    />

                    <IonText>Select an organization *</IonText>
                    <IonList id="modal-list2" inset={true}>
                      {messagingOrganizations &&
                        messagingOrganizations.map((organization) => (
                          <IonItem
                            fill={
                              messagingOrganization?.name === organization.name
                                ? "outline"
                                : undefined
                            }
                            onClick={() => {
                              setMessagingOrganization(organization);
                            }}
                            lines="none"
                            key={"modal-list2-" + organization.name}
                          >
                            <IonGrid>
                              <IonRow style={{ height: "4em" }}>
                                <IonCol size="auto">
                                  <IonThumbnail>
                                    <IonImg
                                      alt="."
                                      src={organization.logoUrl}
                                    />
                                  </IonThumbnail>
                                </IonCol>
                                <IonCol size="3">{organization.name}</IonCol>
                                <IonCol>
                                  <IonContent color="transparent" scrollY>
                                    {organization.business}
                                  </IonContent>
                                </IonCol>
                              </IonRow>
                            </IonGrid>
                          </IonItem>
                        ))}
                    </IonList>
                  </IonContent>
                </IonModal>

                {storage &&
                storage.tezosOrganization.admins.indexOf(
                  userAddress as address
                ) >= 0 ? (
                  <IonItem
                    fill={
                      selectedOrganizationName ===
                      storage.tezosOrganization.name
                        ? "outline"
                        : undefined
                    }
                    onClick={() => {
                      setSelectedOrganizationName(
                        storage.tezosOrganization.name
                      );
                      setIsTezosOrganization(true);
                    }}
                    lines="none"
                    key={storage.tezosOrganization.name}
                  >
                    <IonThumbnail slot="start">
                      <IonImg
                        style={{ objectFit: "contain" }}
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

                {myOrganizations && myOrganizations.length > 0 ? (
                  myOrganizations?.map((organization) => (
                    <IonItem
                      fill={
                        selectedOrganizationName === organization.name
                          ? "outline"
                          : undefined
                      }
                      onClick={() => {
                        setSelectedOrganizationName(organization.name);
                        setIsTezosOrganization(false);
                      }}
                      lines="none"
                      key={organization.name}
                    >
                      {organization.name}
                      <IonThumbnail slot="start">
                        <IonImg alt="." src={organization.logoUrl} />
                      </IonThumbnail>
                      <IonIcon
                        size="small"
                        slot="end"
                        icon={ellipse}
                        color={getStatusColor(organization)}
                      />
                    </IonItem>
                  ))
                ) : (
                  <IonItem>
                    <IonThumbnail slot="start">
                      <IonSkeletonText animated={true}></IonSkeletonText>
                    </IonThumbnail>
                    <IonLabel>
                      <h3>
                        <IonSkeletonText
                          animated={true}
                          style={{ width: "80%" }}
                        ></IonSkeletonText>
                      </h3>
                    </IonLabel>
                  </IonItem>
                )}
              </IonContent>
            </IonMenu>
            <OrganizationScreen
              organizationName={selectedOrganizationName}
              isTezosOrganization={isTezosOrganization}
              refreshMyOrganizations={refreshMyOrganizations}
              setSelectedOrganizationName={setSelectedOrganizationName}
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
            />
          </IonSplitPane>
        )}
      </IonContent>
      <Footer />
    </IonPage>
  );
};
