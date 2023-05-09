import {
  IonContent,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonSkeletonText,
  IonThumbnail,
} from "@ionic/react";

type OrganizationProps = {
  organizationName: string | undefined;
};

export const OrganizationMessages = ({
  organizationName,
}: OrganizationProps): JSX.Element => {
  return (
    <IonContent className="ion-padding">
      <IonList>
        <IonListHeader>
          <IonSkeletonText
            animated={true}
            style={{ "width": "80px" }}
          ></IonSkeletonText>
        </IonListHeader>
        <IonItem>
          <IonThumbnail slot="start">
            <IonSkeletonText animated={true}></IonSkeletonText>
          </IonThumbnail>
          <IonLabel>
            <h3>
              <IonSkeletonText
                animated={true}
                style={{ "width": "80%" }}
              ></IonSkeletonText>
            </h3>
            <p>
              <IonSkeletonText
                animated={true}
                style={{ "width": "60%" }}
              ></IonSkeletonText>
            </p>
            <p>
              <IonSkeletonText
                animated={true}
                style={{ "width": "30%" }}
              ></IonSkeletonText>
            </p>
          </IonLabel>
        </IonItem>
      </IonList>
    </IonContent>
  );
};
