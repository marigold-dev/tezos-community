import {
  IonButton,
  IonChip,
  IonContent,
  IonGrid,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonRow,
  IonSegment,
  IonSegmentButton,
  IonTextarea,
  IonToolbar,
  RefresherEventDetail,
  useIonAlert,
} from "@ionic/react";
import { TzCommunityIonicUserProfileChip } from "@marigold-dev/tezos-community-reactcontext-ionic";
import * as api from "@tzkt/sdk-api";
import {
  arrowDownCircleOutline,
  cardOutline,
  logOut,
  mailOpenOutline,
  returnUpBackOutline,
  timeOutline,
  unlinkOutline,
  wallet,
  warningOutline,
} from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation, useRouteMatch } from "react-router";

import { PAGES, UserContext, UserContextType } from "../App";
import { Footer } from "../Footer";
import { Header } from "../Header";
import { OAuth } from "../OAuth";
import { TransactionInvalidBeaconError } from "../TransactionInvalidBeaconError";
import { address } from "../type-aliases";

import {
  LocalStorageKeys,
  SOCIAL_ACCOUNT_TYPE,
} from "@marigold-dev/tezos-community";
import {
  TzCommunityReactContext,
  TzCommunityReactContextType,
} from "@marigold-dev/tezos-community-reactcontext";

