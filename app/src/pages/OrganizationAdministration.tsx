import { IonContent } from "@ionic/react";
import { Organization } from "../App";

type OrganizationProps = {
  organization: Organization | undefined;
};

enum TABS {
  DESCRIPTION,
  MESSAGES,
  ADMINISTRATION,
}

export const OrganizationAdministration = ({
  organization,
}: OrganizationProps): JSX.Element => {
  return <IonContent className="ion-padding">{organization?.name}</IonContent>;
};
