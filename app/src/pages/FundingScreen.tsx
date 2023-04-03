import { IonContent, IonPage } from "@ionic/react";
import React from "react";
import { Footer } from "../Footer";
import { Header } from "../Header";

export const FundingScreen: React.FC = () => {
  return (
    <IonPage className="container">
      <Header />

      <IonContent />
      <Footer />
    </IonPage>
  );
};
