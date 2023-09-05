import { IonAvatar, IonChip, IonImg, IonLabel } from "@ionic/react";
import { UserProfile } from "../App";
import { address } from "../type-aliases";
type UserProfileChipProps = {
  userProfiles: Map<address, UserProfile>;
  address: address;
};

export const UserProfileChip = ({
  userProfiles,
  address,
}: UserProfileChipProps) => {
  return (
    <>
      {userProfiles.get(address) ? (
        <IonChip>
          <IonAvatar>
            <img
              alt="o"
              style={{ objectFit: "contain", padding: "0.2em" }}
              src={userProfiles.get(address)?.photo}
            />
          </IonAvatar>
          <IonLabel>
            {userProfiles.get(address)?.displayName +
              " (" +
              userProfiles.get(address)?.socialAccountAlias +
              ") "}
          </IonLabel>
          <IonAvatar>
            <IonImg
              alt="social network"
              style={{ objectFit: "contain", padding: "0.2em" }}
              src={
                "/assets/" +
                userProfiles.get(address)?.socialAccountType +
                ".png"
              }
            />
          </IonAvatar>
        </IonChip>
      ) : (
        <IonChip>{address}</IonChip>
      )}
    </>
  );
};
