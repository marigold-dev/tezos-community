import * as api from "@tzkt/sdk-api";
import { BigMapKey } from "@tzkt/sdk-api";

import {
  IonBadge,
  IonButton,
  IonButtons,
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
import {
  arrowBackOutline,
  cashOutline,
  sendOutline,
  trashOutline,
} from "ionicons/icons";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { useHistory } from "react-router";
import { Organization, UserContext, UserContextType } from "../App";
import { TransactionInvalidBeaconError } from "../TransactionInvalidBeaconError";
import { UserProfileChip } from "../components/UserProfileChip";
import { address } from "../type-aliases";
import { OrganizationAdministration } from "./OrganizationAdministration";
import { OrganizationMessages } from "./OrganizationMessages";

type OrganizationProps = {
  organizationName: string | undefined;
  isTezosOrganization: boolean;
  refreshMyOrganizations: () => Promise<void>;
  setSelectedOrganizationName: Dispatch<SetStateAction<string | undefined>>;
};

enum TABS {
  DESCRIPTION = "DESCRIPTION",
  MESSAGES = "MESSAGES",
  ADMINISTRATION = "ADMINISTRATION",
}

export const OrganizationScreen = ({
  organizationName,
  isTezosOrganization,
  refreshMyOrganizations,
  setSelectedOrganizationName,
}: OrganizationProps): JSX.Element => {
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
    userProfiles,
    refreshStorage,
  } = React.useContext(UserContext) as UserContextType;

  api.defaults.baseUrl =
    "https://api." + process.env.REACT_APP_NETWORK + ".tzkt.io";

  const [presentAlert] = useIonAlert();

  const [organization, setOrganization] = useState<Organization | undefined>(
    undefined
  );

  const [selectedTab, setSelectedTab] = useState<TABS>(TABS.DESCRIPTION);
  const [members, setMembers] = useState<address[]>([]);

  //fund transfer
  const modalTransfer = useRef<HTMLIonModalElement>(null);
  const [amount, setAmount] = useState<number>(0);
  const [amountIsValid, setAmountIsValid] = useState<boolean>(false);

  //update org
  const [businessIsValid, setBusinessIsValid] = useState<boolean>(true);

  const updateOrganization = async () => {
    console.log("updateOrganization");

    try {
      setLoading(true);
      const op = await mainWalletType!.methods
        .updateOrganization(
          organization!.business,
          organization!.fundingAddress,
          organization!.ipfsNftUrl,
          organization!.logoUrl,
          organization!.name,
          organization!.siteUrl
        )
        .send();
      await op?.confirmation();
      await refreshOrganization();
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

  const removeMember = async (member: address) => {
    console.log("removeMember", member, organization!.name);

    try {
      setLoading(true);
      const op = await mainWalletType!.methods
        .removeMember(member, organization!.name)
        .send();
      await op?.confirmation();

      await refreshStorage(); //need to refresh it
      await refreshMyOrganizations(); //need to refresh it too
      setSelectedOrganizationName(undefined);
      setLoading(false);
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

  const refreshOrganization = async () => {
    if (organizationName) {
      const organization = !isTezosOrganization
        ? storage?.organizations.find(
            (org: Organization) => org.name === organizationName
          )
        : storage?.tezosOrganization;

      if (organization) {
        const membersBigMapId = (
          organization?.members as unknown as { id: BigNumber }
        ).id.toNumber();

        const keys: BigMapKey[] = await api.bigMapsGetKeys(membersBigMapId, {
          micheline: "Json",
        });

        setMembers(
          Array.from(
            keys
              .filter((key) => (key.active ? true : false))
              .map((key) => key.key as address)
          )
        ); //take only active keys

        setOrganization(organization!);
        console.log(
          "refreshOrganization",
          organization,
          members,
          membersBigMapId,
          keys
        );
      }
    } else {
      console.log("organization fetch his not ready yet");
    }
  };

  useEffect(() => {
    refreshOrganization();
  }, [organizationName, userAddress]);

  useEffect(() => {
    refreshOrganization();
  }, []);

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
            <IonContent scrollY>
              <IonTitle>{organization.name}</IonTitle>

              <IonList lines="none">
                <IonItem>
                  <IonInput
                    readonly={
                      organization.admins.indexOf(userAddress as address) >= 0
                        ? false
                        : true
                    }
                    type="text"
                    maxlength={255}
                    counter={
                      organization.admins.indexOf(userAddress as address) >= 0
                        ? true
                        : false
                    }
                    label-placement="stacked"
                    label="Business"
                    value={organization.business}
                    onIonChange={(str) => {
                      if (
                        str.detail.value === undefined ||
                        !str.target.value ||
                        str.target.value === ""
                      ) {
                        setBusinessIsValid(false);
                      } else {
                        organization.business = str.target.value as string;
                        setOrganization(organization);
                        setBusinessIsValid(true);
                      }
                    }}
                    helperText={
                      organization.admins.indexOf(userAddress as address) >= 0
                        ? "Enter a business, goal or objective"
                        : ""
                    }
                    errorText="Business required"
                    className={`${businessIsValid && "ion-valid"} ${
                      businessIsValid === false && "ion-invalid"
                    } `}
                  ></IonInput>
                </IonItem>
                <IonItem>
                  <IonInput
                    readonly={
                      organization.admins.indexOf(userAddress as address) >= 0
                        ? false
                        : true
                    }
                    label-placement="stacked"
                    value={organization.siteUrl}
                    label="Website"
                    placeholder={
                      organization.admins.indexOf(userAddress as address) >= 0
                        ? "https://"
                        : ""
                    }
                    type="text"
                    maxlength={255}
                    counter={
                      organization.admins.indexOf(userAddress as address) >= 0
                        ? true
                        : false
                    }
                    helperText={
                      organization.admins.indexOf(userAddress as address) >= 0
                        ? "Enter your website url"
                        : ""
                    }
                    onIonChange={(str) => {
                      if (str.detail.value === undefined) return;
                      organization.siteUrl = str.target.value! as string;
                      setOrganization(organization);
                    }}
                  />
                </IonItem>
                <IonItem>
                  <IonInput
                    readonly={
                      organization.admins.indexOf(userAddress as address) >= 0
                        ? false
                        : true
                    }
                    counter={
                      organization.admins.indexOf(userAddress as address) >= 0
                        ? true
                        : false
                    }
                    label-placement="stacked"
                    value={organization.logoUrl}
                    label="Logo url"
                    placeholder={
                      organization.admins.indexOf(userAddress as address) >= 0
                        ? "https://"
                        : ""
                    }
                    type="text"
                    maxlength={255}
                    helperText={
                      organization.admins.indexOf(userAddress as address) >= 0
                        ? "Enter logo image URL to display"
                        : ""
                    }
                    onIonChange={(str) => {
                      if (str.detail.value === undefined) return;
                      organization.logoUrl = str.target.value! as string;
                      setOrganization(organization);
                    }}
                  />
                </IonItem>

                <IonItem>
                  <IonInput
                    readonly={
                      organization.admins.indexOf(userAddress as address) >= 0
                        ? false
                        : true
                    }
                    label-placement="stacked"
                    value={organization.ipfsNftUrl}
                    label="IPFS membership card url"
                    placeholder={
                      organization.admins.indexOf(userAddress as address) >= 0
                        ? "ipfs://"
                        : ""
                    }
                    type="text"
                    maxlength={255}
                    counter={
                      organization.admins.indexOf(userAddress as address) >= 0
                        ? true
                        : false
                    }
                    helperText={
                      organization.admins.indexOf(userAddress as address) >= 0
                        ? "Enter ipfs URL to your member card"
                        : ""
                    }
                    onIonChange={(str) => {
                      if (str.detail.value === undefined) return;
                      organization.ipfsNftUrl = str.target.value! as string;
                      setOrganization(organization);
                    }}
                  />
                </IonItem>

                <IonItem>
                  <IonInput
                    label-placement="stacked"
                    value={organization.fundingAddress}
                    counter={
                      organization.admins.indexOf(userAddress as address) >= 0
                        ? true
                        : false
                    }
                    readonly={
                      organization.admins.indexOf(userAddress as address) >= 0
                        ? false
                        : true
                    }
                    label="Funding address"
                    placeholder={
                      organization.admins.indexOf(userAddress as address) >= 0
                        ? "tzxxxx or KT1xxxxx"
                        : ""
                    }
                    type="text"
                    maxlength={36}
                    helperText={
                      organization.admins.indexOf(userAddress as address) >= 0
                        ? "Enter your funding address (if you have)"
                        : ""
                    }
                    onIonChange={(str) => {
                      if (str.detail.value === undefined) return;
                      organization.fundingAddress = str.target
                        .value! as unknown as address;
                      setOrganization(organization);
                    }}
                  />

                  {organization.fundingAddress ? (
                    <>
                      <IonButton id="openTransfer">
                        <IonIcon slot="end" color="white" icon={cashOutline} />
                        Send funds
                      </IonButton>
                      <IonModal trigger="openTransfer" ref={modalTransfer}>
                        <IonHeader>
                          <IonToolbar>
                            <IonButtons slot="start">
                              <IonButton
                                onClick={() => modalTransfer.current?.dismiss()}
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
                                (str.target.value as number) < Math.pow(10, -6)
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

                {!isTezosOrganization ? (
                  <>
                    <IonItem lines="none">
                      <IonLabel>Members </IonLabel>
                      <IonBadge>{members ? members.length : 0}</IonBadge>
                    </IonItem>
                    <IonItem lines="none">
                      <IonList>
                        {members
                          ? members.map((member) => (
                              <IonItem key={member}>
                                {" "}
                                <UserProfileChip
                                  address={member}
                                  userProfiles={userProfiles}
                                />
                              </IonItem>
                            ))
                          : ""}
                      </IonList>
                    </IonItem>
                  </>
                ) : (
                  ""
                )}

                {organization.admins.indexOf(userAddress as address) >= 0 ? (
                  <IonButton
                    disabled={!businessIsValid}
                    color="transparent"
                    onClick={updateOrganization}
                  >
                    Update organization
                  </IonButton>
                ) : members.indexOf(userAddress as address) >= 0 ? (
                  <IonButton
                    color="danger"
                    slot="end"
                    onClick={(e) => removeMember(userAddress as address)}
                  >
                    <IonIcon icon={trashOutline} />
                    Leave organization
                  </IonButton>
                ) : (
                  ""
                )}
              </IonList>
            </IonContent>
          ) : selectedTab == TABS.MESSAGES ? (
            <OrganizationMessages organizationName={organizationName} />
          ) : (
            <OrganizationAdministration
              organizationName={organizationName}
              isTezosOrganization={isTezosOrganization}
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
