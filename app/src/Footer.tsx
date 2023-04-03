import { NetworkType } from "@airgap/beacon-types";
import { IonButton, IonFooter, IonToolbar, useIonAlert } from "@ionic/react";
import React from "react";
import { PAGES, UserContext, UserContextType } from "./App";

import { useHistory } from "react-router-dom";
import { TransactionInvalidBeaconError } from "./TransactionInvalidBeaconError";

export const Footer: React.FC = () => {
  const history = useHistory();
  const [presentAlert] = useIonAlert();

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

  const connectWallet = async (): Promise<void> => {
    try {
      console.log("before requestPermissions");

      await wallet.requestPermissions({
        network: {
          type: NetworkType.GHOSTNET,
          rpcUrl: "https://ghostnet.tezos.marigold.dev",
        },
      });
      console.log("after requestPermissions");

      // gets user's address
      const userAddress = await wallet.getPKH();
      const balance = await Tezos.tz.getBalance(userAddress);
      setUserBalance(balance.toNumber());
      setUserAddress(userAddress);
      await refreshStorage();
    } catch (error) {
      console.log("error connectWallet", error);
    }
  };

  const disconnectWallet = async (): Promise<void> => {
    setUserAddress("");
    setUserBalance(0);
    console.log("disconnecting wallet");
    await wallet.clearActiveAccount();

    history.replace(PAGES.ORGANIZATIONS);
  };

  const addOrganization = async (
    e: React.MouseEvent<HTMLIonButtonElement, MouseEvent>,
    business: string,
    name: string
  ) => {
    console.log("addOrganization");
    e.preventDefault();

    try {
      setLoading(true);
      const op = await mainWalletType!.methods
        .addOrganization(business, name)
        .send();
      await op?.confirmation();
      const newStorage = await mainWalletType!.storage();
      setStorage(newStorage);
      setLoading(false);
      history.push(PAGES.ORGANIZATION + "/" + name); //it was the id created
      console.log("newStorage", newStorage);
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

  return (
    <IonFooter>
      <IonToolbar>
        {userAddress ? (
          <>
            <IonButton color="primary" routerLink={PAGES.ORGANIZATIONS}>
              {PAGES.ORGANIZATIONS}
            </IonButton>

            <IonButton>Join</IonButton>

            <IonButton>Add</IonButton>

            <IonButton color="primary" routerLink={PAGES.FUNDING}>
              {PAGES.FUNDING}
            </IonButton>

            <IonButton onClick={disconnectWallet}>logOut</IonButton>
          </>
        ) : (
          <IonButton onClick={connectWallet}>Connect your wallet</IonButton>
        )}
      </IonToolbar>
    </IonFooter>
  );
};
