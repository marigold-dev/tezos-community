import {
  IonButton,
  IonChip,
  IonContent,
  IonGrid,
  IonIcon,
  IonItem,
  IonList,
  IonRow,
  IonTextarea,
  useIonAlert,
} from "@ionic/react";
import * as api from "@tzkt/sdk-api";
import { BigNumber } from "bignumber.js";
import { mailOutline, returnUpBackOutline, timeOutline } from "ionicons/icons";
import React, { useEffect, useRef, useState } from "react";
import { UserContext, UserContextType } from "../App";
import { TransactionInvalidBeaconError } from "../TransactionInvalidBeaconError";
import { UserProfileChip } from "../components/UserProfileChip";
import { address, nat } from "../type-aliases";

type OrganizationProps = {
  organizationName: string | undefined;
};

export const OrganizationMessages = ({
  organizationName,
}: OrganizationProps): JSX.Element => {
  api.defaults.baseUrl =
    "https://api." + process.env.REACT_APP_NETWORK + ".tzkt.io";

  const [presentAlert] = useIonAlert();

  const {
    Tezos,
    wallet,
    userAddress,
    userBalance,
    userProfiles,
    storage,
    mainWalletType,
    setStorage,
    setUserAddress,
    setUserBalance,
    setLoading,
    loading,
    refreshStorage,
  } = React.useContext(UserContext) as UserContextType;

  const [contractEvents, setcontractEvents] = useState<
    (api.ContractEvent & { replies: api.ContractEvent[] | undefined })[]
  >([]);

  const contentRef = useRef<HTMLIonContentElement>(null);
  const textareaRef = useRef<HTMLIonTextareaElement>(null);

  const [message, setMessage] = useState<string>("");
  const [messageIsValid, setMessageIsValid] = useState<boolean>(false);
  const [messageMarkTouched, setMessageMarkTouched] = useState<boolean>(false);

  const [replyId, setReplyId] = useState<number | undefined>();
  const [replyUser, setReplyUser] = useState<address | undefined>();

  const fetchMessages = async () => {
    const contractEventReplies: (api.ContractEvent & {
      replies: api.ContractEvent[] | undefined;
    })[] = [];
    const contractEvents: api.ContractEvent[] =
      await api.eventsGetContractEvents({
        contract: { eq: process.env.REACT_APP_CONTRACT_ADDRESS! },
        tag: { eq: "message" },
        payload: { eq: { jsonValue: organizationName!, jsonPath: "string_0" } },
      });

    await Promise.all(
      contractEvents.map(async (ce) => {
        const replies = await api.eventsGetContractEvents({
          contract: { eq: process.env.REACT_APP_CONTRACT_ADDRESS! },
          tag: { eq: "reply" },
          payload: { eq: { jsonValue: ce.id + "", jsonPath: "nat" } },
        });
        contractEventReplies.push({ ...ce, replies });
      })
    );

    setcontractEvents(contractEventReplies);

    console.log("Events", contractEventReplies);
  };

  useEffect(() => {
    (async () => await fetchMessages())();
  }, [organizationName]);

  useEffect(() => {
    textareaRef.current!.disabled = true;
    setTimeout(() => {
      (async () => await fetchMessages())();
      contentRef.current?.scrollToBottom(500);
      textareaRef.current!.disabled = false;
      console.log("Refresh messages");
    }, 1000);
  }, []);

  const writeToOrganization = async () => {
    console.log("writeToOrganization");

    try {
      setLoading(true);

      const op = await mainWalletType!.methods
        .sendMessage(organizationName!, message)
        .send();

      await op.confirmation();
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

  const reply = async () => {
    console.log("reply");

    try {
      setLoading(true);

      const op = await mainWalletType!.methods
        .replyToMessage(
          new BigNumber(replyId!) as nat,
          replyUser! as string,
          message
        )
        .send();

      await op.confirmation();
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
    <IonContent className="ion-padding" style={{ height: "calc(100% - 56px)" }}>
      <IonContent ref={contentRef} style={{ height: "calc(100% - 142px)" }}>
        <IonList>
          {contractEvents.map((ev) => (
            <IonItem key={ev.id}>
              <IonGrid fixed>
                <IonRow>
                  <IonChip>
                    <IonIcon icon={timeOutline} style={{ margin: 0 }}></IonIcon>
                    {new Date(ev.timestamp!).toLocaleString()}
                  </IonChip>
                  <UserProfileChip
                    userProfiles={userProfiles}
                    address={ev.payload.address}
                  ></UserProfileChip>
                </IonRow>
                <IonRow>
                  <IonTextarea readonly>{ev.payload.string_1}</IonTextarea>
                  <IonButton
                    onClick={() => {
                      contentRef.current?.scrollToBottom(500);
                      setReplyId(ev.id);
                      setReplyUser(ev.payload.address);
                    }}
                    color="transparent"
                  >
                    <IonIcon slot="end" icon={returnUpBackOutline}></IonIcon>
                    Reply
                  </IonButton>
                </IonRow>
                {ev.replies && ev.replies.length > 0
                  ? ev.replies.map((reply) => (
                      <>
                        <IonRow style={{ opacity: "0.5", marginLeft: "5vw" }}>
                          <IonIcon icon={returnUpBackOutline}></IonIcon>
                          Reply
                        </IonRow>
                        <IonRow style={{ opacity: "0.5", marginLeft: "5vw" }}>
                          <IonChip>
                            <IonIcon
                              icon={timeOutline}
                              style={{ margin: 0 }}
                            ></IonIcon>
                            {new Date(reply.timestamp!).toLocaleString()}
                          </IonChip>
                          <UserProfileChip
                            userProfiles={userProfiles}
                            address={reply.payload.address}
                          ></UserProfileChip>
                        </IonRow>
                        <IonRow style={{ opacity: "0.5", marginLeft: "5vw" }}>
                          <IonTextarea readonly>
                            {reply.payload.string_1}
                          </IonTextarea>
                        </IonRow>
                      </>
                    ))
                  : ""}
              </IonGrid>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
      <hr color="danger" style={{ borderWidth: "1px", height: "0" }} />

      {!replyId ? (
        <IonItem style={{ position: "relative" }}>
          <IonTextarea
            ref={textareaRef}
            rows={3}
            labelPlacement="floating"
            color="primary"
            value={message}
            label="Message *   (ASCII characters only)"
            placeholder="Type here ..."
            maxlength={250}
            counter
            onIonChange={(str) => {
              let input = str.detail.value;
              //cleaning non ascii

              if (input === undefined || !input || input === "") {
                setMessageIsValid(false);
              } else {
                setMessage((input as string).replace(/[^\x00-\x7F]/g, ""));
                setMessageIsValid(true);
              }
            }}
            helperText="Enter a message"
            errorText="Message is required"
            className={`${messageIsValid && "ion-valid"} ${
              messageIsValid === false && "ion-invalid"
            } ${messageMarkTouched && "ion-touched"}`}
            onIonBlur={() => setMessageMarkTouched(true)}
          />
          <IonButton onClick={writeToOrganization} color="dark">
            <IonIcon slot="start" icon={mailOutline}></IonIcon>
            Send
          </IonButton>
        </IonItem>
      ) : (
        <IonItem style={{ position: "relative" }}>
          <IonTextarea
            ref={textareaRef}
            rows={3}
            labelPlacement="floating"
            color="primary"
            value={message}
            label="Reply *   (ASCII characters only)"
            placeholder="Type here ..."
            maxlength={250}
            counter
            onIonChange={(str) => {
              let input = str.detail.value;
              //cleaning non ascii

              if (input === undefined || !input || input === "") {
                setMessageIsValid(false);
              } else {
                setMessage((input as string).replace(/[^\x00-\x7F]/g, ""));
                setMessageIsValid(true);
              }
            }}
            helperText="Enter a message"
            errorText="Message is required"
            className={`${messageIsValid && "ion-valid"} ${
              messageIsValid === false && "ion-invalid"
            } ${messageMarkTouched && "ion-touched"}`}
            onIonBlur={() => setMessageMarkTouched(true)}
          />
          <IonButton onClick={reply} color="dark">
            <IonIcon slot="start" icon={returnUpBackOutline}></IonIcon>
            Reply
          </IonButton>
        </IonItem>
      )}
    </IonContent>
  );
};