export const ProfileScreen: React.FC = () => {
  const [presentAlert] = useIonAlert();
  api.defaults.baseUrl =
    "https://api." + import.meta.env.VITE_NETWORK + ".tzkt.io";

  const {
    setUserProfile,
    userProfile,
    localStorage,
    setUserProfiles,
    userProfiles,
  } = React.useContext(TzCommunityReactContext) as TzCommunityReactContextType;

  const {
    userAddress,
    nftContratTokenMetadataMap,
    storage,

    setLoading,
    nftWalletType,
    refreshStorage,
    disconnectWallet,

    storageNFT,
  } = React.useContext(UserContext) as UserContextType;

  const history = useHistory();
  const location = useLocation();
  const match = useRouteMatch();

  useEffect(() => {
    (async () => await refreshStorage())();
  }, [wallet]);

  const unlinkSocialAccount = async () => {
    const accessToken = await localStorage.get(LocalStorageKeys.access_token);

    if (!accessToken) {
      console.warn("You lost your SIWT accessToken");
      await disconnectWallet();
      history.push(PAGES.ORGANIZATIONS);
    }

    const response = await fetch(
      import.meta.env.VITE_TZCOMMUNITY_BACKEND_URL + "/user" + "/unlink",
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
      setUserProfile(undefined);
      userProfiles.delete(userAddress as address);

      // console.log("ProfileScreen CALLING setUserProfiles", userProfiles);
      setUserProfiles(userProfiles); //update cache
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

  enum TABS {
    IDENTITY = "IDENTITY",
    INBOX = "INBOX",
    MEMBERSHIP = "MEMBERSHIP",
  }

  const [selectedTab, setSelectedTab] = useState<TABS>(TABS.IDENTITY);
  const [contractEvents, setContractEvents] = useState<
    (api.ContractEvent & { original: api.ContractEvent })[]
  >([]);

  const fetchReplies = async (event?: CustomEvent<RefresherEventDetail>) => {
    //console.log("fetchReplies");

    const contractEventRepliesAndOriginal: (api.ContractEvent & {
      original: api.ContractEvent;
    })[] = [];

    const replies: api.ContractEvent[] = await api.eventsGetContractEvents({
      contract: { eq: import.meta.env.VITE_TZCOMMUNITY_CONTRACT_ADDRESS! },
      tag: { eq: "reply" },
      payload: { eq: { jsonValue: userAddress, jsonPath: "string_0" } },
      sort: { desc: "id" },
    });

    //console.log("replies", replies);

    await Promise.all(
      replies.map(async (r) => {
        const originalMessages: api.ContractEvent[] =
          await api.eventsGetContractEvents({
            contract: {
              eq: import.meta.env.VITE_TZCOMMUNITY_CONTRACT_ADDRESS!,
            },
            tag: { eq: "message" },
            id: { eq: r.payload.nat },
          });
        contractEventRepliesAndOriginal.push({
          ...r,
          original: originalMessages[0],
        });
        //console.log("originalMessages", originalMessages);
      })
    );

    setContractEvents(
      contractEventRepliesAndOriginal.sort((item1, item2) =>
        item1.id! < item2.id! ? 1 : item1.id! == item2.id! ? 0 : -1
      )
    ); //sort is broken by previous parallel promise.all ...

    if (event) event.detail.complete();
  };

  useEffect(() => {
    if (userAddress) (async () => await fetchReplies())();
  }, [userAddress]);

  return (
    <IonPage className="container">
      <Header history={history} location={location} match={match} />
      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={fetchReplies}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <IonToolbar>
          <IonSegment
            onIonChange={(e) =>
              setSelectedTab(TABS[e.target.value! as keyof typeof TABS])
            }
            value={selectedTab}
          >
            <IonSegmentButton value={TABS.IDENTITY}>
              <IonRow>
                <IonLabel>
                  Identity{" "}
                  <IonChip
                    id="verified"
                    color={userProfile ? "success" : "warning"}
                  >
                    {userProfile ? "Verified" : "Unverified"}
                  </IonChip>
                </IonLabel>
              </IonRow>
            </IonSegmentButton>
            <IonSegmentButton value={TABS.INBOX}>
              <IonLabel>Inbox </IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value={TABS.MEMBERSHIP}>
              <IonLabel>Membership</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton
              onClick={async () => {
                await disconnectWallet();
                history.push(PAGES.ORGANIZATIONS);
              }}
            >
              <IonButton color="dark">
                <IonIcon icon={logOut}></IonIcon>
                Logout
              </IonButton>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
        <IonContent class="ion-padding" style={{ height: "calc(100% - 48px)" }}>
          {selectedTab == TABS.IDENTITY ? (
            <>
              {userProfile ? (
                <IonItem lines="none">
                  <TzCommunityIonicUserProfileChip
                    address={userAddress as address}
                    userProfiles={userProfiles}
                  />
                  <IonButton
                    color="warning"
                    slot="end"
                    onClick={() => unlinkSocialAccount()}
                  >
                    <IonIcon icon={unlinkOutline} />
                    Unlink social account
                  </IonButton>
                </IonItem>
              ) : (
                <>
                  <TzCommunityIonicUserProfileChip
                    address={userAddress as address}
                    userProfiles={userProfiles}
                  />
                  <IonItem lines="none">
                    <IonLabel color="warning">
                      <IonIcon slot="start" icon={warningOutline} />
                      We recommend to link your address to a social network,
                      only people from same organizations can see your data and
                      it is not an onchain data
                      <IonIcon slot="end" icon={warningOutline} />
                    </IonLabel>
                  </IonItem>
                  <IonItem lines="none">
                    {Object.keys(SOCIAL_ACCOUNT_TYPE).map((provider) => (
                      <OAuth key={provider} provider={provider} />
                    ))}
                  </IonItem>
                </>
              )}
            </>
          ) : selectedTab == TABS.INBOX ? (
            <>
              <IonButton
                color="transparent"
                size="small"
                onClick={() => fetchReplies()}
              >
                <IonIcon icon={arrowDownCircleOutline} />
                Pull to refresh
              </IonButton>
              {contractEvents.map((ev) => (
                <IonItem key={ev.id}>
                  <IonGrid fixed>
                    <IonRow
                      style={{ opacity: "0.5", border: "1px solid white" }}
                    >
                      <IonGrid fixed>
                        <IonRow>
                          <IonIcon icon={mailOpenOutline}></IonIcon>
                          Your original message to organization &nbsp;
                          <b>{ev.original?.payload.string_0}</b> &nbsp; on{" "}
                          {new Date(ev.original?.timestamp!).toLocaleString()} :
                        </IonRow>

                        <IonRow>{ev.original?.payload.string_1}</IonRow>
                      </IonGrid>
                    </IonRow>
                    <IonRow style={{ opacity: "0.5" }}>
                      <IonIcon icon={returnUpBackOutline}></IonIcon>
                      Response
                    </IonRow>

                    <IonRow style={{ marginLeft: "5vw" }}>
                      <IonChip>
                        <IonIcon
                          icon={timeOutline}
                          style={{ margin: 0 }}
                        ></IonIcon>
                        {new Date(ev.timestamp!).toLocaleString()}
                      </IonChip>
                      <TzCommunityIonicUserProfileChip
                        userProfiles={userProfiles}
                        address={ev.payload.address}
                      />
                    </IonRow>
                    <IonRow style={{ marginLeft: "5vw" }}>
                      <IonTextarea readonly>{ev.payload.string_1}</IonTextarea>
                    </IonRow>
                  </IonGrid>
                </IonItem>
              ))}
            </>
          ) : storageNFT &&
            storageNFT.owner_token_ids.findIndex(
              (obj) => obj[0] === (userAddress as address)
            ) >= 0 ? (
            <>
              <IonItem lines="none">
                <IonImg
                  style={{ padding: "2em" }}
                  src={nftContratTokenMetadataMap
                    .get(0)!
                    .thumbnailUri?.replace(
                      "ipfs://",
                      "https://gateway.pinata.cloud/ipfs/"
                    )}
                />
              </IonItem>
              <a
                href={
                  "https://" +
                  import.meta.env.VITE_NETWORK +
                  ".tzkt.io/" +
                  storage?.nftAddress
                }
                target="_blank"
              >
                View the NFT contract on TZKT
              </a>
            </>
          ) : (
            <IonItem>
              <IonLabel color="warning">
                <IonIcon slot="start" icon={warningOutline} />
                Claim your Tezos membership card to use it as access control
                later for events or whatever other use case
                <IonIcon slot="end" icon={warningOutline} />
              </IonLabel>
              <IonButton size="large" onClick={claimNFT} color="warning">
                <IonIcon slot="start" icon={cardOutline}></IonIcon>
                Claim NFT
              </IonButton>{" "}
            </IonItem>
          )}
        </IonContent>
      </IonContent>
      <Footer />
    </IonPage>
  );
};
