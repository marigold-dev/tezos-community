# Install

Depending of your dapp technology, you can import 1,2 or the 3 libraries

```bash
npm i @marigold-dev/tezos-community
npm i @marigold-dev/tezos-community-reactcontext
npm i @marigold-dev/tezos-community-reactcontext-ionic
```

Here below is described the full solution for Ionic React.

> You can start with the base library and adapt the code for an Angular context or Ionic Angular with no problem. If requested we could publish libraries for other web frameworks

## Set environment variables

Library will search for 2 variables :

- VITE_TZCOMMUNITY_CONTRACT_ADDRESS : the TzCommunity deployed smartcontract
- VITE_TZCOMMUNITY_BACKEND_URL :the TzCommunity backend API url

Ghostnet

```env
VITE_TZCOMMUNITY_CONTRACT_ADDRESS=KT1KpqE5kfor9fmoDTNMAjoKeLpKRv4ooEZw
VITE_TZCOMMUNITY_BACKEND_URL=https://back.tezos-community.gcp-npr.marigold.dev
```

Mainnet

```env
VITE_TZCOMMUNITY_CONTRACT_ADDRESS=KT1D95aUDDfCQnh1Ay7riNaTDaWwX63dGY6X
VITE_TZCOMMUNITY_BACKEND_URL=https://back.tezos-community.gcp.marigold.dev
```

> These values might possibly change in the future, to be sure to use the correct configuation, contact [Marigold Team](mailto:support@marigold.dev)

## Connect / Disconnect to TzCommunity backend

