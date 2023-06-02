import { Organization } from "./App";

export const getStatusColor = (org: Organization): string => {
  return "active" in org.status
    ? "success"
    : "frozen" in org.status
    ? "danger"
    : "warning";
};
