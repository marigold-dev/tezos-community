import {
  IonBadge,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonList,
  IonModal,
  IonPopover,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToggle,
  IonToolbar,
  useIonAlert,
} from "@ionic/react";
import { BigNumber } from "bignumber.js";
import {
  addCircleOutline,
  arrowBackOutline,
  checkmarkCircleOutline,
  checkmarkDoneCircleOutline,
  ellipse,
  flagOutline,
  informationCircleOutline,
  playCircleOutline,
  removeCircleOutline,
  stopCircleOutline,
  trashBinOutline,
  trashOutline,
} from "ionicons/icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Limits,
  MemberRequest,
  Organization,
  UserContext,
  UserContextType,
} from "../App";
import { TransactionInvalidBeaconError } from "../TransactionInvalidBeaconError";
import { getStatusColor } from "../Utils";
import { UserProfileChip } from "../components/UserProfileChip";
import { address, nat } from "../type-aliases";

type OrganizationProps = {
  organizationName: string | undefined;
  isTezosOrganization: boolean;
  members: address[];
};

export const OrganizationAdministration = ({
  organizationName,
  isTezosOrganization,
  members,
}: OrganizationProps): JSX.Element => {
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

  const [presentAlert] = useIonAlert();

  const [organization, setOrganization] = useState<Organization>();

  //limits
  const [limits, setLimits] = useState<Limits>({
    adminsMax: new BigNumber(1) as nat,
    memberRequestMax: new BigNumber(1) as nat,
    organizationMax: new BigNumber(1) as nat,
  });

  //member requests
  const [membersToApprove, setMembersToApprove] = useState<address[]>([]);
  const [membersToDecline, setMembersToDecline] = useState<address[]>([]);

  // admin removal or added
  const [selectedAdmin, setSelectedAdmin] = useState<address | null>(null);
  const [selectedAdminIsValid, setSelectedAdminIsValid] =
    useState<boolean>(false);
  const [selectedAdminMarkTouched, setSelectedAdminMarkTouched] =
    useState<boolean>(false);

  //pass flag
  const modalPassFlag = useRef<HTMLIonModalElement>(null);

  const responseToJoinOrganization = async () => {
    console.log("responseToJoinOrganization");

    console.log("membersToApprove", membersToApprove);
    console.log("membersToDecline", membersToDecline);

    try {
      setLoading(true);
      const op = await mainWalletType!.methods
        .responseToJoinOrganization(
          membersToApprove,
          membersToDecline,
          organization!.name
        )
        .send();
      await op?.confirmation();
      await refreshStorage();
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

  const freezeOrganization = async (organizationName: string) => {
    console.log("freezeOrganization");

    try {
      setLoading(true);
      const op = await mainWalletType!.methods
        .freezeOrganization(organizationName)
        .send();
      await op?.confirmation();
      setOrganization({ ...organization! }); //force refresh
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

  const activateOrganization = async (
    e: React.MouseEvent<HTMLIonIconElement, MouseEvent>,
    organizationName: string
  ) => {
    console.log("activateOrganization");
    e.preventDefault();
    try {
      setLoading(true);
      const op = await mainWalletType!.methods
        .activateOrganization(organizationName)
        .send();
      await op?.confirmation();
      setOrganization({ ...organization! }); //force refresh
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

  const removeOrganization = async (organizationName: string) => {
    console.log("removeOrganization");

    try {
      setLoading(true);
      const op = await mainWalletType!.methods
        .removeOrganization(organizationName)
        .send();
      await op?.confirmation();
      const newStorage = await mainWalletType!.storage();
      setStorage(newStorage);
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

  const removeMember = async (member: address) => {
    console.log("removeMember", member, organization!.name);

    try {
      setLoading(true);
      const op = await mainWalletType!.methods
        .removeMember(member, organization!.name)
        .send();
      await op?.confirmation();

      await refreshStorage();

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

  const removeAdmin = async (adminToRemove: address) => {
    console.log("removeAdmin", adminToRemove, organization!.name);

    try {
      setLoading(true);
      const op = await mainWalletType!.methods
        .removeAdmin(adminToRemove, selectedAdmin, organization!.name)
        .send();
      await op?.confirmation();

      await refreshStorage();
      setSelectedAdmin(null); //reset

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

  const addAdmin = async () => {
    console.log(
      "addAdmin",
      selectedAdmin,
      organization!.name,
      isTezosOrganization
    );

    try {
      setLoading(true);
      const op = !isTezosOrganization
        ? await mainWalletType!.methods
            .addAdmin(selectedAdmin!, organization!.name)
            .send()
        : await mainWalletType!.methods.addTezosAdmin(selectedAdmin!).send();
      await op?.confirmation();

      await refreshStorage();
      setSelectedAdmin(null); //reset

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

  const updateLimits = async () => {
    console.log("updateLimits");

    try {
      setLoading(true);
      const op = await mainWalletType!.methods
        .changeLimits(
          limits.adminsMax,
          limits.memberRequestMax,
          limits.organizationMax
        )
        .send();

      await op?.confirmation();

      await refreshStorage();

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

  const refreshOrganization = () => {
    if (organizationName) {
      const organization = !isTezosOrganization
        ? storage?.organizations.find(
            (org: Organization) => org.name === organizationName
          )
        : storage?.tezosOrganization;

      setMembersToApprove(
        organization?.memberRequests
          ? organization?.memberRequests.map((mr: MemberRequest) => mr.user)
          : []
      );
      setMembersToDecline([]);

      setLimits(storage?.limits!);

      setOrganization(organization);
    }
  };

  useEffect(() => {
    refreshOrganization();
  }, [organizationName, userAddress]);

  useEffect(() => {
    refreshOrganization();
  }, []);

  return (
    <IonContent
      className="ion-padding"
      style={{ height: "calc(100%  - 56px)" }}
    >
      <IonList>
        {/* Administrators */}
        <hr color="danger" style={{ borderWidth: "1px", height: "0" }} />

        <IonTitle>
          <IonGrid fixed={true}>
            <IonRow>
              <IonCol>
                Administrators{" "}
                <IonBadge>
                  {organization?.admins ? organization?.admins.length : 0}
                </IonBadge>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonInput
                  labelPlacement="floating"
                  color="primary"
                  value={selectedAdmin}
                  label="Administrator *"
                  placeholder="tzxxxx"
                  type="text"
                  maxlength={36}
                  counter
                  onIonChange={(str) => {
                    if (
                      str.detail.value === undefined ||
                      !str.target.value ||
                      str.target.value === ""
                    ) {
                      setSelectedAdminIsValid(false);
                    } else {
                      setSelectedAdmin(str.target.value! as address);
                      setSelectedAdminIsValid(true);
                    }
                  }}
                  helperText="Enter an address"
                  errorText="Address required"
                  className={`${selectedAdminIsValid && "ion-valid"} ${
                    selectedAdminIsValid === false && "ion-invalid"
                  } ${selectedAdminMarkTouched && "ion-touched"}`}
                  onIonBlur={() => setSelectedAdminMarkTouched(true)}
                />
              </IonCol>
              <IonCol>
                <IonButton
                  color="dark"
                  disabled={!selectedAdminIsValid}
                  onClick={addAdmin}
                >
                  <IonIcon icon={addCircleOutline} />
                  Add admin
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonTitle>

        {organization?.admins.map((admin) => (
          <IonItem key={admin}>
            {userProfiles.get(admin) ? (
              <UserProfileChip address={admin} userProfiles={userProfiles} />
            ) : (
              admin
            )}

            {organization.admins.length > 1 && !isTezosOrganization ? (
              <IonIcon
                onClick={(e) => removeAdmin(admin)}
                slot="end"
                color="white"
                icon={trashBinOutline}
              />
            ) : members.filter((u) => u !== admin).length > 0 ? (
              <>
                <IonButton id="passFlag" color="dark" slot="end">
                  <IonIcon
                    onClick={(e) => removeAdmin(admin)}
                    color="white"
                    icon={flagOutline}
                  />
                  Pass the flag
                </IonButton>

                <IonButton
                  color="danger"
                  slot="end"
                  onClick={(e) => removeOrganization(organization.name)}
                >
                  <IonIcon icon={trashOutline} />
                  Delete organization
                </IonButton>

                <IonModal trigger="passFlag" ref={modalPassFlag}>
                  <IonHeader>
                    <IonToolbar>
                      <IonButtons slot="start">
                        <IonButton
                          onClick={() => modalPassFlag.current?.dismiss()}
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
                          disabled={!selectedAdminIsValid}
                          onClick={() => removeAdmin(userAddress as address)}
                        >
                          <IonIcon slot="start" icon={flagOutline}></IonIcon>
                          Done
                        </IonButton>
                      </IonButtons>
                      <IonTitle> Pass Flag to another member</IonTitle>
                    </IonToolbar>
                  </IonHeader>
                  <IonContent color="light" class="ion-padding">
                    <IonSelect
                      interface="action-sheet"
                      labelPlacement="floating"
                      value={selectedAdmin}
                      label="New admin *"
                      onIonChange={(str) => {
                        if (
                          str.detail.value === undefined ||
                          !str.target.value ||
                          str.target.value === ""
                        ) {
                          setSelectedAdminIsValid(false);
                        } else {
                          setSelectedAdmin(str.target.value as address);
                          setSelectedAdminIsValid(true);
                        }
                      }}
                      className={`${selectedAdminIsValid && "ion-valid"} ${
                        selectedAdminIsValid === false && "ion-invalid"
                      } ion-touched `}
                    >
                      {members
                        .filter((member) => member != userAddress)
                        .map((member) => (
                          <IonSelectOption key={member} value={member}>
                            <UserProfileChip
                              address={member}
                              userProfiles={userProfiles}
                            />
                          </IonSelectOption>
                        ))}
                    </IonSelect>
                  </IonContent>
                </IonModal>
              </>
            ) : (
              ""
            )}
          </IonItem>
        ))}

        {!isTezosOrganization ? (
          <>
            {/* Members */}
            <hr color="danger" style={{ borderWidth: "1px", height: "0" }} />

            <IonList>
              <IonTitle>
                Members <IonBadge>{members ? members.length : 0}</IonBadge>
              </IonTitle>

              {members.map((member) => (
                <IonItem key={member}>
                  <UserProfileChip
                    address={member}
                    userProfiles={userProfiles}
                  />

                  <IonIcon
                    onClick={(e) => removeMember(member)}
                    slot="end"
                    color="white"
                    style={{
                      display:
                        organization &&
                        organization?.admins.indexOf(member) >= 0
                          ? "none"
                          : "block",
                    }}
                    icon={trashBinOutline}
                  />
                </IonItem>
              ))}
            </IonList>

            {/* Member Requests */}

            {!organization?.autoRegistration ? (
              <>
                <hr
                  color="danger"
                  style={{ borderWidth: "1px", height: "0" }}
                />

                <IonList>
                  <IonTitle>
                    <IonGrid fixed={true}>
                      <IonRow>
                        <IonCol>
                          {" "}
                          Member requests{" "}
                          <IonBadge>
                            {organization?.memberRequests
                              ? organization?.memberRequests.length
                              : 0}
                          </IonBadge>
                        </IonCol>

                        {organization?.memberRequests &&
                        organization?.memberRequests.length > 0 ? (
                          <>
                            <IonCol>
                              <IonButton
                                color="dark"
                                onClick={responseToJoinOrganization}
                              >
                                <IonIcon
                                  icon={checkmarkDoneCircleOutline}
                                  slot="end"
                                />
                                Apply all
                              </IonButton>

                              <IonIcon
                                id="hover-trigger"
                                icon={informationCircleOutline}
                              />
                              <IonPopover
                                trigger="hover-trigger"
                                triggerAction="hover"
                              >
                                <IonContent class="ion-padding">
                                  Accept{" "}
                                  <IonIcon icon={checkmarkCircleOutline} /> or
                                  Decline <IonIcon icon={removeCircleOutline} />{" "}
                                  below each requests and then click{" "}
                                  <b>
                                    Apply all{" "}
                                    <IonIcon
                                      icon={checkmarkDoneCircleOutline}
                                      slot="end"
                                    />
                                  </b>
                                </IonContent>
                              </IonPopover>
                            </IonCol>
                          </>
                        ) : (
                          ""
                        )}
                      </IonRow>
                    </IonGrid>
                  </IonTitle>

                  {organization?.memberRequests.map((memberRequest) => (
                    <IonCard key={memberRequest.user}>
                      <IonCardHeader>
                        <IonCardTitle>
                          <UserProfileChip
                            key={memberRequest.user}
                            userProfiles={userProfiles}
                            address={memberRequest.user}
                          ></UserProfileChip>
                        </IonCardTitle>

                        <IonToggle
                          enableOnOffLabels={true}
                          labelPlacement="end"
                          checked={
                            membersToApprove.indexOf(memberRequest.user) >= 0
                          }
                          aria-label="approve/reject"
                          onClick={(e) => {
                            if (e.currentTarget.checked) {
                              membersToApprove.push(memberRequest.user);
                              setMembersToApprove(membersToApprove);
                              setMembersToDecline(
                                membersToDecline.filter(
                                  (mtod) => mtod !== memberRequest.user
                                )
                              );
                            } else {
                              membersToDecline.push(memberRequest.user);
                              setMembersToDecline(membersToDecline);
                              let newMembersToApprove = membersToApprove.filter(
                                (mtoa) => mtoa !== memberRequest.user
                              );
                              setMembersToApprove(newMembersToApprove);
                            }
                          }}
                        ></IonToggle>
                      </IonCardHeader>
                      <IonCardContent>
                        {memberRequest.joinRequest.reason}
                      </IonCardContent>
                    </IonCard>
                  ))}
                </IonList>
              </>
            ) : (
              ""
            )}
          </>
        ) : (
          <>
            {/* Limits */}
            <hr color="danger" style={{ borderWidth: "1px", height: "0" }} />

            <IonList>
              <IonTitle>Limits</IonTitle>

              <IonInput
                labelPlacement="floating"
                color="primary"
                value={limits?.adminsMax.toNumber()}
                label="Admins Max *"
                type="number"
                min={1}
                max={100}
                onIonChange={(str) => {
                  if (
                    str.detail.value === undefined ||
                    !str.target.value ||
                    str.target.value === "" ||
                    str.target.value.toString().match("/[0-9]+/g")
                  ) {
                    setLimits({
                      ...limits,
                      adminsMax: new BigNumber(1) as nat,
                    }); //force
                  } else {
                    setLimits({
                      ...limits,
                      adminsMax: new BigNumber(str.target.value!) as nat,
                    }); //force
                  }
                }}
                helperText="Enter max admins"
              />

              <IonInput
                labelPlacement="floating"
                color="primary"
                value={limits?.organizationMax.toNumber()}
                label="Organizations Max *"
                type="number"
                min={1}
                max={100}
                onIonChange={(str) => {
                  if (
                    str.detail.value === undefined ||
                    !str.target.value ||
                    str.target.value === "" ||
                    str.target.value.toString().match("/[0-9]+/g")
                  ) {
                    setLimits({
                      ...limits,
                      organizationMax: new BigNumber(1) as nat,
                    }); //force
                  } else {
                    setLimits({
                      ...limits,
                      organizationMax: new BigNumber(str.target.value!) as nat,
                    }); //force
                  }
                }}
                helperText="Enter max organizations"
              />

              <IonInput
                labelPlacement="floating"
                color="primary"
                value={limits?.memberRequestMax.toNumber()}
                label="Member requests Max *"
                type="number"
                min={1}
                max={100}
                onIonChange={(str) => {
                  if (
                    str.detail.value === undefined ||
                    !str.target.value ||
                    str.target.value === "" ||
                    str.target.value.toString().match("/[0-9]+/g")
                  ) {
                    setLimits({
                      ...limits,
                      memberRequestMax: new BigNumber(1) as nat,
                    }); //force
                  } else {
                    setLimits({
                      ...limits,
                      memberRequestMax: new BigNumber(str.target.value!) as nat,
                    }); //force
                  }
                }}
                helperText="Enter max member requests"
              />

              <IonButton color="dark" onClick={updateLimits}>
                Update limits
              </IonButton>
            </IonList>

            {/* Organizations */}
            <hr color="danger" style={{ borderWidth: "1px", height: "0" }} />

            <IonList>
              <IonTitle>
                Organizations{" "}
                <IonBadge>
                  {storage?.organizations ? storage?.organizations.length : 0}
                </IonBadge>
              </IonTitle>

              {storage?.organizations.map((org: Organization) => (
                <IonItem key={org.name}>
                  {org.name}
                  <IonIcon
                    size="small"
                    slot="end"
                    icon={ellipse}
                    color={getStatusColor(org)}
                  />
                  {"frozen" in org.status || "pendingApproval" in org.status ? (
                    <IonIcon
                      onClick={(e) => activateOrganization(e, org.name)}
                      slot="end"
                      color="white"
                      icon={playCircleOutline}
                    />
                  ) : (
                    ""
                  )}

                  {"active" in org.status || "pendingApproval" in org.status ? (
                    <IonIcon
                      onClick={(e) => freezeOrganization(org.name)}
                      slot="end"
                      color="white"
                      icon={stopCircleOutline}
                    />
                  ) : (
                    ""
                  )}

                  <IonIcon
                    onClick={(e) => removeOrganization(org.name)}
                    slot="end"
                    color="white"
                    icon={trashOutline}
                  />
                </IonItem>
              ))}
            </IonList>
          </>
        )}
      </IonList>
    </IonContent>
  );
};
