import {
  IonButton,
  IonButtons,
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
  IonSelect,
  IonSelectOption,
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
import { addCircle, ellipse, mailOutline, peopleCircle } from "ionicons/icons";
import React, { useEffect, useRef, useState } from "react";
import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import {
  LocalStorageKeys,
  Organization,
  PAGES,
  SOCIAL_ACCOUNT_TYPE,
  UserContext,
  UserContextType,
} from "../App";
import { Footer } from "../Footer";
import { Header } from "../Header";
import { TransactionInvalidBeaconError } from "../TransactionInvalidBeaconError";
import { getStatusColor } from "../Utils";
import { address } from "../type-aliases";
import { OrganizationScreen } from "./OrganizationScreen";
export const OrganizationsScreen: React.FC = () => {
  api.defaults.baseUrl =
    "https://api." + process.env.REACT_APP_NETWORK + ".tzkt.io";

  const [presentAlert] = useIonAlert();
  const history = useHistory();
  const location = useLocation();
  const match = useRouteMatch();

  const {
    Tezos,
    wallet,
    userAddress,
    userBalance,
    userProfiles,
    setUserProfiles,
    storage,
    mainWalletType,
    setStorage,
    setUserAddress,
    setUserBalance,
    setLoading,
    loading,
    refreshStorage,
    getUserProfile,
    localStorage,
  } = React.useContext(UserContext) as UserContextType;

  const [myOrganizations, setMyOrganizations] = useState<Organization[]>([]);

  //page cache for big_map
  const [orgMembers, setOrgMembers] = useState<Map<string, address[]>>(
    new Map()
  );

  //modal ADD
  const modalAdd = useRef<HTMLIonModalElement>(null);
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
  const [contactId, setContactId] = useState<string>("");
  const [contactIdIsValid, setContactIdIsValid] = useState<boolean>(false);
  const [contactIdMarkTouched, setContactIdMarkTouched] =
    useState<boolean>(false);

  const [contactIdProvider, setContactIdProvider] = useState<string>("");
  const [contactIdProviderIsValid, setContactIdProviderIsValid] =
    useState<boolean>(false);
  const [contactIdProviderMarkTouched, setContactIdProviderMarkTouched] =
    useState<boolean>(false);

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
  const [isTezosOrganization, setIsTezosOrganization] =
    useState<boolean>(false);

  const refreshMyOrganizations = async () => {
    if (storage) {
      let orgMembers: Map<string, address[]> = new Map();

      await Promise.all(
        storage.organizations.map(async (organization: Organization) => {
          const membersBigMapId = (
            organization.members as unknown as { id: BigNumber }
          ).id.toNumber();

          const url = LocalStorageKeys.bigMapsGetKeys + membersBigMapId;
          let keys: BigMapKey[] = await localStorage.getCachedRequest(url);

          if (!keys) {
            keys = await api.bigMapsGetKeys(membersBigMapId, {
              micheline: "Json",
            });
            await localStorage.cacheRequest(url, keys);
          }

          orgMembers.set(
            organization.name,
            Array.from(
              keys
                .filter((key) => (key.active ? true : false)) // take only active ones
                .map((key) => key.key)
            )
          );

          //cache userprofiles
          for (const key of keys) {
            if (await localStorage.get(LocalStorageKeys.access_token)) {
              const up = await getUserProfile(key.key);
              if (up) {
                userProfiles.set(key.key, up);
                setUserProfiles(userProfiles);
              }
            }
          }
        })
      );

      //set on a page cache
      setOrgMembers(orgMembers); //refresh cache

      setMyOrganizations(
        storage.organizations.filter((org: Organization) => {
          //console.log("org", org);

          const members = orgMembers.get(org.name);

          if (
            members!.indexOf(userAddress as address) >= 0 ||
            org.admins.indexOf(userAddress as address) >= 0 ||
            storage.tezosOrganization.admins.indexOf(userAddress as address) >=
              0
          ) {
            return org;
          } else {
          }
        })
      );

      if (myOrganizations.length > 0 && !selectedOrganizationName) {
        setSelectedOrganizationName(myOrganizations[0].name); //init
        setIsTezosOrganization(false);
      }
      console.log("myOrganizations", myOrganizations);
    } else {
      //storage not ready yet
    }
  };

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
    if (
      myOrganizations &&
      myOrganizations.length > 0 &&
      !selectedOrganizationName
    ) {
      setSelectedOrganizationName(myOrganizations[0].name); //init
      setIsTezosOrganization(false);
    }
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
          joiningOrganization!.name,
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
        .addOrganization(
          business,
          fundingAddress,
          ipfsNftUrl,
          logoUrl,
          name,
          siteUrl
        )
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

  const writeToOrganization = async () => {
    console.log("writeToOrganization", Tezos);

    try {
      setLoading(true);

      const op = await mainWalletType!.methods
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
          <>
            <h2 style={{ paddingTop: "10vh" }}>Welcome to Tezos Community !</h2>

            <IonImg
              style={{ paddingTop: "10vh" }}
              src={process.env.PUBLIC_URL + "/assets/TeamTezosPark.jpg"}
            />
          </>
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
                          disabled={
                            !contactIdIsValid ||
                            !contactIdProviderIsValid ||
                            !reasonIsValid ||
                            !joiningOrganization
                          }
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
                      color="primary"
                      value={contactId}
                      label="Contact identifier/alias *"
                      placeholder="@twitterAlias"
                      type="text"
                      maxlength={36}
                      counter
                      onIonChange={(str) => {
                        if (
                          str.detail.value === undefined ||
                          !str.target.value ||
                          str.target.value === ""
                        ) {
                          setContactIdIsValid(false);
                        } else {
                          setContactId(str.target.value as string);
                          setContactIdIsValid(true);
                        }
                      }}
                      helperText="Enter an alias as identifier from your social account provider"
                      errorText="Alias required"
                      className={`${contactIdIsValid && "ion-valid"} ${
                        contactIdIsValid === false && "ion-invalid"
                      } ${contactIdMarkTouched && "ion-touched"}`}
                      onIonBlur={() => setContactIdMarkTouched(true)}
                    />

                    <IonSelect
                      labelPlacement="floating"
                      value={contactIdProvider}
                      label="Select your Social account provider *"
                      onIonChange={(str) => {
                        if (
                          str.detail.value === undefined ||
                          !str.target.value ||
                          str.target.value === ""
                        ) {
                          setContactIdProviderIsValid(false);
                        } else {
                          setContactIdProvider(str.target.value as string);
                          setContactIdProviderIsValid(true);
                        }
                      }}
                      className={`${contactIdProviderIsValid && "ion-valid"} ${
                        contactIdProviderIsValid === false && "ion-invalid"
                      } ${contactIdProviderMarkTouched && "ion-touched"}`}
                      onIonBlur={() => setContactIdProviderMarkTouched(true)}
                    >
                      {Object.keys(SOCIAL_ACCOUNT_TYPE).map((e) => (
                        <IonSelectOption key={e} value={e}>
                          {e}
                        </IonSelectOption>
                      ))}
                    </IonSelect>

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
                            key={organization.name}
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
                    <IonList id="modal-list" inset={true}>
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
                            key={organization.name}
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

                {myOrganizations?.map((organization) => (
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
                ))}
              </IonContent>
            </IonMenu>
            <OrganizationScreen
              organizationName={selectedOrganizationName}
              isTezosOrganization={isTezosOrganization}
              refreshMyOrganizations={refreshMyOrganizations}
              setSelectedOrganizationName={setSelectedOrganizationName}
            />
          </IonSplitPane>
        )}
      </IonContent>
      <Footer />
    </IonPage>
  );
};
