Object.assign(window.search, {"doc_urls":["index.html#tezos-community","index.html#build--compile","index.html#deploy","index.html#nft-first","index.html#registry","index.html#mobile-app","index.html#backend-app"],"index":{"documentStore":{"docInfo":{"0":{"body":0,"breadcrumbs":4,"title":2},"1":{"body":50,"breadcrumbs":4,"title":2},"2":{"body":25,"breadcrumbs":3,"title":1},"3":{"body":13,"breadcrumbs":4,"title":2},"4":{"body":30,"breadcrumbs":3,"title":1},"5":{"body":17,"breadcrumbs":4,"title":2},"6":{"body":16,"breadcrumbs":4,"title":2}},"docs":{"0":{"body":"","breadcrumbs":"Tezos Community » tezos-community","id":"0","title":"tezos-community"},"1":{"body":"Project to build a dapp for Tezos community that includes a DAO, organization rules, multisig, message broadcast, etc ... slides Add @ligo/fa lib echo \"{}\" > esy.json\ntaq ligo --command \"install @ligo/fa\"\ntaq install @taqueria/plugin-ligo@next NFT Compile with last version TAQ_LIGO_IMAGE=ligolang/ligo:0.65.0 taq compile nft.jsligo Registry Compile with last version TAQ_LIGO_IMAGE=ligolang/ligo:0.65.0 taq compile main.jsligo Run test TAQ_LIGO_IMAGE=ligolang/ligo:0.65.0 taq test test.jsligo","breadcrumbs":"Tezos Community » Build / compile","id":"1","title":"Build / compile"},"2":{"body":"intall plugin first taq install @taqueria/plugin-taquito Note : When deploying on first time, override with alice account on .taq/config.local.testing.json { \"networkName\": \"ghostnet\", \"accounts\": { \"taqOperatorAccount\": { \"publicKey\": \"edpkvGfYw3LyB1UcCahKQk4rF2tvbMUk8GFiTuMjL75uGXrpvKXhjn\", \"publicKeyHash\": \"tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb\", \"privateKey\": \"edsk3QoqBuvdamxouPhin7swCvkQNgq4jP5KZPbwWNnwdZpSpJiEbq\" } }\n}","breadcrumbs":"Tezos Community » Deploy","id":"2","title":"Deploy"},"3":{"body":"taq deploy nft.tz -e \"testing\" Important : Copy/paste the deployed address and change the nftAddress field on main.storageList.jsligo","breadcrumbs":"Tezos Community » NFT (first)","id":"3","title":"NFT (first)"},"4":{"body":"Compile again as you need to have the last nft deployment address to change the initial storage file, then deploy TAQ_LIGO_IMAGE=ligolang/ligo:0.65.0 taq compile main.jsligo\ntaq deploy main.tz -e \"testing\" --storage main.storage.ghostnet.tz or taq deploy main.tz -e \"production\" --storage main.storage.mainnet.tz","breadcrumbs":"Tezos Community » Registry","id":"4","title":"Registry"},"5":{"body":"taq install @taqueria/plugin-contract-types\ntaq generate types ./app/src\ncd app\nnpm run postinstall\nnpm run start","breadcrumbs":"Tezos Community » Mobile app","id":"5","title":"Mobile app"},"6":{"body":"Create it npm i -g @nestjs/cli\nnest new backend --strict Run it cd backend\nyarn install\nyarn run start:dev","breadcrumbs":"Tezos Community » Backend app","id":"6","title":"Backend app"}},"length":7,"save":true},"fields":["title","body","breadcrumbs"],"index":{"body":{"root":{"a":{"c":{"c":{"df":0,"docs":{},"o":{"df":0,"docs":{},"u":{"df":0,"docs":{},"n":{"df":0,"docs":{},"t":{"df":1,"docs":{"2":{"tf":1.4142135623730951}}}}}}},"df":0,"docs":{}},"d":{"d":{"df":1,"docs":{"1":{"tf":1.0}},"r":{"df":0,"docs":{},"e":{"df":0,"docs":{},"s":{"df":0,"docs":{},"s":{"df":2,"docs":{"3":{"tf":1.0},"4":{"tf":1.0}}}}}}},"df":0,"docs":{}},"df":0,"docs":{},"g":{"a":{"df":0,"docs":{},"i":{"df":0,"docs":{},"n":{"df":1,"docs":{"4":{"tf":1.0}}}}},"df":0,"docs":{}},"l":{"df":0,"docs":{},"i":{"c":{"df":1,"docs":{"2":{"tf":1.0}}},"df":0,"docs":{}}},"p":{"df":0,"docs":{},"p":{"/":{"df":0,"docs":{},"s":{"df":0,"docs":{},"r":{"c":{"df":1,"docs":{"5":{"tf":1.0}}},"df":0,"docs":{}}}},"df":2,"docs":{"5":{"tf":1.4142135623730951},"6":{"tf":1.0}}}}},"b":{"a":{"c":{"df":0,"docs":{},"k":{"df":0,"docs":{},"e":{"df":0,"docs":{},"n":{"d":{"df":1,"docs":{"6":{"tf":1.7320508075688772}}},"df":0,"docs":{}}}}},"df":0,"docs":{}},"df":0,"docs":{},"r":{"df":0,"docs":{},"o":{"a":{"d":{"c":{"a":{"df":0,"docs":{},"s":{"df":0,"docs":{},"t":{"df":1,"docs":{"1":{"tf":1.0}}}}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{}}},"u":{"df":0,"docs":{},"i":{"df":0,"docs":{},"l":{"d":{"df":1,"docs":{"1":{"tf":1.4142135623730951}}},"df":0,"docs":{}}}}},"c":{"d":{"df":2,"docs":{"5":{"tf":1.0},"6":{"tf":1.0}}},"df":0,"docs":{},"h":{"a":{"df":0,"docs":{},"n":{"df":0,"docs":{},"g":{"df":2,"docs":{"3":{"tf":1.0},"4":{"tf":1.0}}}}},"df":0,"docs":{}},"o":{"df":0,"docs":{},"m":{"df":0,"docs":{},"m":{"a":{"df":0,"docs":{},"n":{"d":{"df":1,"docs":{"1":{"tf":1.0}}},"df":0,"docs":{}}},"df":0,"docs":{},"u":{"df":0,"docs":{},"n":{"df":2,"docs":{"0":{"tf":1.0},"1":{"tf":1.0}}}}},"p":{"df":0,"docs":{},"i":{"df":0,"docs":{},"l":{"df":2,"docs":{"1":{"tf":2.23606797749979},"4":{"tf":1.4142135623730951}}}}}},"n":{"df":0,"docs":{},"t":{"df":0,"docs":{},"r":{"a":{"c":{"df":0,"docs":{},"t":{"df":1,"docs":{"5":{"tf":1.0}}}},"df":0,"docs":{}},"df":0,"docs":{}}}},"p":{"df":0,"docs":{},"y":{"/":{"df":0,"docs":{},"p":{"a":{"df":0,"docs":{},"s":{"df":0,"docs":{},"t":{"df":1,"docs":{"3":{"tf":1.0}}}}},"df":0,"docs":{}}},"df":0,"docs":{}}}},"r":{"df":0,"docs":{},"e":{"a":{"df":0,"docs":{},"t":{"df":1,"docs":{"6":{"tf":1.0}}}},"df":0,"docs":{}}}},"d":{"a":{"df":0,"docs":{},"o":{"df":1,"docs":{"1":{"tf":1.0}}},"p":{"df":0,"docs":{},"p":{"df":1,"docs":{"1":{"tf":1.0}}}}},"df":0,"docs":{},"e":{"df":0,"docs":{},"p":{"df":0,"docs":{},"l":{"df":0,"docs":{},"o":{"df":0,"docs":{},"y":{"df":3,"docs":{"2":{"tf":1.4142135623730951},"3":{"tf":1.4142135623730951},"4":{"tf":2.0}}}}}}}},"df":0,"docs":{},"e":{"c":{"df":0,"docs":{},"h":{"df":0,"docs":{},"o":{"df":1,"docs":{"1":{"tf":1.0}}}}},"d":{"df":0,"docs":{},"p":{"df":0,"docs":{},"k":{"df":0,"docs":{},"v":{"df":0,"docs":{},"g":{"df":0,"docs":{},"f":{"df":0,"docs":{},"y":{"df":0,"docs":{},"w":{"3":{"df":0,"docs":{},"l":{"df":0,"docs":{},"y":{"b":{"1":{"df":0,"docs":{},"u":{"c":{"c":{"a":{"df":0,"docs":{},"h":{"df":0,"docs":{},"k":{"df":0,"docs":{},"q":{"df":0,"docs":{},"k":{"4":{"df":0,"docs":{},"r":{"df":0,"docs":{},"f":{"2":{"df":0,"docs":{},"t":{"df":0,"docs":{},"v":{"b":{"df":0,"docs":{},"m":{"df":0,"docs":{},"u":{"df":0,"docs":{},"k":{"8":{"df":0,"docs":{},"g":{"df":0,"docs":{},"f":{"df":0,"docs":{},"i":{"df":0,"docs":{},"t":{"df":0,"docs":{},"u":{"df":0,"docs":{},"m":{"df":0,"docs":{},"j":{"df":0,"docs":{},"l":{"7":{"5":{"df":0,"docs":{},"u":{"df":0,"docs":{},"g":{"df":0,"docs":{},"x":{"df":0,"docs":{},"r":{"df":0,"docs":{},"p":{"df":0,"docs":{},"v":{"df":0,"docs":{},"k":{"df":0,"docs":{},"x":{"df":0,"docs":{},"h":{"df":0,"docs":{},"j":{"df":0,"docs":{},"n":{"df":1,"docs":{"2":{"tf":1.0}}}}}}}}}}}}}},"df":0,"docs":{}},"df":0,"docs":{}}}}}}}}}},"df":0,"docs":{}}}}},"df":0,"docs":{}}}},"df":0,"docs":{}}}},"df":0,"docs":{}}}}}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{}}},"df":0,"docs":{}},"df":0,"docs":{}}}},"df":0,"docs":{}}}}}}}},"s":{"df":0,"docs":{},"k":{"3":{"df":0,"docs":{},"q":{"df":0,"docs":{},"o":{"df":0,"docs":{},"q":{"b":{"df":0,"docs":{},"u":{"df":0,"docs":{},"v":{"d":{"a":{"df":0,"docs":{},"m":{"df":0,"docs":{},"x":{"df":0,"docs":{},"o":{"df":0,"docs":{},"u":{"df":0,"docs":{},"p":{"df":0,"docs":{},"h":{"df":0,"docs":{},"i":{"df":0,"docs":{},"n":{"7":{"df":0,"docs":{},"s":{"df":0,"docs":{},"w":{"c":{"df":0,"docs":{},"v":{"df":0,"docs":{},"k":{"df":0,"docs":{},"q":{"df":0,"docs":{},"n":{"df":0,"docs":{},"g":{"df":0,"docs":{},"q":{"4":{"df":0,"docs":{},"j":{"df":0,"docs":{},"p":{"5":{"df":0,"docs":{},"k":{"df":0,"docs":{},"z":{"df":0,"docs":{},"p":{"b":{"df":0,"docs":{},"w":{"df":0,"docs":{},"w":{"df":0,"docs":{},"n":{"df":0,"docs":{},"n":{"df":0,"docs":{},"w":{"d":{"df":0,"docs":{},"z":{"df":0,"docs":{},"p":{"df":0,"docs":{},"s":{"df":0,"docs":{},"p":{"df":0,"docs":{},"j":{"df":0,"docs":{},"i":{"df":0,"docs":{},"e":{"b":{"df":0,"docs":{},"q":{"df":1,"docs":{"2":{"tf":1.0}}}},"df":0,"docs":{}}}}}}}}},"df":0,"docs":{}}}}}}},"df":0,"docs":{}}}}},"df":0,"docs":{}}}},"df":0,"docs":{}}}}}}}},"df":0,"docs":{}}}},"df":0,"docs":{}}}}}}}}}},"df":0,"docs":{}},"df":0,"docs":{}}}},"df":0,"docs":{}}}}},"df":0,"docs":{}}}},"df":2,"docs":{"3":{"tf":1.0},"4":{"tf":1.4142135623730951}},"s":{"df":0,"docs":{},"y":{".":{"df":0,"docs":{},"j":{"df":0,"docs":{},"s":{"df":0,"docs":{},"o":{"df":0,"docs":{},"n":{"df":1,"docs":{"1":{"tf":1.0}}}}}}},"df":0,"docs":{}}},"t":{"c":{"df":1,"docs":{"1":{"tf":1.0}}},"df":0,"docs":{}}},"f":{"df":0,"docs":{},"i":{"df":0,"docs":{},"e":{"df":0,"docs":{},"l":{"d":{"df":1,"docs":{"3":{"tf":1.0}}},"df":0,"docs":{}}},"l":{"df":0,"docs":{},"e":{"df":1,"docs":{"4":{"tf":1.0}}}},"r":{"df":0,"docs":{},"s":{"df":0,"docs":{},"t":{"df":2,"docs":{"2":{"tf":1.4142135623730951},"3":{"tf":1.0}}}}}}},"g":{"df":1,"docs":{"6":{"tf":1.0}},"e":{"df":0,"docs":{},"n":{"df":0,"docs":{},"e":{"df":0,"docs":{},"r":{"df":1,"docs":{"5":{"tf":1.0}}}}}},"h":{"df":0,"docs":{},"o":{"df":0,"docs":{},"s":{"df":0,"docs":{},"t":{"df":0,"docs":{},"n":{"df":0,"docs":{},"e":{"df":0,"docs":{},"t":{"df":1,"docs":{"2":{"tf":1.0}}}}}}}}}},"i":{"df":0,"docs":{},"m":{"df":0,"docs":{},"p":{"df":0,"docs":{},"o":{"df":0,"docs":{},"r":{"df":0,"docs":{},"t":{"df":1,"docs":{"3":{"tf":1.0}}}}}}},"n":{"c":{"df":0,"docs":{},"l":{"df":0,"docs":{},"u":{"d":{"df":1,"docs":{"1":{"tf":1.0}}},"df":0,"docs":{}}}},"df":0,"docs":{},"i":{"df":0,"docs":{},"t":{"df":0,"docs":{},"i":{"df":1,"docs":{"4":{"tf":1.0}}}}},"s":{"df":0,"docs":{},"t":{"a":{"df":0,"docs":{},"l":{"df":4,"docs":{"1":{"tf":1.4142135623730951},"2":{"tf":1.0},"5":{"tf":1.0},"6":{"tf":1.0}}}},"df":0,"docs":{}}},"t":{"a":{"df":0,"docs":{},"l":{"df":1,"docs":{"2":{"tf":1.0}}}},"df":0,"docs":{}}}},"l":{"a":{"df":0,"docs":{},"s":{"df":0,"docs":{},"t":{"df":2,"docs":{"1":{"tf":1.4142135623730951},"4":{"tf":1.0}}}}},"df":0,"docs":{},"i":{"b":{"df":1,"docs":{"1":{"tf":1.0}}},"df":0,"docs":{},"g":{"df":0,"docs":{},"o":{"/":{"df":0,"docs":{},"f":{"a":{"df":1,"docs":{"1":{"tf":1.4142135623730951}}},"df":0,"docs":{}}},"@":{"df":0,"docs":{},"n":{"df":0,"docs":{},"e":{"df":0,"docs":{},"x":{"df":0,"docs":{},"t":{"df":1,"docs":{"1":{"tf":1.0}}}}}}},"df":1,"docs":{"1":{"tf":1.0}}}}}},"m":{"a":{"df":0,"docs":{},"i":{"df":0,"docs":{},"n":{".":{"df":0,"docs":{},"j":{"df":0,"docs":{},"s":{"df":0,"docs":{},"l":{"df":0,"docs":{},"i":{"df":0,"docs":{},"g":{"df":0,"docs":{},"o":{"df":2,"docs":{"1":{"tf":1.0},"4":{"tf":1.0}}}}}}}},"s":{"df":0,"docs":{},"t":{"df":0,"docs":{},"o":{"df":0,"docs":{},"r":{"a":{"df":0,"docs":{},"g":{"df":0,"docs":{},"e":{".":{"df":0,"docs":{},"g":{"df":0,"docs":{},"h":{"df":0,"docs":{},"o":{"df":0,"docs":{},"s":{"df":0,"docs":{},"t":{"df":0,"docs":{},"n":{"df":0,"docs":{},"e":{"df":0,"docs":{},"t":{".":{"df":0,"docs":{},"t":{"df":0,"docs":{},"z":{"df":1,"docs":{"4":{"tf":1.0}}}}},"df":0,"docs":{}}}}}}}}},"m":{"a":{"df":0,"docs":{},"i":{"df":0,"docs":{},"n":{"df":0,"docs":{},"n":{"df":0,"docs":{},"e":{"df":0,"docs":{},"t":{".":{"df":0,"docs":{},"t":{"df":0,"docs":{},"z":{"df":1,"docs":{"4":{"tf":1.0}}}}},"df":0,"docs":{}}}}}}},"df":0,"docs":{}}},"df":0,"docs":{},"l":{"df":0,"docs":{},"i":{"df":0,"docs":{},"s":{"df":0,"docs":{},"t":{".":{"df":0,"docs":{},"j":{"df":0,"docs":{},"s":{"df":0,"docs":{},"l":{"df":0,"docs":{},"i":{"df":0,"docs":{},"g":{"df":0,"docs":{},"o":{"df":1,"docs":{"3":{"tf":1.0}}}}}}}}},"df":0,"docs":{}}}}}}}},"df":0,"docs":{}}}}},"t":{"df":0,"docs":{},"z":{"df":1,"docs":{"4":{"tf":1.4142135623730951}}}}},"df":0,"docs":{}}}},"df":0,"docs":{},"e":{"df":0,"docs":{},"s":{"df":0,"docs":{},"s":{"a":{"df":0,"docs":{},"g":{"df":1,"docs":{"1":{"tf":1.0}}}},"df":0,"docs":{}}}},"o":{"b":{"df":0,"docs":{},"i":{"df":0,"docs":{},"l":{"df":1,"docs":{"5":{"tf":1.0}}}}},"df":0,"docs":{}},"u":{"df":0,"docs":{},"l":{"df":0,"docs":{},"t":{"df":0,"docs":{},"i":{"df":0,"docs":{},"s":{"df":0,"docs":{},"i":{"df":0,"docs":{},"g":{"df":1,"docs":{"1":{"tf":1.0}}}}}}}}}},"n":{"df":0,"docs":{},"e":{"df":0,"docs":{},"e":{"d":{"df":1,"docs":{"4":{"tf":1.0}}},"df":0,"docs":{}},"s":{"df":0,"docs":{},"t":{"df":1,"docs":{"6":{"tf":1.0}},"j":{"df":0,"docs":{},"s":{"/":{"c":{"df":0,"docs":{},"l":{"df":0,"docs":{},"i":{"df":1,"docs":{"6":{"tf":1.0}}}}},"df":0,"docs":{}},"df":0,"docs":{}}}}},"t":{"df":0,"docs":{},"w":{"df":0,"docs":{},"o":{"df":0,"docs":{},"r":{"df":0,"docs":{},"k":{"df":0,"docs":{},"n":{"a":{"df":0,"docs":{},"m":{"df":1,"docs":{"2":{"tf":1.0}}}},"df":0,"docs":{}}}}}}},"w":{"df":1,"docs":{"6":{"tf":1.0}}}},"f":{"df":0,"docs":{},"t":{".":{"df":0,"docs":{},"j":{"df":0,"docs":{},"s":{"df":0,"docs":{},"l":{"df":0,"docs":{},"i":{"df":0,"docs":{},"g":{"df":0,"docs":{},"o":{"df":1,"docs":{"1":{"tf":1.0}}}}}}}},"t":{"df":0,"docs":{},"z":{"df":1,"docs":{"3":{"tf":1.0}}}}},"a":{"d":{"d":{"df":0,"docs":{},"r":{"df":0,"docs":{},"e":{"df":0,"docs":{},"s":{"df":0,"docs":{},"s":{"df":1,"docs":{"3":{"tf":1.0}}}}}}},"df":0,"docs":{}},"df":0,"docs":{}},"df":3,"docs":{"1":{"tf":1.0},"3":{"tf":1.0},"4":{"tf":1.0}}}},"o":{"df":0,"docs":{},"t":{"df":0,"docs":{},"e":{"df":1,"docs":{"2":{"tf":1.0}}}}},"p":{"df":0,"docs":{},"m":{"df":2,"docs":{"5":{"tf":1.4142135623730951},"6":{"tf":1.0}}}}},"o":{"df":0,"docs":{},"r":{"df":0,"docs":{},"g":{"a":{"df":0,"docs":{},"n":{"df":1,"docs":{"1":{"tf":1.0}}}},"df":0,"docs":{}}},"v":{"df":0,"docs":{},"e":{"df":0,"docs":{},"r":{"df":0,"docs":{},"r":{"df":0,"docs":{},"i":{"d":{"df":1,"docs":{"2":{"tf":1.0}}},"df":0,"docs":{}}}}}}},"p":{"df":0,"docs":{},"l":{"df":0,"docs":{},"u":{"df":0,"docs":{},"g":{"df":0,"docs":{},"i":{"df":0,"docs":{},"n":{"df":1,"docs":{"2":{"tf":1.0}}}}}}},"o":{"df":0,"docs":{},"s":{"df":0,"docs":{},"t":{"df":0,"docs":{},"i":{"df":0,"docs":{},"n":{"df":0,"docs":{},"s":{"df":0,"docs":{},"t":{"a":{"df":0,"docs":{},"l":{"df":1,"docs":{"5":{"tf":1.0}}}},"df":0,"docs":{}}}}}}}},"r":{"df":0,"docs":{},"i":{"df":0,"docs":{},"v":{"a":{"df":0,"docs":{},"t":{"df":0,"docs":{},"e":{"df":0,"docs":{},"k":{"df":0,"docs":{},"e":{"df":0,"docs":{},"y":{"df":1,"docs":{"2":{"tf":1.0}}}}}}}},"df":0,"docs":{}}},"o":{"d":{"df":0,"docs":{},"u":{"c":{"df":0,"docs":{},"t":{"df":1,"docs":{"4":{"tf":1.0}}}},"df":0,"docs":{}}},"df":0,"docs":{},"j":{"df":0,"docs":{},"e":{"c":{"df":0,"docs":{},"t":{"df":1,"docs":{"1":{"tf":1.0}}}},"df":0,"docs":{}}}}},"u":{"b":{"df":0,"docs":{},"l":{"df":0,"docs":{},"i":{"c":{"df":0,"docs":{},"k":{"df":0,"docs":{},"e":{"df":0,"docs":{},"y":{"df":1,"docs":{"2":{"tf":1.0}},"h":{"a":{"df":0,"docs":{},"s":{"df":0,"docs":{},"h":{"df":1,"docs":{"2":{"tf":1.0}}}}},"df":0,"docs":{}}}}}},"df":0,"docs":{}}}},"df":0,"docs":{}}},"r":{"df":0,"docs":{},"e":{"df":0,"docs":{},"g":{"df":0,"docs":{},"i":{"df":0,"docs":{},"s":{"df":0,"docs":{},"t":{"df":0,"docs":{},"r":{"df":0,"docs":{},"i":{"df":2,"docs":{"1":{"tf":1.0},"4":{"tf":1.0}}}}}}}}},"u":{"df":0,"docs":{},"l":{"df":0,"docs":{},"e":{"df":1,"docs":{"1":{"tf":1.0}}}},"n":{"df":3,"docs":{"1":{"tf":1.0},"5":{"tf":1.4142135623730951},"6":{"tf":1.4142135623730951}}}}},"s":{"df":0,"docs":{},"l":{"df":0,"docs":{},"i":{"d":{"df":0,"docs":{},"e":{"df":1,"docs":{"1":{"tf":1.0}}}},"df":0,"docs":{}}},"t":{"a":{"df":0,"docs":{},"r":{"df":0,"docs":{},"t":{":":{"d":{"df":0,"docs":{},"e":{"df":0,"docs":{},"v":{"df":1,"docs":{"6":{"tf":1.0}}}}},"df":0,"docs":{}},"df":1,"docs":{"5":{"tf":1.0}}}}},"df":0,"docs":{},"o":{"df":0,"docs":{},"r":{"a":{"df":0,"docs":{},"g":{"df":1,"docs":{"4":{"tf":1.7320508075688772}}}},"df":0,"docs":{}}},"r":{"df":0,"docs":{},"i":{"c":{"df":0,"docs":{},"t":{"df":1,"docs":{"6":{"tf":1.0}}}},"df":0,"docs":{}}}}},"t":{"a":{"df":0,"docs":{},"q":{"/":{"c":{"df":0,"docs":{},"o":{"df":0,"docs":{},"n":{"df":0,"docs":{},"f":{"df":0,"docs":{},"i":{"df":0,"docs":{},"g":{".":{"df":0,"docs":{},"l":{"df":0,"docs":{},"o":{"c":{"a":{"df":0,"docs":{},"l":{".":{"df":0,"docs":{},"t":{"df":0,"docs":{},"e":{"df":0,"docs":{},"s":{"df":0,"docs":{},"t":{"df":0,"docs":{},"i":{"df":0,"docs":{},"n":{"df":0,"docs":{},"g":{".":{"df":0,"docs":{},"j":{"df":0,"docs":{},"s":{"df":0,"docs":{},"o":{"df":0,"docs":{},"n":{"df":1,"docs":{"2":{"tf":1.0}}}}}}},"df":0,"docs":{}}}}}}}}},"df":0,"docs":{}}},"df":0,"docs":{}},"df":0,"docs":{}}}},"df":0,"docs":{}}}}}}},"df":0,"docs":{}},"_":{"df":0,"docs":{},"l":{"df":0,"docs":{},"i":{"df":0,"docs":{},"g":{"df":0,"docs":{},"o":{"_":{"df":0,"docs":{},"i":{"df":0,"docs":{},"m":{"a":{"df":0,"docs":{},"g":{"df":0,"docs":{},"e":{"=":{"df":0,"docs":{},"l":{"df":0,"docs":{},"i":{"df":0,"docs":{},"g":{"df":0,"docs":{},"o":{"df":0,"docs":{},"l":{"a":{"df":0,"docs":{},"n":{"df":0,"docs":{},"g":{"/":{"df":0,"docs":{},"l":{"df":0,"docs":{},"i":{"df":0,"docs":{},"g":{"df":0,"docs":{},"o":{":":{"0":{".":{"6":{"5":{".":{"0":{"df":2,"docs":{"1":{"tf":1.7320508075688772},"4":{"tf":1.0}}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{}}}}}},"df":0,"docs":{}}}},"df":0,"docs":{}}}}}}},"df":0,"docs":{}}}},"df":0,"docs":{}}}},"df":0,"docs":{}}}}}},"df":5,"docs":{"1":{"tf":2.23606797749979},"2":{"tf":1.0},"3":{"tf":1.0},"4":{"tf":1.7320508075688772},"5":{"tf":1.4142135623730951}},"o":{"df":0,"docs":{},"p":{"df":0,"docs":{},"e":{"df":0,"docs":{},"r":{"a":{"df":0,"docs":{},"t":{"df":0,"docs":{},"o":{"df":0,"docs":{},"r":{"a":{"c":{"c":{"df":0,"docs":{},"o":{"df":0,"docs":{},"u":{"df":0,"docs":{},"n":{"df":0,"docs":{},"t":{"df":1,"docs":{"2":{"tf":1.0}}}}}}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{}}}}},"df":0,"docs":{}}}}},"u":{"df":0,"docs":{},"e":{"df":0,"docs":{},"r":{"df":0,"docs":{},"i":{"a":{"/":{"df":0,"docs":{},"p":{"df":0,"docs":{},"l":{"df":0,"docs":{},"u":{"df":0,"docs":{},"g":{"df":0,"docs":{},"i":{"df":0,"docs":{},"n":{"df":3,"docs":{"1":{"tf":1.0},"2":{"tf":1.0},"5":{"tf":1.0}}}}}}}}},"df":0,"docs":{}},"df":0,"docs":{}}}},"i":{"df":0,"docs":{},"t":{"df":0,"docs":{},"o":{"df":1,"docs":{"2":{"tf":1.0}}}}}}}},"df":0,"docs":{},"e":{"df":0,"docs":{},"s":{"df":0,"docs":{},"t":{".":{"df":0,"docs":{},"j":{"df":0,"docs":{},"s":{"df":0,"docs":{},"l":{"df":0,"docs":{},"i":{"df":0,"docs":{},"g":{"df":0,"docs":{},"o":{"df":1,"docs":{"1":{"tf":1.0}}}}}}}}},"df":3,"docs":{"1":{"tf":1.4142135623730951},"3":{"tf":1.0},"4":{"tf":1.0}}}},"z":{"df":0,"docs":{},"o":{"df":2,"docs":{"0":{"tf":1.0},"1":{"tf":1.0}}}}},"i":{"df":0,"docs":{},"m":{"df":0,"docs":{},"e":{"df":1,"docs":{"2":{"tf":1.0}}}}},"y":{"df":0,"docs":{},"p":{"df":0,"docs":{},"e":{"df":1,"docs":{"5":{"tf":1.4142135623730951}}}}},"z":{"1":{"df":0,"docs":{},"v":{"df":0,"docs":{},"s":{"df":0,"docs":{},"u":{"df":0,"docs":{},"r":{"8":{"df":0,"docs":{},"w":{"df":0,"docs":{},"w":{"df":0,"docs":{},"n":{"df":0,"docs":{},"h":{"df":0,"docs":{},"l":{"a":{"df":0,"docs":{},"z":{"df":0,"docs":{},"e":{"df":0,"docs":{},"m":{"df":0,"docs":{},"p":{"df":0,"docs":{},"o":{"c":{"df":0,"docs":{},"h":{"5":{"d":{"6":{"df":0,"docs":{},"h":{"df":0,"docs":{},"l":{"df":0,"docs":{},"r":{"df":0,"docs":{},"i":{"df":0,"docs":{},"t":{"df":0,"docs":{},"h":{"8":{"c":{"df":0,"docs":{},"j":{"c":{"df":0,"docs":{},"j":{"b":{"df":1,"docs":{"2":{"tf":1.0}}},"df":0,"docs":{}}},"df":0,"docs":{}}},"df":0,"docs":{}},"df":0,"docs":{}}}}}}}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{}}},"df":0,"docs":{}}}}}}},"df":0,"docs":{}}}}}}},"df":0,"docs":{}}}}}},"df":0,"docs":{}}},"v":{"df":0,"docs":{},"e":{"df":0,"docs":{},"r":{"df":0,"docs":{},"s":{"df":0,"docs":{},"i":{"df":0,"docs":{},"o":{"df":0,"docs":{},"n":{"df":1,"docs":{"1":{"tf":1.4142135623730951}}}}}}}}},"y":{"a":{"df":0,"docs":{},"r":{"df":0,"docs":{},"n":{"df":1,"docs":{"6":{"tf":1.4142135623730951}}}}},"df":0,"docs":{}}}},"breadcrumbs":{"root":{"a":{"c":{"c":{"df":0,"docs":{},"o":{"df":0,"docs":{},"u":{"df":0,"docs":{},"n":{"df":0,"docs":{},"t":{"df":1,"docs":{"2":{"tf":1.4142135623730951}}}}}}},"df":0,"docs":{}},"d":{"d":{"df":1,"docs":{"1":{"tf":1.0}},"r":{"df":0,"docs":{},"e":{"df":0,"docs":{},"s":{"df":0,"docs":{},"s":{"df":2,"docs":{"3":{"tf":1.0},"4":{"tf":1.0}}}}}}},"df":0,"docs":{}},"df":0,"docs":{},"g":{"a":{"df":0,"docs":{},"i":{"df":0,"docs":{},"n":{"df":1,"docs":{"4":{"tf":1.0}}}}},"df":0,"docs":{}},"l":{"df":0,"docs":{},"i":{"c":{"df":1,"docs":{"2":{"tf":1.0}}},"df":0,"docs":{}}},"p":{"df":0,"docs":{},"p":{"/":{"df":0,"docs":{},"s":{"df":0,"docs":{},"r":{"c":{"df":1,"docs":{"5":{"tf":1.0}}},"df":0,"docs":{}}}},"df":2,"docs":{"5":{"tf":1.7320508075688772},"6":{"tf":1.4142135623730951}}}}},"b":{"a":{"c":{"df":0,"docs":{},"k":{"df":0,"docs":{},"e":{"df":0,"docs":{},"n":{"d":{"df":1,"docs":{"6":{"tf":2.0}}},"df":0,"docs":{}}}}},"df":0,"docs":{}},"df":0,"docs":{},"r":{"df":0,"docs":{},"o":{"a":{"d":{"c":{"a":{"df":0,"docs":{},"s":{"df":0,"docs":{},"t":{"df":1,"docs":{"1":{"tf":1.0}}}}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{}}},"u":{"df":0,"docs":{},"i":{"df":0,"docs":{},"l":{"d":{"df":1,"docs":{"1":{"tf":1.7320508075688772}}},"df":0,"docs":{}}}}},"c":{"d":{"df":2,"docs":{"5":{"tf":1.0},"6":{"tf":1.0}}},"df":0,"docs":{},"h":{"a":{"df":0,"docs":{},"n":{"df":0,"docs":{},"g":{"df":2,"docs":{"3":{"tf":1.0},"4":{"tf":1.0}}}}},"df":0,"docs":{}},"o":{"df":0,"docs":{},"m":{"df":0,"docs":{},"m":{"a":{"df":0,"docs":{},"n":{"d":{"df":1,"docs":{"1":{"tf":1.0}}},"df":0,"docs":{}}},"df":0,"docs":{},"u":{"df":0,"docs":{},"n":{"df":7,"docs":{"0":{"tf":1.7320508075688772},"1":{"tf":1.4142135623730951},"2":{"tf":1.0},"3":{"tf":1.0},"4":{"tf":1.0},"5":{"tf":1.0},"6":{"tf":1.0}}}}},"p":{"df":0,"docs":{},"i":{"df":0,"docs":{},"l":{"df":2,"docs":{"1":{"tf":2.449489742783178},"4":{"tf":1.4142135623730951}}}}}},"n":{"df":0,"docs":{},"t":{"df":0,"docs":{},"r":{"a":{"c":{"df":0,"docs":{},"t":{"df":1,"docs":{"5":{"tf":1.0}}}},"df":0,"docs":{}},"df":0,"docs":{}}}},"p":{"df":0,"docs":{},"y":{"/":{"df":0,"docs":{},"p":{"a":{"df":0,"docs":{},"s":{"df":0,"docs":{},"t":{"df":1,"docs":{"3":{"tf":1.0}}}}},"df":0,"docs":{}}},"df":0,"docs":{}}}},"r":{"df":0,"docs":{},"e":{"a":{"df":0,"docs":{},"t":{"df":1,"docs":{"6":{"tf":1.0}}}},"df":0,"docs":{}}}},"d":{"a":{"df":0,"docs":{},"o":{"df":1,"docs":{"1":{"tf":1.0}}},"p":{"df":0,"docs":{},"p":{"df":1,"docs":{"1":{"tf":1.0}}}}},"df":0,"docs":{},"e":{"df":0,"docs":{},"p":{"df":0,"docs":{},"l":{"df":0,"docs":{},"o":{"df":0,"docs":{},"y":{"df":3,"docs":{"2":{"tf":1.7320508075688772},"3":{"tf":1.4142135623730951},"4":{"tf":2.0}}}}}}}},"df":0,"docs":{},"e":{"c":{"df":0,"docs":{},"h":{"df":0,"docs":{},"o":{"df":1,"docs":{"1":{"tf":1.0}}}}},"d":{"df":0,"docs":{},"p":{"df":0,"docs":{},"k":{"df":0,"docs":{},"v":{"df":0,"docs":{},"g":{"df":0,"docs":{},"f":{"df":0,"docs":{},"y":{"df":0,"docs":{},"w":{"3":{"df":0,"docs":{},"l":{"df":0,"docs":{},"y":{"b":{"1":{"df":0,"docs":{},"u":{"c":{"c":{"a":{"df":0,"docs":{},"h":{"df":0,"docs":{},"k":{"df":0,"docs":{},"q":{"df":0,"docs":{},"k":{"4":{"df":0,"docs":{},"r":{"df":0,"docs":{},"f":{"2":{"df":0,"docs":{},"t":{"df":0,"docs":{},"v":{"b":{"df":0,"docs":{},"m":{"df":0,"docs":{},"u":{"df":0,"docs":{},"k":{"8":{"df":0,"docs":{},"g":{"df":0,"docs":{},"f":{"df":0,"docs":{},"i":{"df":0,"docs":{},"t":{"df":0,"docs":{},"u":{"df":0,"docs":{},"m":{"df":0,"docs":{},"j":{"df":0,"docs":{},"l":{"7":{"5":{"df":0,"docs":{},"u":{"df":0,"docs":{},"g":{"df":0,"docs":{},"x":{"df":0,"docs":{},"r":{"df":0,"docs":{},"p":{"df":0,"docs":{},"v":{"df":0,"docs":{},"k":{"df":0,"docs":{},"x":{"df":0,"docs":{},"h":{"df":0,"docs":{},"j":{"df":0,"docs":{},"n":{"df":1,"docs":{"2":{"tf":1.0}}}}}}}}}}}}}},"df":0,"docs":{}},"df":0,"docs":{}}}}}}}}}},"df":0,"docs":{}}}}},"df":0,"docs":{}}}},"df":0,"docs":{}}}},"df":0,"docs":{}}}}}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{}}},"df":0,"docs":{}},"df":0,"docs":{}}}},"df":0,"docs":{}}}}}}}},"s":{"df":0,"docs":{},"k":{"3":{"df":0,"docs":{},"q":{"df":0,"docs":{},"o":{"df":0,"docs":{},"q":{"b":{"df":0,"docs":{},"u":{"df":0,"docs":{},"v":{"d":{"a":{"df":0,"docs":{},"m":{"df":0,"docs":{},"x":{"df":0,"docs":{},"o":{"df":0,"docs":{},"u":{"df":0,"docs":{},"p":{"df":0,"docs":{},"h":{"df":0,"docs":{},"i":{"df":0,"docs":{},"n":{"7":{"df":0,"docs":{},"s":{"df":0,"docs":{},"w":{"c":{"df":0,"docs":{},"v":{"df":0,"docs":{},"k":{"df":0,"docs":{},"q":{"df":0,"docs":{},"n":{"df":0,"docs":{},"g":{"df":0,"docs":{},"q":{"4":{"df":0,"docs":{},"j":{"df":0,"docs":{},"p":{"5":{"df":0,"docs":{},"k":{"df":0,"docs":{},"z":{"df":0,"docs":{},"p":{"b":{"df":0,"docs":{},"w":{"df":0,"docs":{},"w":{"df":0,"docs":{},"n":{"df":0,"docs":{},"n":{"df":0,"docs":{},"w":{"d":{"df":0,"docs":{},"z":{"df":0,"docs":{},"p":{"df":0,"docs":{},"s":{"df":0,"docs":{},"p":{"df":0,"docs":{},"j":{"df":0,"docs":{},"i":{"df":0,"docs":{},"e":{"b":{"df":0,"docs":{},"q":{"df":1,"docs":{"2":{"tf":1.0}}}},"df":0,"docs":{}}}}}}}}},"df":0,"docs":{}}}}}}},"df":0,"docs":{}}}}},"df":0,"docs":{}}}},"df":0,"docs":{}}}}}}}},"df":0,"docs":{}}}},"df":0,"docs":{}}}}}}}}}},"df":0,"docs":{}},"df":0,"docs":{}}}},"df":0,"docs":{}}}}},"df":0,"docs":{}}}},"df":2,"docs":{"3":{"tf":1.0},"4":{"tf":1.4142135623730951}},"s":{"df":0,"docs":{},"y":{".":{"df":0,"docs":{},"j":{"df":0,"docs":{},"s":{"df":0,"docs":{},"o":{"df":0,"docs":{},"n":{"df":1,"docs":{"1":{"tf":1.0}}}}}}},"df":0,"docs":{}}},"t":{"c":{"df":1,"docs":{"1":{"tf":1.0}}},"df":0,"docs":{}}},"f":{"df":0,"docs":{},"i":{"df":0,"docs":{},"e":{"df":0,"docs":{},"l":{"d":{"df":1,"docs":{"3":{"tf":1.0}}},"df":0,"docs":{}}},"l":{"df":0,"docs":{},"e":{"df":1,"docs":{"4":{"tf":1.0}}}},"r":{"df":0,"docs":{},"s":{"df":0,"docs":{},"t":{"df":2,"docs":{"2":{"tf":1.4142135623730951},"3":{"tf":1.4142135623730951}}}}}}},"g":{"df":1,"docs":{"6":{"tf":1.0}},"e":{"df":0,"docs":{},"n":{"df":0,"docs":{},"e":{"df":0,"docs":{},"r":{"df":1,"docs":{"5":{"tf":1.0}}}}}},"h":{"df":0,"docs":{},"o":{"df":0,"docs":{},"s":{"df":0,"docs":{},"t":{"df":0,"docs":{},"n":{"df":0,"docs":{},"e":{"df":0,"docs":{},"t":{"df":1,"docs":{"2":{"tf":1.0}}}}}}}}}},"i":{"df":0,"docs":{},"m":{"df":0,"docs":{},"p":{"df":0,"docs":{},"o":{"df":0,"docs":{},"r":{"df":0,"docs":{},"t":{"df":1,"docs":{"3":{"tf":1.0}}}}}}},"n":{"c":{"df":0,"docs":{},"l":{"df":0,"docs":{},"u":{"d":{"df":1,"docs":{"1":{"tf":1.0}}},"df":0,"docs":{}}}},"df":0,"docs":{},"i":{"df":0,"docs":{},"t":{"df":0,"docs":{},"i":{"df":1,"docs":{"4":{"tf":1.0}}}}},"s":{"df":0,"docs":{},"t":{"a":{"df":0,"docs":{},"l":{"df":4,"docs":{"1":{"tf":1.4142135623730951},"2":{"tf":1.0},"5":{"tf":1.0},"6":{"tf":1.0}}}},"df":0,"docs":{}}},"t":{"a":{"df":0,"docs":{},"l":{"df":1,"docs":{"2":{"tf":1.0}}}},"df":0,"docs":{}}}},"l":{"a":{"df":0,"docs":{},"s":{"df":0,"docs":{},"t":{"df":2,"docs":{"1":{"tf":1.4142135623730951},"4":{"tf":1.0}}}}},"df":0,"docs":{},"i":{"b":{"df":1,"docs":{"1":{"tf":1.0}}},"df":0,"docs":{},"g":{"df":0,"docs":{},"o":{"/":{"df":0,"docs":{},"f":{"a":{"df":1,"docs":{"1":{"tf":1.4142135623730951}}},"df":0,"docs":{}}},"@":{"df":0,"docs":{},"n":{"df":0,"docs":{},"e":{"df":0,"docs":{},"x":{"df":0,"docs":{},"t":{"df":1,"docs":{"1":{"tf":1.0}}}}}}},"df":1,"docs":{"1":{"tf":1.0}}}}}},"m":{"a":{"df":0,"docs":{},"i":{"df":0,"docs":{},"n":{".":{"df":0,"docs":{},"j":{"df":0,"docs":{},"s":{"df":0,"docs":{},"l":{"df":0,"docs":{},"i":{"df":0,"docs":{},"g":{"df":0,"docs":{},"o":{"df":2,"docs":{"1":{"tf":1.0},"4":{"tf":1.0}}}}}}}},"s":{"df":0,"docs":{},"t":{"df":0,"docs":{},"o":{"df":0,"docs":{},"r":{"a":{"df":0,"docs":{},"g":{"df":0,"docs":{},"e":{".":{"df":0,"docs":{},"g":{"df":0,"docs":{},"h":{"df":0,"docs":{},"o":{"df":0,"docs":{},"s":{"df":0,"docs":{},"t":{"df":0,"docs":{},"n":{"df":0,"docs":{},"e":{"df":0,"docs":{},"t":{".":{"df":0,"docs":{},"t":{"df":0,"docs":{},"z":{"df":1,"docs":{"4":{"tf":1.0}}}}},"df":0,"docs":{}}}}}}}}},"m":{"a":{"df":0,"docs":{},"i":{"df":0,"docs":{},"n":{"df":0,"docs":{},"n":{"df":0,"docs":{},"e":{"df":0,"docs":{},"t":{".":{"df":0,"docs":{},"t":{"df":0,"docs":{},"z":{"df":1,"docs":{"4":{"tf":1.0}}}}},"df":0,"docs":{}}}}}}},"df":0,"docs":{}}},"df":0,"docs":{},"l":{"df":0,"docs":{},"i":{"df":0,"docs":{},"s":{"df":0,"docs":{},"t":{".":{"df":0,"docs":{},"j":{"df":0,"docs":{},"s":{"df":0,"docs":{},"l":{"df":0,"docs":{},"i":{"df":0,"docs":{},"g":{"df":0,"docs":{},"o":{"df":1,"docs":{"3":{"tf":1.0}}}}}}}}},"df":0,"docs":{}}}}}}}},"df":0,"docs":{}}}}},"t":{"df":0,"docs":{},"z":{"df":1,"docs":{"4":{"tf":1.4142135623730951}}}}},"df":0,"docs":{}}}},"df":0,"docs":{},"e":{"df":0,"docs":{},"s":{"df":0,"docs":{},"s":{"a":{"df":0,"docs":{},"g":{"df":1,"docs":{"1":{"tf":1.0}}}},"df":0,"docs":{}}}},"o":{"b":{"df":0,"docs":{},"i":{"df":0,"docs":{},"l":{"df":1,"docs":{"5":{"tf":1.4142135623730951}}}}},"df":0,"docs":{}},"u":{"df":0,"docs":{},"l":{"df":0,"docs":{},"t":{"df":0,"docs":{},"i":{"df":0,"docs":{},"s":{"df":0,"docs":{},"i":{"df":0,"docs":{},"g":{"df":1,"docs":{"1":{"tf":1.0}}}}}}}}}},"n":{"df":0,"docs":{},"e":{"df":0,"docs":{},"e":{"d":{"df":1,"docs":{"4":{"tf":1.0}}},"df":0,"docs":{}},"s":{"df":0,"docs":{},"t":{"df":1,"docs":{"6":{"tf":1.0}},"j":{"df":0,"docs":{},"s":{"/":{"c":{"df":0,"docs":{},"l":{"df":0,"docs":{},"i":{"df":1,"docs":{"6":{"tf":1.0}}}}},"df":0,"docs":{}},"df":0,"docs":{}}}}},"t":{"df":0,"docs":{},"w":{"df":0,"docs":{},"o":{"df":0,"docs":{},"r":{"df":0,"docs":{},"k":{"df":0,"docs":{},"n":{"a":{"df":0,"docs":{},"m":{"df":1,"docs":{"2":{"tf":1.0}}}},"df":0,"docs":{}}}}}}},"w":{"df":1,"docs":{"6":{"tf":1.0}}}},"f":{"df":0,"docs":{},"t":{".":{"df":0,"docs":{},"j":{"df":0,"docs":{},"s":{"df":0,"docs":{},"l":{"df":0,"docs":{},"i":{"df":0,"docs":{},"g":{"df":0,"docs":{},"o":{"df":1,"docs":{"1":{"tf":1.0}}}}}}}},"t":{"df":0,"docs":{},"z":{"df":1,"docs":{"3":{"tf":1.0}}}}},"a":{"d":{"d":{"df":0,"docs":{},"r":{"df":0,"docs":{},"e":{"df":0,"docs":{},"s":{"df":0,"docs":{},"s":{"df":1,"docs":{"3":{"tf":1.0}}}}}}},"df":0,"docs":{}},"df":0,"docs":{}},"df":3,"docs":{"1":{"tf":1.0},"3":{"tf":1.4142135623730951},"4":{"tf":1.0}}}},"o":{"df":0,"docs":{},"t":{"df":0,"docs":{},"e":{"df":1,"docs":{"2":{"tf":1.0}}}}},"p":{"df":0,"docs":{},"m":{"df":2,"docs":{"5":{"tf":1.4142135623730951},"6":{"tf":1.0}}}}},"o":{"df":0,"docs":{},"r":{"df":0,"docs":{},"g":{"a":{"df":0,"docs":{},"n":{"df":1,"docs":{"1":{"tf":1.0}}}},"df":0,"docs":{}}},"v":{"df":0,"docs":{},"e":{"df":0,"docs":{},"r":{"df":0,"docs":{},"r":{"df":0,"docs":{},"i":{"d":{"df":1,"docs":{"2":{"tf":1.0}}},"df":0,"docs":{}}}}}}},"p":{"df":0,"docs":{},"l":{"df":0,"docs":{},"u":{"df":0,"docs":{},"g":{"df":0,"docs":{},"i":{"df":0,"docs":{},"n":{"df":1,"docs":{"2":{"tf":1.0}}}}}}},"o":{"df":0,"docs":{},"s":{"df":0,"docs":{},"t":{"df":0,"docs":{},"i":{"df":0,"docs":{},"n":{"df":0,"docs":{},"s":{"df":0,"docs":{},"t":{"a":{"df":0,"docs":{},"l":{"df":1,"docs":{"5":{"tf":1.0}}}},"df":0,"docs":{}}}}}}}},"r":{"df":0,"docs":{},"i":{"df":0,"docs":{},"v":{"a":{"df":0,"docs":{},"t":{"df":0,"docs":{},"e":{"df":0,"docs":{},"k":{"df":0,"docs":{},"e":{"df":0,"docs":{},"y":{"df":1,"docs":{"2":{"tf":1.0}}}}}}}},"df":0,"docs":{}}},"o":{"d":{"df":0,"docs":{},"u":{"c":{"df":0,"docs":{},"t":{"df":1,"docs":{"4":{"tf":1.0}}}},"df":0,"docs":{}}},"df":0,"docs":{},"j":{"df":0,"docs":{},"e":{"c":{"df":0,"docs":{},"t":{"df":1,"docs":{"1":{"tf":1.0}}}},"df":0,"docs":{}}}}},"u":{"b":{"df":0,"docs":{},"l":{"df":0,"docs":{},"i":{"c":{"df":0,"docs":{},"k":{"df":0,"docs":{},"e":{"df":0,"docs":{},"y":{"df":1,"docs":{"2":{"tf":1.0}},"h":{"a":{"df":0,"docs":{},"s":{"df":0,"docs":{},"h":{"df":1,"docs":{"2":{"tf":1.0}}}}},"df":0,"docs":{}}}}}},"df":0,"docs":{}}}},"df":0,"docs":{}}},"r":{"df":0,"docs":{},"e":{"df":0,"docs":{},"g":{"df":0,"docs":{},"i":{"df":0,"docs":{},"s":{"df":0,"docs":{},"t":{"df":0,"docs":{},"r":{"df":0,"docs":{},"i":{"df":2,"docs":{"1":{"tf":1.0},"4":{"tf":1.4142135623730951}}}}}}}}},"u":{"df":0,"docs":{},"l":{"df":0,"docs":{},"e":{"df":1,"docs":{"1":{"tf":1.0}}}},"n":{"df":3,"docs":{"1":{"tf":1.0},"5":{"tf":1.4142135623730951},"6":{"tf":1.4142135623730951}}}}},"s":{"df":0,"docs":{},"l":{"df":0,"docs":{},"i":{"d":{"df":0,"docs":{},"e":{"df":1,"docs":{"1":{"tf":1.0}}}},"df":0,"docs":{}}},"t":{"a":{"df":0,"docs":{},"r":{"df":0,"docs":{},"t":{":":{"d":{"df":0,"docs":{},"e":{"df":0,"docs":{},"v":{"df":1,"docs":{"6":{"tf":1.0}}}}},"df":0,"docs":{}},"df":1,"docs":{"5":{"tf":1.0}}}}},"df":0,"docs":{},"o":{"df":0,"docs":{},"r":{"a":{"df":0,"docs":{},"g":{"df":1,"docs":{"4":{"tf":1.7320508075688772}}}},"df":0,"docs":{}}},"r":{"df":0,"docs":{},"i":{"c":{"df":0,"docs":{},"t":{"df":1,"docs":{"6":{"tf":1.0}}}},"df":0,"docs":{}}}}},"t":{"a":{"df":0,"docs":{},"q":{"/":{"c":{"df":0,"docs":{},"o":{"df":0,"docs":{},"n":{"df":0,"docs":{},"f":{"df":0,"docs":{},"i":{"df":0,"docs":{},"g":{".":{"df":0,"docs":{},"l":{"df":0,"docs":{},"o":{"c":{"a":{"df":0,"docs":{},"l":{".":{"df":0,"docs":{},"t":{"df":0,"docs":{},"e":{"df":0,"docs":{},"s":{"df":0,"docs":{},"t":{"df":0,"docs":{},"i":{"df":0,"docs":{},"n":{"df":0,"docs":{},"g":{".":{"df":0,"docs":{},"j":{"df":0,"docs":{},"s":{"df":0,"docs":{},"o":{"df":0,"docs":{},"n":{"df":1,"docs":{"2":{"tf":1.0}}}}}}},"df":0,"docs":{}}}}}}}}},"df":0,"docs":{}}},"df":0,"docs":{}},"df":0,"docs":{}}}},"df":0,"docs":{}}}}}}},"df":0,"docs":{}},"_":{"df":0,"docs":{},"l":{"df":0,"docs":{},"i":{"df":0,"docs":{},"g":{"df":0,"docs":{},"o":{"_":{"df":0,"docs":{},"i":{"df":0,"docs":{},"m":{"a":{"df":0,"docs":{},"g":{"df":0,"docs":{},"e":{"=":{"df":0,"docs":{},"l":{"df":0,"docs":{},"i":{"df":0,"docs":{},"g":{"df":0,"docs":{},"o":{"df":0,"docs":{},"l":{"a":{"df":0,"docs":{},"n":{"df":0,"docs":{},"g":{"/":{"df":0,"docs":{},"l":{"df":0,"docs":{},"i":{"df":0,"docs":{},"g":{"df":0,"docs":{},"o":{":":{"0":{".":{"6":{"5":{".":{"0":{"df":2,"docs":{"1":{"tf":1.7320508075688772},"4":{"tf":1.0}}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{}}}}}},"df":0,"docs":{}}}},"df":0,"docs":{}}}}}}},"df":0,"docs":{}}}},"df":0,"docs":{}}}},"df":0,"docs":{}}}}}},"df":5,"docs":{"1":{"tf":2.23606797749979},"2":{"tf":1.0},"3":{"tf":1.0},"4":{"tf":1.7320508075688772},"5":{"tf":1.4142135623730951}},"o":{"df":0,"docs":{},"p":{"df":0,"docs":{},"e":{"df":0,"docs":{},"r":{"a":{"df":0,"docs":{},"t":{"df":0,"docs":{},"o":{"df":0,"docs":{},"r":{"a":{"c":{"c":{"df":0,"docs":{},"o":{"df":0,"docs":{},"u":{"df":0,"docs":{},"n":{"df":0,"docs":{},"t":{"df":1,"docs":{"2":{"tf":1.0}}}}}}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{}}}}},"df":0,"docs":{}}}}},"u":{"df":0,"docs":{},"e":{"df":0,"docs":{},"r":{"df":0,"docs":{},"i":{"a":{"/":{"df":0,"docs":{},"p":{"df":0,"docs":{},"l":{"df":0,"docs":{},"u":{"df":0,"docs":{},"g":{"df":0,"docs":{},"i":{"df":0,"docs":{},"n":{"df":3,"docs":{"1":{"tf":1.0},"2":{"tf":1.0},"5":{"tf":1.0}}}}}}}}},"df":0,"docs":{}},"df":0,"docs":{}}}},"i":{"df":0,"docs":{},"t":{"df":0,"docs":{},"o":{"df":1,"docs":{"2":{"tf":1.0}}}}}}}},"df":0,"docs":{},"e":{"df":0,"docs":{},"s":{"df":0,"docs":{},"t":{".":{"df":0,"docs":{},"j":{"df":0,"docs":{},"s":{"df":0,"docs":{},"l":{"df":0,"docs":{},"i":{"df":0,"docs":{},"g":{"df":0,"docs":{},"o":{"df":1,"docs":{"1":{"tf":1.0}}}}}}}}},"df":3,"docs":{"1":{"tf":1.4142135623730951},"3":{"tf":1.0},"4":{"tf":1.0}}}},"z":{"df":0,"docs":{},"o":{"df":7,"docs":{"0":{"tf":1.7320508075688772},"1":{"tf":1.4142135623730951},"2":{"tf":1.0},"3":{"tf":1.0},"4":{"tf":1.0},"5":{"tf":1.0},"6":{"tf":1.0}}}}},"i":{"df":0,"docs":{},"m":{"df":0,"docs":{},"e":{"df":1,"docs":{"2":{"tf":1.0}}}}},"y":{"df":0,"docs":{},"p":{"df":0,"docs":{},"e":{"df":1,"docs":{"5":{"tf":1.4142135623730951}}}}},"z":{"1":{"df":0,"docs":{},"v":{"df":0,"docs":{},"s":{"df":0,"docs":{},"u":{"df":0,"docs":{},"r":{"8":{"df":0,"docs":{},"w":{"df":0,"docs":{},"w":{"df":0,"docs":{},"n":{"df":0,"docs":{},"h":{"df":0,"docs":{},"l":{"a":{"df":0,"docs":{},"z":{"df":0,"docs":{},"e":{"df":0,"docs":{},"m":{"df":0,"docs":{},"p":{"df":0,"docs":{},"o":{"c":{"df":0,"docs":{},"h":{"5":{"d":{"6":{"df":0,"docs":{},"h":{"df":0,"docs":{},"l":{"df":0,"docs":{},"r":{"df":0,"docs":{},"i":{"df":0,"docs":{},"t":{"df":0,"docs":{},"h":{"8":{"c":{"df":0,"docs":{},"j":{"c":{"df":0,"docs":{},"j":{"b":{"df":1,"docs":{"2":{"tf":1.0}}},"df":0,"docs":{}}},"df":0,"docs":{}}},"df":0,"docs":{}},"df":0,"docs":{}}}}}}}},"df":0,"docs":{}},"df":0,"docs":{}},"df":0,"docs":{}}},"df":0,"docs":{}}}}}}},"df":0,"docs":{}}}}}}},"df":0,"docs":{}}}}}},"df":0,"docs":{}}},"v":{"df":0,"docs":{},"e":{"df":0,"docs":{},"r":{"df":0,"docs":{},"s":{"df":0,"docs":{},"i":{"df":0,"docs":{},"o":{"df":0,"docs":{},"n":{"df":1,"docs":{"1":{"tf":1.4142135623730951}}}}}}}}},"y":{"a":{"df":0,"docs":{},"r":{"df":0,"docs":{},"n":{"df":1,"docs":{"6":{"tf":1.4142135623730951}}}}},"df":0,"docs":{}}}},"title":{"root":{"a":{"df":0,"docs":{},"p":{"df":0,"docs":{},"p":{"df":2,"docs":{"5":{"tf":1.0},"6":{"tf":1.0}}}}},"b":{"a":{"c":{"df":0,"docs":{},"k":{"df":0,"docs":{},"e":{"df":0,"docs":{},"n":{"d":{"df":1,"docs":{"6":{"tf":1.0}}},"df":0,"docs":{}}}}},"df":0,"docs":{}},"df":0,"docs":{},"u":{"df":0,"docs":{},"i":{"df":0,"docs":{},"l":{"d":{"df":1,"docs":{"1":{"tf":1.0}}},"df":0,"docs":{}}}}},"c":{"df":0,"docs":{},"o":{"df":0,"docs":{},"m":{"df":0,"docs":{},"m":{"df":0,"docs":{},"u":{"df":0,"docs":{},"n":{"df":1,"docs":{"0":{"tf":1.0}}}}},"p":{"df":0,"docs":{},"i":{"df":0,"docs":{},"l":{"df":1,"docs":{"1":{"tf":1.0}}}}}}}},"d":{"df":0,"docs":{},"e":{"df":0,"docs":{},"p":{"df":0,"docs":{},"l":{"df":0,"docs":{},"o":{"df":0,"docs":{},"y":{"df":1,"docs":{"2":{"tf":1.0}}}}}}}},"df":0,"docs":{},"f":{"df":0,"docs":{},"i":{"df":0,"docs":{},"r":{"df":0,"docs":{},"s":{"df":0,"docs":{},"t":{"df":1,"docs":{"3":{"tf":1.0}}}}}}},"m":{"df":0,"docs":{},"o":{"b":{"df":0,"docs":{},"i":{"df":0,"docs":{},"l":{"df":1,"docs":{"5":{"tf":1.0}}}}},"df":0,"docs":{}}},"n":{"df":0,"docs":{},"f":{"df":0,"docs":{},"t":{"df":1,"docs":{"3":{"tf":1.0}}}}},"r":{"df":0,"docs":{},"e":{"df":0,"docs":{},"g":{"df":0,"docs":{},"i":{"df":0,"docs":{},"s":{"df":0,"docs":{},"t":{"df":0,"docs":{},"r":{"df":0,"docs":{},"i":{"df":1,"docs":{"4":{"tf":1.0}}}}}}}}}},"t":{"df":0,"docs":{},"e":{"df":0,"docs":{},"z":{"df":0,"docs":{},"o":{"df":1,"docs":{"0":{"tf":1.0}}}}}}}}},"lang":"English","pipeline":["trimmer","stopWordFilter","stemmer"],"ref":"id","version":"0.9.5"},"results_options":{"limit_results":20,"teaser_word_count":30},"search_options":{"bool":"AND","expand":true,"fields":{"body":{"boost":1},"breadcrumbs":{"boost":2},"title":{"boost":2}}}});