# tezos-community

## Build / compile

Project to build a dapp for Tezos community that includes a DAO, organization rules, multisig, message broadcast, etc ...

[slides](https://docs.google.com/presentation/d/1Tao9c4QZm_YGRz9PxwZlPks2EbUCN8K_XKldVN4V0zQ/edit#slide=id.g2133bbaece6_0_0)

Add @ligo/fa lib

```
echo "{}" > esy.json
taq ligo --command "install @ligo/fa"
taq install @taqueria/plugin-ligo@next
```

### NFT

Compile with last version

```bash
TAQ_LIGO_IMAGE=ligolang/ligo:0.65.0 taq compile nft.jsligo
```

### Registry

Compile with last version

```bash
TAQ_LIGO_IMAGE=ligolang/ligo:0.65.0 taq compile main.jsligo
```

Run test

```bash
TAQ_LIGO_IMAGE=ligolang/ligo:0.65.0 taq test test.jsligo
```

## Deploy

intall plugin first

```
taq install @taqueria/plugin-taquito
```

> Note : When deploying on first time, override with alice account on .taq/config.local.testing.json

```json
{
  "networkName": "ghostnet",
  "accounts": {
    "taqOperatorAccount": {
      "publicKey": "edpkvGfYw3LyB1UcCahKQk4rF2tvbMUk8GFiTuMjL75uGXrpvKXhjn",
      "publicKeyHash": "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb",
      "privateKey": "edsk3QoqBuvdamxouPhin7swCvkQNgq4jP5KZPbwWNnwdZpSpJiEbq"
    }
  }
}
```

## NFT (first)

```
taq deploy nft.tz -e "testing"
```

> Important : Copy/paste the deployed address and change the nftAddress field on main.storageList.jsligo

## Registry

Compile again as you need to have the last nft deployment address to change the initial storage file, then deploy

```
TAQ_LIGO_IMAGE=ligolang/ligo:0.65.0 taq compile main.jsligo
taq deploy main.tz -e "testing" --storage main.storage.ghostnet.tz

or

taq deploy main.tz -e "production" --storage main.storage.mainnet.tz
```

# Mobile app

```
taq install @taqueria/plugin-contract-types
taq generate types ./app/src
cd app
npm run postinstall
npm run start
```

# Backend app

Create it

```
npm i -g @nestjs/cli
nest new backend --strict
```

Run it

```
cd backend
yarn install
yarn run start:dev
```
