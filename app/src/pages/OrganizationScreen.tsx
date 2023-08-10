import * as api from "@tzkt/sdk-api";
import { BigMapKey } from "@tzkt/sdk-api";

import {
  IonBadge,
  IonButton,
  IonButtons,
  IonCheckbox,
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
  IonTextarea,
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
import {
  LocalStorageKeys,
  Organization,
  UserContext,
  UserContextType,
} from "../App";
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
  selectedTab: TABS;
  setSelectedTab: Dispatch<SetStateAction<TABS>>;
};

export enum TABS {
  DESCRIPTION = "DESCRIPTION",
  MESSAGES = "MESSAGES",
  ADMINISTRATION = "ADMINISTRATION",
}

export const OrganizationScreen = ({
  organizationName,
  isTezosOrganization,
  refreshMyOrganizations,
  setSelectedOrganizationName,
  selectedTab,
  setSelectedTab,
}: OrganizationProps): JSX.Element => {
  const history = useHistory();

  const {
    Tezos,
    userAddress,
    storage,
    mainWalletType,
    setLoading,
    userProfiles,
    refreshStorage,
    localStorage,
  } = React.useContext(UserContext) as UserContextType;

  api.defaults.baseUrl =
    "https://api." + import.meta.env.VITE_NETWORK + ".tzkt.io";

  const [presentAlert] = useIonAlert();

  const [organization, setOrganization] = useState<Organization | undefined>(
    undefined
  );

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
          organization!.autoRegistration,
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
    console.log("transfer");

    try {
      setLoading(true);
      const op = await Tezos.wallet
        .transfer({
          to: organization!.fundingAddress!.Some,
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
            //console.warn("TZKT call failed", error);
          }
        }

        if (keys) setMembers(Array.from(keys.map((key) => key.key as address))); //take only active keys

        setOrganization(organization!);
      }
    } else {
      setOrganization(undefined);
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
    <IonContent className="ion-page" id="main">
      {organization ? (
        <IonContent style={{ height: "calc(100%  - 56px  - 56px)" }}>
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
            <IonContent
              className="ion-padding"
              style={{ height: "calc(100% - 56px)" }}
            >
              <IonTitle>{organization.name}</IonTitle>

              <IonList lines="none">
                <IonItem>
                  <IonTextarea
                    autoGrow
                    readonly={
                      organization.admins.indexOf(userAddress as address) >= 0
                        ? false
                        : true
                    }
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
                        organization.business = (
                          str.target.value as string
                        ).replace(/[^\x00-\x7F]/g, "");
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
                    }    ${
                      organization.admins.indexOf(userAddress as address) >= 0
                        ? "edit"
                        : "readonly"
                    }    `}
                  ></IonTextarea>
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
                    value={organization.fundingAddress?.Some}
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
                      organization.fundingAddress = {
                        "Some": str.target.value! as unknown as address,
                      };
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
                                str.target.value
                                  .toString()
                                  .match("/[0-9]+/g") ||
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

                <IonItem>
                  <IonCheckbox
                    label-placement="stacked"
                    checked={organization.autoRegistration}
                    disabled={
                      organization.admins.indexOf(userAddress as address) >= 0
                        ? false
                        : true
                    }
                    className="checkbox-enabled"
                    onIonChange={(str) => {
                      console.log(
                        "autoRegistration",
                        str.target.checked,
                        organization.autoRegistration
                      );

                      if (str.detail.checked === undefined) return;
                      organization.autoRegistration = str.target.checked!;
                      setOrganization(organization);
                    }}
                  >
                    AutoRegistration
                  </IonCheckbox>
                </IonItem>

                {!isTezosOrganization ? (
                  <>
                    <hr
                      color="danger"
                      style={{ borderWidth: "1px", height: "0" }}
                    />

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
                    color="dark"
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
    </IonContent>
  );
};
