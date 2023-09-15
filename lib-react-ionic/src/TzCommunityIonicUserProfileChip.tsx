import { IonAvatar, IonChip, IonImg, IonLabel } from "@ionic/react";
import { address } from "@marigold-dev/tezos-community/dist/type-aliases";
import { SOCIAL_ACCOUNT_TYPE } from "@marigold-dev/tezos-community/dist/TzCommunityUtils";

import { CSSProperties, useEffect, useState } from "react";

import { UserProfile } from "@marigold-dev/tezos-community";
import github from "./github.png.txt";
import gitlab from "./gitlab.png.txt";
import google from "./google.png.txt";
import slack from "./slack.png.txt";
import twitter from "./twitter.png.txt";

type TzCommunityIonicUserProfileChipProps = {
  userProfiles: Map<address, UserProfile>;
  address: address;
  color?: string;
  style?: CSSProperties;
};

export const TzCommunityIonicUserProfileChip = ({
  userProfiles,
  address,
  color,
  style,
}: TzCommunityIonicUserProfileChipProps) => {
  const [googleRawBase64, setGoogleRawBase64] = useState<string>();
  const [githubRawBase64, setGithubRawBase64] = useState<string>();
  const [gitlabRawBase64, setGitlabRawBase64] = useState<string>();
  const [slackRawBase64, setSlackRawBase64] = useState<string>();
  const [twitterRawBase64, setTwitterRawBase64] = useState<string>();

  useEffect(() => {
    (async () => {
      let r = await fetch(google);
      let rawBase64 = await r.text();
      setGoogleRawBase64(rawBase64);

      r = await fetch(github);
      rawBase64 = await r.text();
      setGithubRawBase64(rawBase64);

      r = await fetch(gitlab);
      rawBase64 = await r.text();
      setGitlabRawBase64(rawBase64);

      r = await fetch(slack);
      rawBase64 = await r.text();
      setSlackRawBase64(rawBase64);

      r = await fetch(twitter);
      rawBase64 = await r.text();
      setTwitterRawBase64(rawBase64);
    })();
  }, []);

  return (
    <>
      {userProfiles.get(address) ? (
        <IonChip color={color} style={style}>
          <IonAvatar>
            <IonImg
              alt="o"
              style={{ objectFit: "contain", padding: "0.2em" }}
              src={userProfiles.get(address)?.photo}
            />
          </IonAvatar>
          <IonLabel>
            {userProfiles.get(address)?.displayName +
              " (" +
              userProfiles.get(address)?.socialAccountAlias +
              ") "}
          </IonLabel>
          <IonAvatar>
            <IonImg
              alt="social network"
              style={{ objectFit: "contain", padding: "0.2em" }}
              src={
                userProfiles.get(address)?.socialAccountType ===
                SOCIAL_ACCOUNT_TYPE.google
                  ? googleRawBase64
                  : userProfiles.get(address)?.socialAccountType ===
                    SOCIAL_ACCOUNT_TYPE.github
                  ? githubRawBase64
                  : userProfiles.get(address)?.socialAccountType ===
                    SOCIAL_ACCOUNT_TYPE.gitlab
                  ? gitlabRawBase64
                  : userProfiles.get(address)?.socialAccountType ===
                    SOCIAL_ACCOUNT_TYPE.slack
                  ? slackRawBase64
                  : userProfiles.get(address)?.socialAccountType ===
                    SOCIAL_ACCOUNT_TYPE.twitter
                  ? twitterRawBase64
                  : "http://www.google.com/images/errors/robot.png"
              }
            />
          </IonAvatar>
        </IonChip>
      ) : (
        <IonChip color={color} style={style} className="address">
          {address}
        </IonChip>
      )}
    </>
  );
};
