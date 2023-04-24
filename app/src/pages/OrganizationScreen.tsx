import { BigMapKey, BigMapsService, MichelineFormat } from "@dipdup/tzkt-api";
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonList,
  IonSegment,
  IonSegmentButton,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { BigNumber } from "bignumber.js";
import React, { useEffect, useState } from "react";
import { Organization, UserContext, UserContextType } from "../App";
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

  const [selectedTab, setSelectedTab] = useState<TABS>(TABS.DESCRIPTION);
  const [members, setMembers] = useState<address[]>([]);

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
            Join organization or create organization
          </IonText>
        </>
      )}
    </div>
  );
};
