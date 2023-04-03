import { BigNumber } from "bignumber.js";

import { BigMapKey, BigMapsService, MichelineFormat } from "@dipdup/tzkt-api";
import {
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonSegment,
  IonSegmentButton,
  IonSpinner,
  IonSplitPane,
  IonTitle,
  IonToolbar,
  useIonAlert,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Organization, UserContext, UserContextType } from "../App";
import { Footer } from "../Footer";
import { Header } from "../Header";
import { address } from "../type-aliases";
export const OrganizationsScreen: React.FC = () => {
  const [presentAlert] = useIonAlert();
  const history = useHistory();

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

  const [myOrganizations, setMyOrganizations] = useState<Organization[]>();

  const bigMapsService = new BigMapsService({
    baseUrl: "https://api.ghostnet.tzkt.io",
    version: "",
    withCredentials: false,
  });

  useEffect(() => {
    (async () => {
      if (storage) {
        const myOrganizations = await Promise.all(
          storage.organizations.filter(async (organization) => {
            const membersBigMapId = (
              organization.members as unknown as { id: BigNumber }
            ).id.toNumber();

            const keys: BigMapKey[] = await bigMapsService.getKeys({
              id: membersBigMapId,
              micheline: MichelineFormat.JSON,
            });

            console.log(storage.tezosOrganization.admins);
            console.log("Members for orga", keys, organization);

            if (
              Array.from(keys.map((key) => key.key as string)).indexOf(
                userAddress as address
              ) >= 0 ||
              organization.admins.indexOf(userAddress as address) >= 0 ||
              storage.tezosOrganization.admins.indexOf(
                userAddress as address
              ) >= 0
            ) {
              return true;
            } else {
              return false;
            }
          })
        );

        setMyOrganizations(myOrganizations);
      } else {
        console.log("storage is not ready yet");
      }
    })();
  }, [storage]);

  return (
    <IonPage className="container">
      <Header />
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={refreshStorage}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        {loading ? (
          <div className="loading">
            <IonItem>
              <IonLabel>Refreshing ...</IonLabel>
              <IonSpinner className="spinner"></IonSpinner>
            </IonItem>
          </div>
        ) : !userAddress ? (
          <IonList inset={true}>
            <IonItem>Welcome to Tezos Community !</IonItem>
          </IonList>
        ) : (
          <IonSplitPane when="xs" contentId="main">
            <IonMenu contentId="main">
              <IonHeader>
                <IonToolbar color="tertiary">
                  <IonTitle>Menu</IonTitle>
                </IonToolbar>
              </IonHeader>
              <IonContent className="ion-padding">
                {storage &&
                storage.tezosOrganization.admins.indexOf(
                  userAddress as address
                ) >= 0 ? (
                  <IonItem key={storage.tezosOrganization.name}>
                    {storage.tezosOrganization.name}
                  </IonItem>
                ) : (
                  <></>
                )}

                {myOrganizations?.map((organization) => (
                  <IonItem key={organization.name}>{organization.name}</IonItem>
                ))}
              </IonContent>
            </IonMenu>

            <div className="ion-page" id="main">
              <IonHeader>
                <IonToolbar>
                  <IonTitle>Main View</IonTitle>
                </IonToolbar>
              </IonHeader>
              <IonContent className="ion-padding">
                <IonToolbar>
                  <IonSegment value="all">
                    <IonSegmentButton disabled>
                      <IonLabel>site</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="all">
                      <IonLabel>Messages</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="favorites">
                      <IonLabel>Administration</IonLabel>
                    </IonSegmentButton>
                  </IonSegment>
                </IonToolbar>

                <IonContent>blabla</IonContent>
              </IonContent>
            </div>
          </IonSplitPane>
        )}
      </IonContent>
      <Footer />
    </IonPage>
  );
};
