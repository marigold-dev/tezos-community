import { IonContent, IonPage } from "@ionic/react";
import React from "react";
import { Footer } from "../Footer";

export const OrganizationScreen: React.FC = () => {
  return (
    <IonPage className="container">
      <IonContent />
      <Footer />
    </IonPage>
  );
};
