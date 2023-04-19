import { BigMapKey, BigMapsService, MichelineFormat } from "@dipdup/tzkt-api";
import {
  IonContent,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonMenu,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  IonSplitPane,
  IonThumbnail,
  useIonAlert,
} from "@ionic/react";
import { BigNumber } from "bignumber.js";
import { ellipse } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Organization, UserContext, UserContextType } from "../App";
import { Footer } from "../Footer";
import { Header } from "../Header";
import { getStatusColor } from "../Utils";
import { address } from "../type-aliases";
import { OrganizationScreen } from "./OrganizationScreen";
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

  const [myOrganizations, setMyOrganizations] = useState<Organization[]>([]);

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
              style={{
                display: myOrganizations.length === 0 ? "none" : "block",
              }}
              contentId="main"
            >
              <IonContent className="ion-padding">
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
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Tezos_logo.svg/langfr-220px-Tezos_logo.svg.png"
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
