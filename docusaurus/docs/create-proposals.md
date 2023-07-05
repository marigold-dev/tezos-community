---
sidebar_position: 5
---

# Create Proposals

The big difference from the Tezos account, or so-called single-signature account, is that

- The process of creating a proposal is mandatory for every transaction made from the TzSafe wallet.
- batch transactions are allowed in TzSafe wallet.

TzSafe supports the following types of transaction at the moment, with more to be added in the near future.

Notice that creating a proposal without any transaction is forbidden.

## Supported Transaction <a href="#a5cb9fb8-9973-4df8-8989-a4ba408d59f3" id="a5cb9fb8-9973-4df8-8989-a4ba408d59f3"></a>

### XTZ **Transfer** <a href="#1aa35605-14f1-4b72-99d8-f00991851324" id="1aa35605-14f1-4b72-99d8-f00991851324"></a>

This transaction allows us to transfer XTZ to the target account, including all `tz` accounts and `KT` accounts, which have a `%defaut` entrypoint with `unit` type.

First, click `New Proposal` on the sidebar. Then, click `Transfer`. Filling in the amount and the target address on UI. Before submitting, please double-check the address and transfer amount. Finally, click `Submit` to create our new proposal.

<figure><img src=".../../../../img/image (42).png" alt=""/><figcaption></figcaption></figure>

Note that TzSafe doesn’t validate transferring amount is equal to or greater than the balance while the proposal is being created. The validation only happens when the proposal is executed. In other words, it's possible to fund an insufficient wallet before the proposal is executed.

### FA1.2 Approve

TzSafe provides support for approvals of FA1.2 tokens, allowing users to authorize the spending of tokens.&#x20;

To create a new proposal, navigate to the sidebar and click on `New Proposal`. From there, select the option for `FA1.2 Approve`. To grant approval, fill in the desired token and amount and the spender's address. Once the information is filled out, click the \`Submit\` button to complete the approval proposal.

<figure><img src=".../../../../img/image (23).png" alt=""/><figcaption></figcaption></figure>

### FA1.2 Transfer

TzSafe also offers the capability to perform transfers for FA1.2 tokens. To create a new proposal, simply access the sidebar and click on `New Proposal`. Then, select the `FA1.2 Transfer` option from the available choices. Select the desired token, specify the amount, and provide the transfer-to address. Finally, click `Submit` to click a proposal.

<figure><img src=".../../../../img/image (55).png" alt=""/><figcaption></figcaption></figure>

### **FA2 Transfer**

TzSafe also provides support for transferring FA2 tokens. Currently, it allows for the transfer of multiple tokens within a single transaction, but with the restriction that all tokens must belong to the same FA2 contract. In cases where the FA2 tokens are spread across different contracts, it becomes necessary to create separate transactions for each contract involved.

To create a new proposal, navigate to the sidebar and click on `New Proposal`. From there, select the option for `FA2 Transfer`. Choose an FA2 token and specify the desired amount and the recipient's address. When adding a second token, please note that it must belong to the same FA2 contract as the first token. Finally, click the `Submit` button to create your new proposal.

<figure><img src=".../../../../img/image (15).png" alt=""/><figcaption></figcaption></figure>

### **Contract Execution**

Contract execution allows us to create a proposal to execute arbitrary Tezos contracts. Besides `FA2 Transfer`, we can also use `Contract Execution` to perform a transfer.&#x20;

Taking an FA2 contract as an example, click `New Proposal` on the sidebar and select `Contract Execution`. Next, fill in a target address and the amount sent to the address. In this case, we fill FA2 address, `KT1Gh6T9CjpxEV6WxCzgExhrATEYtcLN5Fdp`, and amount 0.

<figure><img src=".../../../../img/image (19).png" alt=""/><figcaption></figcaption></figure>

After click `Continue`, TzSafe will check if the contract of the given address exists. If so, we can see the contract parameters rendered on the page, as the following shows.

<figure><img src=".../../../../img/image (25).png" alt=""/><figcaption></figcaption></figure>

To transfer FA2 tokens, we select the entrypoint `transfer` and click `Add item` to fill in the details. Finally, click the `Submit` button to create a new proposal. As the same as the transaction of transferring XTZ, an insufficient amount can be funded after proposal creation is done.

### **Batch**

Sometimes we want to perform several transactions at the same time. In TzSafe, we can achieve it by using batch. A batch of transactions is _atomic_, which means any one of the transactions in one batch fails, all transactions fail.

This is useful when we want to _exchange_ assets with others. For example, if we want to buy the NFT of Alice in 5XTZ, we will make two transactions as a batch. First, transfer 5XTZ to Alics. Second, call Alice’s contract to transfer NFT. We may want to have a third transaction to ensure NFT is in your name. Therefore, we can safely make a swap.

The following is the figure showing a batch. Users can click any type of transaction to add it and click `Submit` all transactions at once. It is important to note that the indexes indicate the order in which the transactions will be executed.

<figure><img src="../../img/image (10).png" alt=""/><figcaption></figcaption></figure>
