import {
  IonChip,
  IonContent,
  IonGrid,
  IonIcon,
  IonItem,
  IonList,
  IonRow,
  IonTextarea,
} from "@ionic/react";
import * as api from "@tzkt/sdk-api";
import { timeOutline } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { UserContext, UserContextType } from "../App";
import { UserProfileChip } from "../components/UserProfileChip";

type OrganizationProps = {
  organizationName: string | undefined;
};

export const OrganizationMessages = ({
  organizationName,
}: OrganizationProps): JSX.Element => {
  api.defaults.baseUrl =
    "https://api." + process.env.REACT_APP_NETWORK + ".tzkt.io";

  const {
    Tezos,
    wallet,
    userAddress,
    userBalance,
    userProfiles,
    storage,
    mainWalletType,
    setStorage,
    setUserAddress,
    setUserBalance,
    setLoading,
    loading,
    refreshStorage,
  } = React.useContext(UserContext) as UserContextType;

  const [contractEvents, setcontractEvents] = useState<api.ContractEvent[]>([]);

  const fetchMessages = async () => {
    const contractEvents: api.ContractEvent[] =
      await api.eventsGetContractEvents({
        contract: { eq: process.env.REACT_APP_CONTRACT_ADDRESS! },
        tag: { eq: "message" },
        payload: { eq: { jsonValue: organizationName!, jsonPath: "string_0" } },
      });
    setcontractEvents(contractEvents);

    console.log("Events", contractEvents);
  };

  useEffect(() => {
    fetchMessages();
  }, [organizationName]);

  return (
    <IonContent className="ion-padding">
      <IonList>
        {contractEvents.map((ev) => (
          <IonItem key={ev.id}>
            <IonGrid fixed>
              <IonRow>
                <UserProfileChip
                  userProfiles={userProfiles}
                  address={ev.payload.address}
                ></UserProfileChip>
                <IonChip>
                  <IonIcon icon={timeOutline} style={{ margin: 0 }}></IonIcon>
                  {new Date(ev.timestamp!).toLocaleString()}
                </IonChip>
              </IonRow>
              <IonRow>
                <IonTextarea readonly>{ev.payload.string_1}</IonTextarea>
              </IonRow>
            </IonGrid>
          </IonItem>
        ))}
      </IonList>
    </IonContent>
  );
};
