import { Browser } from "@capacitor/browser";
import { IonButton } from "@ionic/react";
import React, { useEffect } from "react";
import { LocalStorageKeys, UserContext, UserContextType } from "./App";
import { address } from "./type-aliases";
type OAuthProps = {
  provider: string;
};

export const OAuth = ({ provider }: OAuthProps): JSX.Element => {
  const {
    userAddress,
    setUserProfiles,
    userProfiles,
    setUserProfile,
    socket,
    localStorage,
  } = React.useContext(UserContext) as UserContextType;

  useEffect(() => {
    socket.on(provider, async (providerTokenAccess) => {
      console.log(
        "on " +
          provider +
          " , user is connected via " +
          providerTokenAccess +
          " , let's claim it now"
      );

      const accessToken = await localStorage.get(LocalStorageKeys.access_token);
      if (!accessToken) throw Error("You lost your SIWT accessToken");

      const response = await fetch(
        process.env.REACT_APP_BACKEND_URL + "/" + provider + "/claim",
        {
          method: "POST",
          headers: {
            authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ providerAccessToken: providerTokenAccess }),
        }
      );
      const up = await response.json();
      if (response.ok) {
        console.log("UserProfile registered on backend");
        setUserProfile(up);
        setUserProfiles(userProfiles.set(userAddress as address, up)); //update cache
      } else {
        console.log("ERROR : " + response.status);
      }

      await Browser.close();
    });
  }, []);

  const openPopup = async () => {
    const url = `${process.env.REACT_APP_BACKEND_URL}/${provider}?socketId=${socket.id}`;
    await Browser.open({
      url,
      windowName: provider,
      presentationStyle: "fullscreen",
    });
  };

  return (
    <IonButton
      id={"open-" + provider}
      size="large"
      color="warning"
      onClick={openPopup}
    >
      {provider}
    </IonButton>
  );
};