> TzCommunity uses [SIWT](https://siwt.xyz/) to authentify to a web2 backend with your wallet
> TzCommunity overrides default web local storage with Ionic one : `import { Storage as LocalStorage } from "@ionic/storage";` . this way it works both for web and Ionic mobile app on native devices

### Connect and fetch your own user Profile

Import libs

```typescript
import {
  TzCommunityReactContext,
  TzCommunityReactContextType,
} from "@marigold-dev/tezos-community-reactcontext";
import { address } from "../type-aliases";
import { getUserProfile } from "@marigold-dev/tezos-community";
```

Import the React context

```typescript
const {
  setUserProfile,
  connectToWeb2Backend,
  localStorage,
  setUserProfiles,
  userProfiles,
} = React.useContext(TzCommunityReactContext) as TzCommunityReactContextType;
```

Connect to TzCommunity backend just after your logged with your wallet on Beacon. You can use `setUserProfile` to set your profile to a global context like below

```typescript
const connectWallet = async (): Promise<void> => {

    ...

    try {
      await wallet.requestPermissions({
        network: {
          type: NetworkType[
            import.meta.env.VITE_NETWORK.toUpperCase() as keyof typeof NetworkType
          ],
          rpcUrl: import.meta.env.VITE_TEZOS_NODE,
        },
      });
      // gets user's address
      const userAddress = await wallet.getPKH();
      await setup(userAddress);

      //connect to TzCommunity
      await connectToWeb2Backend(
        wallet,
        userAddress,
        (
          await wallet.client.getActiveAccount()
        )?.publicKey!,
        localStorage
      );

      //try to load your user profile
      try {
        const newUserProfile = await getUserProfile(userAddress, localStorage);
        setUserProfile(newUserProfile!);

        setUserProfiles(
          userProfiles.set(userAddress as address, newUserProfile!)
        );
      } catch (error) {
        console.warn(
          "User " +
            userAddress +
            " has no social account profile link on TzCommunity"
        );
      }

```

### Disconnect

On your disconnect function, remove SIWT tokens from local storage

```typescript
  const disconnectWallet = async (): Promise<void> => {

    //TzCommunity
    if (localStorage.initialized) {
      console.log("localStorage is initialized, removing access tokens");
      await localStorage.remove(LocalStorageKeys.access_token); //remove SIWT tokens
      await localStorage.remove(LocalStorageKeys.id_token); //remove SIWT tokens
      await localStorage.remove(LocalStorageKeys.refresh_token); //remove SIWT tokens
    } else {
      console.warn("localStorage not initialized, cannot remove access tokens");
    }
    //End TzCommunity
```

## On App.tsx, Load user profiles, and cache results

Initialize your local storage at Application startup

```typescript
useEffect(() => {
  //TzCommunity
  (async () => {
    await localStorage.initStorage();
  })();
  //End TzCommunity
}, []);
```

Try to feth all user profile once you have connected

```typescript
//tzCommunity
const [userProfiles, setUserProfiles] = useState<Map<address, UserProfile>>(
  new Map()
);

const [userProfile, setUserProfile] = useState<UserProfile | undefined>();
const [localStorage, setLocalStorage] = useState<CachingService>(
  new CachingService(new LocalStorage())
);

useEffect(() => {
  //only try to load if userProfile, it means you are logged with TzCommunity
  (async () => {
    if (userProfile || userProfile === null) {
      try {
        setUserProfiles(
          await loadUserProfiles(Tezos, userAddress!, localStorage)
        );
      } catch (error) {
        console.log(error);

        if (error instanceof TzCommunityError) {
          switch (error.type) {
            case TzCommunityErrorType.ACCESS_TOKEN_NULL: {
              console.warn("Cannot refresh token, disconnect");
              disconnectWallet();
              break;
            }
            case TzCommunityErrorType.ACCESS_TOKEN_EXPIRED: {
              console.warn(
                "Access token expired, try to fetch from refresh token.."
              );
              await refreshToken(userAddress!, localStorage);
              const userProfile = await getUserProfile(
                userAddress!,
                localStorage
              );
              if (userProfile) setUserProfile(userProfile);
              setUserProfiles(
                await loadUserProfiles(Tezos, userAddress!, localStorage)
              );
              break;
            }
          }
        } else {
          //nada
        }
      }
    } else {
      //nada
    }
  })();
}, [userProfile]);
```

Wrap your application with TzCommunity React context, so you can inject the context everywhere on your pages

```typescript
return (
  <IonApp>
    <TzCommunityReactContext.Provider
      value={{
        userProfiles,
        setUserProfiles,
        userProfile,
        setUserProfile,
        localStorage,
        connectToWeb2Backend: connectToWeb2Backend,
      }}
    >
      ....
    </TzCommunityReactContext.Provider>
  </IonApp>
);
```

### In case of HARD page refresh, lost of session and you want to reload your user profile

```typescript
const reloadUser = async (): Promise<string | undefined> => {

const activeAccount = await wallet.client.getActiveAccount();

if (activeAccount) {
    let userAddress = activeAccount!.address;
    setUserAddress(userAddress);

...

//try to load your user profile
try {
  const newUserProfile = await getUserProfile(userAddress, localStorage);
  setUserProfile(newUserProfile!);

  setUserProfiles(userProfiles.set(userAddress as address, newUserProfile!));
} catch (error) {
  if (error instanceof TzCommunityError) {
    switch (error.type) {
      case TzCommunityErrorType.ACCESS_TOKEN_NULL: {
        console.warn("Cannot refresh token, disconnect");
        disconnectWallet();
        break;
      }
      case TzCommunityErrorType.ACCESS_TOKEN_EXPIRED: {
        console.warn("Access token expired, try to fetch from refresh token..");
        await refreshToken(userAddress!, localStorage);
        const userProfile = await getUserProfile(userAddress!, localStorage);
        if (userProfile) setUserProfile(userProfile);
        setUserProfiles(
          await loadUserProfiles(Tezos, userAddress!, localStorage)
        );
        break;
      }
    }
  } else {
          console.warn(
            "User " +
              userAddress +
              " has no social account profile link on TzCommunity"
          );
        }
      }

      return userAddress;
    } else {
      return undefined;
    }
  };
```

## On a Page, Replace tz1 display on your UI by this custom IonChip

Import libs, fetch profiles from context and use the Chip component (replacing alice `tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb` address by your own variable)

```typescript
import {
  TzCommunityReactContext,
  TzCommunityReactContextType,
} from "@marigold-dev/tezos-community-reactcontext";
import { TzCommunityIonicUserProfileChip } from "@marigold-dev/tezos-community-reactcontext-ionic";
import { address, int } from "../type-aliases";

...


 //TZCOM CONTEXT
  const { userProfiles } = React.useContext(
    TzCommunityReactContext
  ) as TzCommunityReactContextType;

...

return  <TzCommunityIonicUserProfileChip
                userProfiles={userProfiles}
                address="tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb"
                key="tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb"
              ></TzCommunityIonicUserProfileChip>


```

Here is the end of the magic story
