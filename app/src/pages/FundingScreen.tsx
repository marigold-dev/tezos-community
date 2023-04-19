import {
  IonContent,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonPage,
  IonSkeletonText,
  IonThumbnail,
} from "@ionic/react";
import React, { useEffect } from "react";
import { UserContext, UserContextType } from "../App";
import { Footer } from "../Footer";
import { Header } from "../Header";

export const FundingScreen: React.FC = () => {
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
    refreshStorage,
  } = React.useContext(UserContext) as UserContextType;

  useEffect(() => {
    (async () => await refreshStorage())();
  }, [wallet]);

  return (
    <IonPage className="container">
      <Header />

      <IonContent>
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
      <Footer />
    </IonPage>
  );
};
