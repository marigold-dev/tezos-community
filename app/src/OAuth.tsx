import { IonButton } from "@ionic/react";
import React, { useEffect, useState } from "react";
import { UserContext, UserContextType } from "./App";
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

  const [disabled, setDisabled] = useState<boolean>(false);
  const [popup, setPopup] = useState<any>();

  useEffect(() => {
    socket.on(provider, async (providerTokenAccess) => {
      console.log(
        "on " +
          provider +
          " , user is connected via " +
          providerTokenAccess +
          " , let's claim it now"
      );

      const accessToken = (await localStorage.get("access_token"))!;

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

      //FIXME popup.close();
    });
  }, []);

  const checkPopup = () => {
    const check = setInterval(() => {
      if (!popup || popup.closed || popup.closed === undefined) {
        clearInterval(check);
        setDisabled(false);
      }
    }, 1000);
  };

  const openPopup = () => {
    const width = 600,
      height = 600;
    const left = window.innerWidth / 2 - width / 2;
    const top = window.innerHeight / 2 - height / 2;
    const url = `${process.env.REACT_APP_BACKEND_URL}/${provider}?socketId=${socket.id}`;

    return window.open(
      url,
      "",
      `toolbar=no, location=no, directories=no, status=no, menubar=no, 
      scrollbars=no, resizable=no, copyhistory=no, width=${width}, 
      height=${height}, top=${top}, left=${left}`
    );
  };

  const startAuth = () => {
    if (!disabled) {
      setPopup(openPopup());
      checkPopup();
      setDisabled(true);
    }
  };

  return (
    <IonButton color="transparent" onClick={startAuth}>
      {provider}
    </IonButton>
  );
};
