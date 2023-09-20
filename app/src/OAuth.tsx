import { Browser } from "@capacitor/browser";
import { IonAvatar, IonChip, IonLabel } from "@ionic/react";
import { LocalStorageKeys } from "@marigold-dev/tezos-community";
import {
  TzCommunityReactContext,
  TzCommunityReactContextType,
} from "@marigold-dev/tezos-community-reactcontext";
import React, { useEffect } from "react";
import { useHistory } from "react-router";
import { PAGES, UserContext, UserContextType } from "./App";
import { address } from "./type-aliases";

type OAuthProps = {
  provider: string;
};

export const OAuth = ({ provider }: OAuthProps): JSX.Element => {
  const {
    userAddress,

    socket,
    disconnectWallet,
  } = React.useContext(UserContext) as UserContextType;

  const { setUserProfile, localStorage, setUserProfiles, userProfiles } =
    React.useContext(TzCommunityReactContext) as TzCommunityReactContextType;

  const history = useHistory();

  useEffect(() => {
    console.log("Configuring socket events for ", provider);

    if (socket) {
      socket.removeListener(provider);
      socket.on(provider, async (providerTokenAccess) => {
        console.log(
          "on " +
            provider +
            " , user is connected via " +
            providerTokenAccess +
            " , let's claim it now"
        );

        const accessToken = await localStorage.get(
          LocalStorageKeys.access_token
        );
        if (!accessToken) {
          console.warn("You lost your SIWT accessToken");
          await disconnectWallet();
          history.push(PAGES.ORGANIZATIONS);
        }

        const response = await fetch(
          import.meta.env.VITE_TZCOMMUNITY_BACKEND_URL +
            "/" +
            provider +
            "/claim",
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
          console.log("UserProfile registered on backend", up);
          setUserProfile(up!);

          //  console.log("OAUTH CALLING setUserProfiles", userProfiles);
          setUserProfiles(userProfiles.set(userAddress as address, up!)); //update cache
        } else {
          console.log("ERROR : " + response.status);
        }

        await Browser.close();
      });
    }
  }, [socket]);

  const openPopup = async () => {
    const url = `${
      import.meta.env.VITE_TZCOMMUNITY_BACKEND_URL
    }/${provider}?socketId=${socket!.id}`;
    await Browser.open({
      url,
      windowName: provider,
      presentationStyle: "fullscreen",
    });
  };

  return (
    <IonChip id={"open-" + provider} color="warning" onClick={openPopup}>
      <IonAvatar>
        <img alt="." src={"/assets/" + provider + ".png"} />
      </IonAvatar>
      <IonLabel> {provider}</IonLabel>
    </IonChip>
  );
};
