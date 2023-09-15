import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { IonAvatar, IonChip, IonImg, IonLabel } from "@ionic/react";
import { SOCIAL_ACCOUNT_TYPE } from "@marigold-dev/tezos-community/dist/TzCommunityUtils";
import { useEffect, useState } from "react";
import github from "./github.png.txt";
import gitlab from "./gitlab.png.txt";
import google from "./google.png.txt";
import slack from "./slack.png.txt";
import twitter from "./twitter.png.txt";
export const TzCommunityIonicUserProfileChip = ({ userProfiles, address, color, style, }) => {
    const [googleRawBase64, setGoogleRawBase64] = useState();
    const [githubRawBase64, setGithubRawBase64] = useState();
    const [gitlabRawBase64, setGitlabRawBase64] = useState();
    const [slackRawBase64, setSlackRawBase64] = useState();
    const [twitterRawBase64, setTwitterRawBase64] = useState();
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
    return (_jsx(_Fragment, { children: userProfiles.get(address) ? (_jsxs(IonChip, { color: color, style: style, children: [_jsx(IonAvatar, { children: _jsx(IonImg, { alt: "o", style: { objectFit: "contain", padding: "0.2em" }, src: userProfiles.get(address)?.photo }) }), _jsx(IonLabel, { children: userProfiles.get(address)?.displayName +
                        " (" +
                        userProfiles.get(address)?.socialAccountAlias +
                        ") " }), _jsx(IonAvatar, { children: _jsx(IonImg, { alt: "social network", style: { objectFit: "contain", padding: "0.2em" }, src: userProfiles.get(address)?.socialAccountType ===
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
                                            : "http://www.google.com/images/errors/robot.png" }) })] })) : (_jsx(IonChip, { color: color, style: style, className: "address", children: address })) }));
};
