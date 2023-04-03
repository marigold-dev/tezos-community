# tezos-community

Project to build a dapp for Tezos community that includes a DAO, organization rules, multisig, message broadcast, etc ...

[slides](https://docs.google.com/presentation/d/1Tao9c4QZm_YGRz9PxwZlPks2EbUCN8K_XKldVN4V0zQ/edit#slide=id.g2133bbaece6_0_0)

Add @ligo/fa lib

```
echo "{}" > esy.json
taq ligo --command "install @ligo/fa"
```

Compile with last version

```bash
TAQ_LIGO_IMAGE=ligolang/ligo:next taq compile main.jsligo
```

Run test

```bash
TAQ_LIGO_IMAGE=ligolang/ligo:next taq test test.jsligo
```

deploy

```
taq install @taqueria/plugin-taquito
taq deploy main.tz -e "testing"
```

> Note, change file name on storage

Override with alice account on .taq/config.local.testing.json

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

Mobile app

```
npm run postinstall
npm run start
```
