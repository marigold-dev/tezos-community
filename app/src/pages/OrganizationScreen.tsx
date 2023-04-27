import { BigMapKey, BigMapsService, MichelineFormat } from "@dipdup/tzkt-api";
import {
  IonBadge,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonSegment,
  IonSegmentButton,
  IonText,
  IonToolbar,
} from "@ionic/react";
import { BigNumber } from "bignumber.js";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Organization, UserContext, UserContextType } from "../App";
import { address } from "../type-aliases";
import { OrganizationAdministration } from "./OrganizationAdministration";
import { OrganizationMessages } from "./OrganizationMessages";

type OrganizationProps = {
  organization: Organization | undefined;
  setOrganization: Dispatch<SetStateAction<Organization | undefined>>;
};

enum TABS {
  DESCRIPTION = "DESCRIPTION",
  MESSAGES = "MESSAGES",
  ADMINISTRATION = "ADMINISTRATION",
}

export const OrganizationScreen = ({
  organization,
  setOrganization,
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
                <IonCardTitle>{organization.name}</IonCardTitle>
              </IonCardHeader>

              <IonCardContent>
                <IonList lines="none">
                  <IonItem>
                    <IonInput
                      readonly
                      label-placement="stacked"
                      label="Website"
                      value={organization.siteUrl}
                    ></IonInput>
                  </IonItem>
                  <IonItem>
                    <IonInput
                      readonly
                      label-placement="stacked"
                      label="Logo"
                      value={organization.logoUrl}
                    ></IonInput>
                  </IonItem>
                  <IonItem>
                    <IonInput
                      readonly
                      label-placement="stacked"
                      label="IPFS membership card url"
                      value={organization.ipfsNftUrl}
                    ></IonInput>
                  </IonItem>
                  <IonItem>
                    <IonInput
                      readonly
                      label-placement="stacked"
                      label="Objective"
                      value={organization.business}
                    ></IonInput>
                  </IonItem>
                  <IonItem>
                    <IonInput
                      readonly
                      label-placement="stacked"
                      label="Social account verified ?"
                      value={organization.verified ? "true" : "false"}
                    ></IonInput>
                  </IonItem>

                  <IonItem lines="none">
                    <IonLabel>Members </IonLabel>
                    <IonBadge>{members ? members.length : 0}</IonBadge>
                  </IonItem>
                  <IonItem lines="none">
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
              setOrganization={setOrganization}
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
