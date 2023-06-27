import {
  IonAccordion,
  IonAccordionGroup,
  IonContent,
  IonItem,
  IonLabel,
  IonPage,
  IonRefresher,
  IonRefresherContent,
} from "@ionic/react";
import React, { useEffect } from "react";
import { useHistory, useLocation, useRouteMatch } from "react-router";
import { UserContext, UserContextType } from "../App";
import { Footer } from "../Footer";
import { Header } from "../Header";

export const FAQScreen: React.FC = () => {
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

  const history = useHistory();
  const location = useLocation();
  const match = useRouteMatch();

  useEffect(() => {
    (async () => await refreshStorage())();
  }, [wallet]);

  return (
    <IonPage className="container">
      <Header history={history} location={location} match={match} />
      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={refreshStorage}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <IonAccordionGroup>
          <IonAccordion>
            <IonItem slot="header" color="light">
              <IonLabel>What is TzCommunity?</IonLabel>
            </IonItem>
            <div className="ion-padding ion-text-justify" slot="content">
              TzCommunity objective is a <b>PSEUDONYM SOCIAL GRAPH</b> as a tool
              to remove community pain points :
              <ul>
                <li>
                  lack of ecosystem global registry. We ease newcomers to find
                  or build communities, also helping dapp developers to reach a
                  pseudonym user database and improve UX
                </li>
                <li>
                  priorize important messages while keeping away trollers. We
                  don't want to replace existing web2 messaging platform or
                  forums, we enforce proof of alerts onchain delivery
                </li>
                <li>
                  be the entrypoint for funding ecosystem projects. We redirect
                  investors or founders to existing Tezos funding platforms :
                  TzSafe, Homebase, etc ...
                </li>
                <li>more ideas to come depending on future feedbacks</li>
              </ul>
            </div>
          </IonAccordion>
          <IonAccordion>
            <IonItem slot="header" color="light">
              <IonLabel>What is an organization?</IonLabel>
            </IonItem>
            <div className="ion-padding ion-text-justify" slot="content">
              Any group of people managed by a set of administrators.
              Organizations are totally autonomous to manage its members and
              branding via NFT membership card. It can be :
              <ul>
                <li>
                  permanent : long living organization like core teams, or
                  industry groups like Art
                </li>
                <li>ephemeral : for a specific meetup, etc ...</li>
              </ul>
            </div>
          </IonAccordion>
          <IonAccordion>
            <IonItem slot="header" color="light">
              <IonLabel>Who can create an organization?</IonLabel>
            </IonItem>
            <div className="ion-padding ion-text-justify" slot="content">
              Anyone, just click on <b>CREATE AN ORGANIZATION</b> and fill the
              form. Super administrators composed by core team members needs to
              approve the creation but don't have any way to control the
              organization from the inside
            </div>
          </IonAccordion>

          <IonAccordion>
            <IonItem slot="header" color="light">
              <IonLabel>What is the Funding address?</IonLabel>
            </IonItem>
            <div className="ion-padding ion-text-justify" slot="content">
              tz1 or KT1 address that is used to send funds to the organization.
              (Ex : You can point to Homebase Dao contracts or TzSafe multisig
              contracts)
            </div>
          </IonAccordion>

          <IonAccordion>
            <IonItem slot="header" color="light">
              <IonLabel>What is IPFS NFT url used for?</IonLabel>
            </IonItem>
            <div className="ion-padding ion-text-justify" slot="content">
              The feature will be activated later to allow each organization
              member to own an NFT from any organization he belongs too. You can
              see this as a conference ticket proof for example
            </div>
          </IonAccordion>

          <IonAccordion>
            <IonItem slot="header" color="light">
              <IonLabel>How many members can an organization host?</IonLabel>
            </IonItem>
            <div className="ion-padding ion-text-justify" slot="content">
              Unlimited
            </div>
          </IonAccordion>

          <IonAccordion>
            <IonItem slot="header" color="light">
              <IonLabel>Who can be an administrator?</IonLabel>
            </IonItem>
            <div className="ion-padding ion-text-justify" slot="content">
              Anyone who creates an organization or is invited by an
              organization administrator
            </div>
          </IonAccordion>

          <IonAccordion>
            <IonItem slot="header" color="light">
              <IonLabel>How many organizations can I create?</IonLabel>
            </IonItem>
            <div className="ion-padding ion-text-justify" slot="content">
              Unlimited by user. There is a global default maximum set to 100
            </div>
          </IonAccordion>

          <IonAccordion>
            <IonItem slot="header" color="light">
              <IonLabel>How to see an organization’s activity?</IonLabel>
            </IonItem>
            <div className="ion-padding ion-text-justify" slot="content">
              Only activity you can see is (if are part of this organization)
              the organization messages received. You don't have access to
              internal organization member social links for example
            </div>
          </IonAccordion>

          <IonAccordion>
            <IonItem slot="header" color="light">
              <IonLabel>How to write a message to an organization?</IonLabel>
            </IonItem>
            <div className="ion-padding ion-text-justify" slot="content">
              Click on <b>WRITE TO AN ORGANIZATION</b> and fill the form. The
              message will be sent to an organization and appear on their{" "}
              <i>message wall</i>. A coming feature will also post a message for
              each member on their social account link (if they did the social
              account link only)
            </div>
          </IonAccordion>

          <IonAccordion>
            <IonItem slot="header" color="light">
              <IonLabel>How do I join an organization?</IonLabel>
            </IonItem>
            <div className="ion-padding ion-text-justify" slot="content">
              Click on <b>JOIN AN ORGANIZATION</b> and fill the form. The
              administrators will receive a notification and can approve or deny
              you. For organization with auto-registration, no need to wait for
              an approval.
            </div>
          </IonAccordion>

          <IonAccordion>
            <IonItem slot="header" color="light">
              <IonLabel>Why the dapp is mobile oriented?</IonLabel>
            </IonItem>
            <div className="ion-padding ion-text-justify" slot="content">
              The next effort will be on building this dapp for mobile and run
              as background app. Except if you are organization active
              administrator, this application is more oriented to be a
              configuration and notification center tool like and a Tezos global
              LDAP
            </div>
          </IonAccordion>
        </IonAccordionGroup>
      </IonContent>
      <Footer />
    </IonPage>
  );
};
