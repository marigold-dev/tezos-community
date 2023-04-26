import {
  IonBadge,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonIcon,
  IonItem,
  IonTitle,
  IonToggle,
  useIonAlert,
} from "@ionic/react";
import {
  checkmarkDoneCircleOutline,
  ellipse,
  playCircleOutline,
  stopCircleOutline,
  trashBinOutline,
  trashOutline,
} from "ionicons/icons";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Organization, UserContext, UserContextType } from "../App";
import { TransactionInvalidBeaconError } from "../TransactionInvalidBeaconError";
import { getStatusColor } from "../Utils";
import { UserProfileChip } from "../components/UserProfileChip";
import { address } from "../type-aliases";

type OrganizationProps = {
  organization: Organization | undefined;
  setOrganization: Dispatch<SetStateAction<Organization | undefined>>;
  members: address[];
};

export const OrganizationAdministration = ({
  organization,
  setOrganization,
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

  const [membersToApprove, setMembersToApprove] = useState<address[]>([]);
  const [membersToDecline, setMembersToDecline] = useState<address[]>([]);

  const responseToJoinOrganization = async (
    e: React.MouseEvent<HTMLIonIconElement, MouseEvent>
  ) => {
    console.log("responseToJoinOrganization");
    e.preventDefault();

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
        .removeMember(member, organization!.name, undefined) //FIXME workaround not working
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

  useEffect(() => {
    setMembersToApprove(
      organization?.memberRequests
        ? organization?.memberRequests.map((mr) => mr.user)
        : []
    );
    setMembersToDecline([]);
  }, [organization, storage, userAddress]);

  useEffect(() => {
    //need to refresh in case of storage changes
    if (organization) {
      const org = storage?.organizations.find(
        (orgItem) => orgItem.name === organization.name
      );
      if (org) setOrganization(org);
    }
  }, [storage, userAddress]);

  return (
    <IonContent className="ion-padding">
      <IonItem>
        <IonTitle>Administrators</IonTitle>
        <IonBadge>
          {organization?.admins ? organization?.admins.length : 0}
        </IonBadge>
      </IonItem>

      {organization?.admins.map((admin) => (
        <IonItem key={admin}>
          {userProfiles.get(admin) ? (
            <UserProfileChip address={admin} userProfiles={userProfiles} />
          ) : (
            admin
          )}
        </IonItem>
      ))}

      {organization?.name !== storage?.tezosOrganization.name ? (
        <>
          <IonItem>
            <IonTitle>Members</IonTitle>
            <IonBadge>{members ? members.length : 0}</IonBadge>
          </IonItem>
          {members.map((member) => (
            <IonItem key={member}>
              <UserProfileChip address={member} userProfiles={userProfiles} />

              <IonIcon
                onClick={(e) => removeMember(member)}
                slot="end"
                color="white"
                icon={trashBinOutline}
              />
            </IonItem>
          ))}

          <IonItem>
            <IonTitle>Member requests</IonTitle>
            <IonBadge>
              {organization?.memberRequests
                ? organization?.memberRequests.length
                : 0}
            </IonBadge>

            {organization?.memberRequests &&
            organization?.memberRequests.length > 0 ? (
              <IonIcon
                onClick={(e) => responseToJoinOrganization(e)}
                slot="end"
                color="white"
                icon={checkmarkDoneCircleOutline}
              />
            ) : (
              ""
            )}
          </IonItem>
          {organization?.memberRequests.map((memberRequest) => (
            <IonCard key={memberRequest.user}>
              <IonCardHeader>
                <IonCardTitle>{memberRequest.user}</IonCardTitle>
                <IonCardSubtitle>
                  {memberRequest.joinRequest.contactIdProvider +
                    " - " +
                    memberRequest.joinRequest.contactId}
                </IonCardSubtitle>
                <IonToggle
                  labelPlacement="end"
                  checked={membersToApprove.indexOf(memberRequest.user) >= 0}
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
                />
              </IonCardHeader>
              <IonCardContent>
                {memberRequest.joinRequest.reason}
              </IonCardContent>
            </IonCard>
          ))}
        </>
      ) : (
        <>
          <IonItem>
            <h1>Organizations</h1>
          </IonItem>
          {storage?.organizations.map((org) => (
            <IonItem key={org.name}>
              {org.name}
              <IonIcon
                size="small"
                slot="end"
                icon={ellipse}
                color={getStatusColor(org)}
              />
              {"fROZEN" in org.status || "pENDING_APPROVAL" in org.status ? (
                <IonIcon
                  onClick={(e) => activateOrganization(e, org.name)}
                  slot="end"
                  color="white"
                  icon={playCircleOutline}
                />
              ) : (
                ""
              )}

              {"aCTIVE" in org.status || "pENDING_APPROVAL" in org.status ? (
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
        </>
      )}
    </IonContent>
  );
};
