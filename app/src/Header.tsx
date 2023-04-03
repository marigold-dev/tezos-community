import { IonHeader, IonTitle, IonToolbar } from "@ionic/react";
import React from "react";
import { UserContext, UserContextType } from "./App";

export const Header: React.FC = () => {
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

  return (
    <IonHeader>
      <IonToolbar>
        <IonTitle>
          {userAddress ? "TzCommunity - " + userAddress : "TzCommunity"}
        </IonTitle>
      </IonToolbar>
    </IonHeader>
  );
};
