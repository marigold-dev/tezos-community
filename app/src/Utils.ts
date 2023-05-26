import { Organization, UserProfile } from "./App";

export const getStatusColor = (org: Organization): string => {
  return "active" in org.status
    ? "success"
    : "frozen" in org.status
    ? "danger"
    : "warning";
};

export const getUserProfile = async (
  userAddress: string,
  accessToken: string
): Promise<UserProfile | null> => {
  const response = await fetch(
    process.env.REACT_APP_BACKEND_URL + "/user/" + userAddress,
    {
      method: "GET",
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    }
  );
  const json = await response.json();
  if (response.ok) {
    json.proofDate = new Date(json.proofDate); //convert dates
    return new Promise((resolve, reject) => resolve(json));
  } else {
    return new Promise((resolve, reject) => resolve(null));
  }
};
