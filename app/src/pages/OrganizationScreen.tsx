import { BigMapKey, BigMapsService, MichelineFormat } from "@dipdup/tzkt-api";
import {
  IonBadge,
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
  IonSegment,
  IonSegmentButton,
  IonText,
  IonTitle,
  IonToolbar,
  useIonAlert,
} from "@ionic/react";
import { BigNumber } from "bignumber.js";
import { arrowBackOutline, cashOutline, sendOutline } from "ionicons/icons";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { Organization, UserContext, UserContextType } from "../App";
import { TransactionInvalidBeaconError } from "../TransactionInvalidBeaconError";
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
  const [presentAlert] = useIonAlert();

  const [selectedTab, setSelectedTab] = useState<TABS>(TABS.DESCRIPTION);
  const [members, setMembers] = useState<address[]>([]);

  //fund transfer
  const modalTransfer = useRef<HTMLIonModalElement>(null);
  const [amount, setAmount] = useState<number>(0);
  const [amountIsValid, setAmountIsValid] = useState<boolean>(false);

  const bigMapsService = new BigMapsService({
    baseUrl: "https://api.ghostnet.tzkt.io",
    version: "",
    withCredentials: false,
  });

  const transfer = async () => {
    console.log("transfer", Tezos);

    try {
      setLoading(true);
      const op = await Tezos.wallet
        .transfer({
          to: organization?.fundingAddress!,
          amount: amount * Math.pow(10, 6),
          mutez: true,
        })
        .send();

      await op.confirmation();

      await modalTransfer.current?.dismiss();
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

                  <IonItem>
                    <IonInput
                      readonly
                      label-placement="stacked"
                      label="Funding address"
                      value={organization.fundingAddress}
                    ></IonInput>

                    {organization.fundingAddress ? (
                      <>
                        <IonButton id="openTransfer">
                          <IonIcon
                            slot="end"
                            color="white"
                            icon={cashOutline}
                          />
                          Send funds
                        </IonButton>
                        <IonModal trigger="openTransfer" ref={modalTransfer}>
                          <IonHeader>
                            <IonToolbar>
                              <IonButtons slot="start">
                                <IonButton
                                  onClick={() =>
                                    modalTransfer.current?.dismiss()
                                  }
                                >
                                  <IonIcon
                                    slot="start"
                                    icon={arrowBackOutline}
                                  ></IonIcon>
                                  BACK
                                </IonButton>
                              </IonButtons>
                              <IonButtons slot="end">
                                <IonButton
                                  disabled={!amountIsValid}
                                  onClick={transfer}
                                >
                                  <IonIcon
                                    slot="start"
                                    icon={sendOutline}
                                  ></IonIcon>
                                  Send
                                </IonButton>
                              </IonButtons>
                              <IonTitle>Send funds</IonTitle>
                            </IonToolbar>
                          </IonHeader>
                          <IonContent color="light" class="ion-padding">
                            <IonInput
                              labelPlacement="floating"
                              color="primary"
                              value={amount}
                              label="Amount *"
                              type="number"
                              min={0.000001}
                              onIonChange={(str) => {
                                if (
                                  str.detail.value === undefined ||
                                  !str.target.value ||
                                  str.target.value === "" ||
                                  (str.target.value as string).match(
                                    "/[0-9]+/g"
                                  ) ||
                                  (str.target.value as number) <
                                    Math.pow(10, -6)
                                ) {
                                  setAmountIsValid(false);
                                  setAmount(Number(str.target.value as string));
                                } else {
                                  const rounded = Number(
                                    str.target.value as string
                                  ).toFixed(6);
                                  setAmount(Number(rounded));
                                  str.target.value = rounded;
                                  setAmountIsValid(true);
                                }
                              }}
                              helperText="Enter some tez to send"
                              errorText="Amount is required and should be valid"
                              className={`${amountIsValid && "ion-valid"} ${
                                amountIsValid === false && "ion-invalid"
                              } ion-touched `}
                            />
                          </IonContent>
                        </IonModal>
                      </>
                    ) : (
                      ""
                    )}
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
