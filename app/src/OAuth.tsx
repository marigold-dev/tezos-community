import { IonButton } from "@ionic/react";
import React, { useEffect, useState } from "react";
import { UserContext, UserContextType } from "./App";
import { UserProfileChip } from "./components/UserProfileChip";
import { address } from "./type-aliases";

type OAuthProps = {
  provider: string;
};

export const OAuth = ({ provider }: OAuthProps): JSX.Element => {
  const { userAddress, userProfiles, setUserProfiles, refreshStorage, socket } =
    React.useContext(UserContext) as UserContextType;

  const [user, setUser] = useState<any>(null);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [popup, setPopup] = useState<any>();

  useEffect(() => {
    socket.on(provider, (user) => {
      //popup.close();
      setUser(user);
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

  const closeCard = () => {
    setUser(null);
  };

  return (
    <div>
      {user ? (
        <div>
          <img src={user.photo} />
          <IonButton onClick={closeCard}>Close card</IonButton>
          <UserProfileChip
            address={userAddress as address}
            userProfiles={userProfiles}
          ></UserProfileChip>
        </div>
      ) : (
        <div>
          <IonButton color="transparent" disabled onClick={startAuth}>
            {provider}
          </IonButton>
        </div>
      )}
    </div>
  );
};
