import { IonHeader, IonTitle, IonToolbar } from "@ionic/react";
import React from "react";
import { RouteComponentProps } from "react-router";
import packageJson from "../package.json";
import { UserContext, UserContextType } from "./App";

interface Props extends RouteComponentProps {}

export const Header: React.FC<Props> = ({ match }) => {
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
          {!userAddress
            ? "TzCommunity (version " + packageJson.version + ")"
            : match.path.replaceAll("/", "").charAt(0).toUpperCase() +
              match.path.replaceAll("/", "").slice(1)}
        </IonTitle>
      </IonToolbar>
    </IonHeader>
  );
};
