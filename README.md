# tezos-community

* [Documentation](https://marigold-dev.github.io/tzvote/)

## Build / compile

Project to build a dapp for Tezos community that includes a DAO, organization rules, multisig, message broadcast, etc ...

[slides](https://docs.google.com/presentation/d/1vkLs8356xRQIn5h9nxBeyj2hT8oPyv2w/edit?usp=drive_link&ouid=112389132178955160048&rtpof=true&sd=true)

Add @ligo/fa lib

```
echo "{}" > esy.json
taq ligo --command "install @ligo/fa"
taq install @taqueria/plugin-ligo@next
```

### NFT

Compile with last version

```bash
TAQ_LIGO_IMAGE=ligolang/ligo:0.71.1 taq compile nft.jsligo
```

### Registry

Compile with last version

```bash
TAQ_LIGO_IMAGE=ligolang/ligo:0.71.1 taq compile main.jsligo
```

Run test

```bash
TAQ_LIGO_IMAGE=ligolang/ligo:0.71.1 taq test test.jsligo
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
taq deploy nft.tz -e "testing" --storage nft.storage.ghostnet.tz
```

> Important : Copy/paste the deployed address and change the nftAddress field on main.storageList.jsligo

## Registry

Compile again as you need to have the last nft deployment address to change the initial storage file, then deploy

```
TAQ_LIGO_IMAGE=ligolang/ligo:ligo:0.71.1 taq compile main.jsligo
taq deploy main.tz -e "testing" --storage main.storage.ghostnet.tz

or

taq deploy main.tz -e "production" --storage main.storage.mainnet.tz
```

# Mobile app

```
taq install @taqueria/plugin-contract-types
taq generate types ./app/src
taq generate types ./backend/src
cd app
```

## First time, remove default old CRA scripts and move to vite config

```bash
npm uninstall -S react-scripts react-app-rewired
npm uninstall -S @testing-library/jest-dom @testing-library/react @testing-library/user-event @types/jest
rm src/setupTests.ts src/react-app-env.d.ts src/reportWebVitals.ts src/serviceWorkerRegistration.ts src/App.test.tsx
echo '/// <reference types="vite/client" />' > src/vite-env.d.ts
sed -i 's/process.env.PUBLIC_URL/import.meta.env.VITE_PUBLIC_URL/' src/service-worker.ts

npm install -S typescript@^5.1.6 @taquito/taquito @taquito/beacon-wallet @airgap/beacon-sdk  @tzkt/sdk-api
npm install -S -D @airgap/beacon-types vite @vitejs/plugin-react-swc @types/react @types/node
```

Fix web3 polyfill issues

```bash
npm i -D process buffer crypto-browserify stream-browserify assert stream-http https-browserify os-browserify url path-browserify
echo 'import { Buffer } from "buffer";globalThis.Buffer = Buffer;' > src/nodeSpecific.ts
echo 'import { defineConfig } from "vite";import react from "@vitejs/plugin-react-swc";export default defineConfig({define: { "process.env": process.env,    global: {},  },  build: {    commonjsOptions: {      transformMixedEsModules: true,    },  },  plugins: [react()],  resolve: {    alias: {      stream: "stream-browserify",      os: "os-browserify/browser",      util: "util",      process: "process/browser",      buffer: "buffer",      crypto: "crypto-browserify",      assert: "assert",      http: "stream-http",      https: "https-browserify",      url: "url",      path: "path-browserify",    },  },});' > vite.config.ts
mv public/index.html .
```

Replace body on `index.html` by :

```html
<body>
  <div id="root"></div>
  <script type="module" src="/src/nodeSpecific.ts"></script>
  <script type="module" src="/src/index.tsx"></script>
</body>
```

Edit `src/index.tsx`` as it :

```typescript
import { createRoot } from "react-dom/client";
import App from "./App";

const container = document.getElementById("root");
const root = createRoot(container!);

// Add or remove the "dark" class based on if the media query matches
document.body.classList.add("dark");

root.render(<App />);
```

Modify the default package.json default scripts to use vite instead of default react scripts

```json
  "scripts": {
    "dev": "jq -r '\"VITE_CONTRACT_ADDRESS=\" + last(.tasks[]).output[0].address' ../.taq/testing-state.json > .env && vite --host",
    "ionic:build": "tsc -v && tsc && vite build",
    "build": " tsc -v && tsc && vite build",
    "lint": "eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview",
    "ionic:serve": "vite dev --host",
    "sync": "npm run build && ionic cap sync --no-build"
  },
```

Edit tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

Create tsconfig.node.json

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

## run it

```
npm run dev
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

# Publish libraries

Go to one of the libraries :

- lib
- lib-react
- lib-react-ionic

```bash
npm run build
npm run publish
```

# Docs

* [Documentation](https://marigold-dev.github.io/tzvote/)

import git submodule and run doc locally

```
git submodule update --init --recursive
mdbook serve --open --port 3003
```
