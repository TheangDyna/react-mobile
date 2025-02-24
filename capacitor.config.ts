import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.example.app",
  appName: "react-mobile",
  webDir: "dist",
  server: {
    androidScheme: "https",
    url: "http://192.168.3.189:5173",
    cleartext: true,
  },
};

export default config;
