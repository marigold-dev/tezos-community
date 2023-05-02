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
      {userProfiles.get(address) && userProfiles.get(address)?.verified ? (
        <IonChip>
          <IonAvatar>
            <IonImg
              alt="social network"
              style={{ objectFit: "contain", padding: "0.2em" }}
              src={
                process.env.PUBLIC_URL +
                "/assets/" +
                userProfiles.get(address)?.socialAccountType +
                ".png"
              }
            />
          </IonAvatar>
          <IonLabel>
            {userProfiles.get(address)?.displayName +
              " (" +
              userProfiles.get(address)?.socialAccountAlias +
              ") "}
          </IonLabel>
        </IonChip>
      ) : (
        address
      )}
    </>
  );
};
