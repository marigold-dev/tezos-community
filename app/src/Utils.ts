import { Organization } from "./App";

export const getStatusColor = (org: Organization): string => {
  return "aCTIVE" in org.status
    ? "success"
    : "fROZEN" in org.status
    ? "danger"
    : "warning";
};
