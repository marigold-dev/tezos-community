---
sidebar_position: 6
---

# Sign, Reject and Resolve Proposals

After proposals have been created, their state will represent it on the proposals page sorting by creating time, as the figure shows. Users can click them to see more details.&#x20;

<figure><img src="./img/image (59).png" alt=""/><figcaption></figcaption></figure>

We can also interact with the proposals by signing, rejecting, or resolving them based on the conditions of the proposals.

- Signing proposals means owners give their approvals
- Rejecting proposals means owners disagree with the proposals.
- Resolving proposals means owners can
  - execute and archive the proposals if acquiring sufficient approvals.
  - archive the proposals if the proposals exceed their duration
  - archive the proposals if the proposals are rejected by most of the owners so they can’t pass the threshold to execute.

It’s possible to sign (or reject) and resolve at the same time If some conditions are satisfied. After proposals are resolved successfully, they will be archived and presented on the history page. Notice that only the owners of the wallet are permitted to interact with it.

The following is using a 2-of-2 TzSafe wallet as an example.

### Case: Sign and Resolve Proposal 1 <a href="#4aa78d07-9469-4fbe-9ad8-ca0556852e43" id="4aa78d07-9469-4fbe-9ad8-ca0556852e43"></a>

For the whole new proposal, we shall see two buttons for rejecting and signing as above picture. When clicking either button, we shall see a pop-up window for confirming the action as below figure. Clicking Confirm will process the sign action in this case.

<figure><img src="./img/image (58).png" alt=""/><figcaption></figcaption></figure>

The stats of the proposal will change to `Waiting for signers`, which means it is pending another owner’s action.

<figure><img src="./img/image (21).png" alt=""/><figcaption></figcaption></figure>

Once the proposal accumulates sufficient approvals, we may see a resolve button there. By clicking it, the window will pop up and ask for confirmation.

<figure><img src="./img/image (34).png" alt=""/><figcaption></figcaption></figure>

We can double-check the proposal and then click `Confirm`. The proposal should be resolved, executed, and archived on the history page.

<figure><img src="./img/image (46).png" alt=""/><figcaption></figcaption></figure>

### Case: Sign and Resolve Proposal 2 <a href="#abeceeda-381c-46e0-980b-eb8a0323a014" id="abeceeda-381c-46e0-980b-eb8a0323a014"></a>

The below figure is another example, if looking at the details of proposal 2, another approval is already there. In this case, we can try to sign and resolve the proposal at the same time. First, we click `Sign`.

<figure><img src="./img/image (8).png" alt=""/><figcaption></figcaption></figure>

We should see the trying to resolve option represented on the popped-up windows. We select “yes” and click `Confirm` to resolve the proposal.

<figure><img src="./img/image (28).png" alt=""/><figcaption></figcaption></figure>

### Case: Fail to Resolve Proposal <a href="#544a2e9e-4625-4305-ad56-39bc95ac8f94" id="544a2e9e-4625-4305-ad56-39bc95ac8f94"></a>

Sometimes, proposals may be not successfully resolved. For example, the following proposal proposes to transfer an amount that is more than the wallet has. Therefore, if we are trying to resolve the proposal, which can’t be actually resolved, the failed message will be present after clicking `Confirm`.

<figure><img src="./img/image (31).png" alt=""/><figcaption></figcaption></figure>

<figure><img src="./img/image (27).png" alt=""/><figcaption></figcaption></figure>

The error will show as above. We can see more detail there. In this case, the error results from insufficient balance. Either owner can fund more money into the wallet, or reject the proposal.

### Case: Resolve Expired Proposal <a href="#c19b6f64-f1b9-40e8-aadd-088b9eb8883b" id="c19b6f64-f1b9-40e8-aadd-088b9eb8883b"></a>

If none of the owners resolve proposals within the proposal duration, the state of the proposals will become expired. Any owners can click resolved to archive the proposals.

<figure><img src="./img/image (20).png" alt=""/><figcaption></figcaption></figure>
