---
sidebar_position: 2
---

# Create new wallets

The first time we go to the website, we shall see two options in the center, `New Wallet` and `Import Wallet`, as the figure shows.

<figure><img src="../.gitbook/assets/image (7).png" alt=""></img><figcaption></figcaption></figure>

Let’s click `New Wallet` to create our first blankly new multisig wallet! Before we start the creation process, it’s required to log in to our Tezos account. The purpose of login is to make Tezos operations, such as contract origination, transaction, etc. In this case, we are going to originate a TzSafe contract later.

<figure><img src="../.gitbook/assets/image (54).png" alt=""></img><figcaption></figcaption></figure>

Now, we follow the step on UI to finish the remaining process of creation. First, name our wallet. The name is only stored in our browser locally. Therefore, no one will know what name we use for our wallet.

<figure><img src="../.gitbook/assets/image (4).png" alt=""></img><figcaption></figcaption></figure>

Then, click `Continue` to proceed to the second step. The name can be changed on the `Address book` page later. Next, we will need to finish the setting as the figure shows.

<figure><img src="../.gitbook/assets/image (61).png" alt=""></img><figcaption></figcaption></figure>

By default, TzSafe will put our Tezos account as an owner in `Owner Address`_._ We can add more owners here. It’s strongly recommended that add more owners. Please be extra careful here. If we aren’t one of the owners, we will lose control of the newly created wallet forever.

The `Owner Name` is optional. We may or may not fill it in but filling it is recommended that will help us easily identify Tezos account. If we don’t fill it, TzSafe will present in Tezos address.

`Threshold` depends on the use case. In the above figure, the threshold is selected as `2/3`, indicating we are going to create a 2-of-3 TzSafe wallet. To be more specific, to successfully proceed any transaction on the wallet, we need at least two approvals from of its owners.&#x20;

`Proposal duration` is the lifetime of the proposal. A proposal can be approved by its owners only during its proposal duration. In the case of proposal exceeding its duration, any owner of the wallet can resolve it immediately but will not be executed. Then it will just be archived and put on the `history` page.

Notice that before we proceed the next step, please make sure that we are one of the owners. The rest of the settings could be adjusted later by issuing proposals on the `setting` page.

Finally, click `Continue` and wait for the wallet creation. It will need to a few minutes for confirmation.

<img src="../.gitbook/assets/image (3).png" alt=""></img>

If a wallet has been created successfully, we will see as follow:

Currently, the creation fee, which is a one-time fee, is around 1.62 XTZ, depending on the number of owners.\

<figure><img src="../.gitbook/assets/image (44).png" alt=""></img></figure>
