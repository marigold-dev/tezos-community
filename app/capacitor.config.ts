import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "dev.marigold.tzcommunity",
  appName: "TzCommunity",
  webDir: "dist",
  server: {
    androidScheme: "https",
  },
};

export default config;
