import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";

const devConfig = {
  server: {
    // host: "https://test-rr.treibaer.de",
  },
};
const prodConfig = {
  server: {
    host: "https://rt.treibaer.de",
    https: {
      key: fs.readFileSync(
        path.resolve("/etc/letsencrypt/live/treibaer.de", "privkey.pem")
      ),
      cert: fs.readFileSync(
        path.resolve("/etc/letsencrypt/live/treibaer.de", "cert.pem")
      ),
    },
  },
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  ...(process.env.NODE_ENV === "development" ? devConfig : prodConfig),
});
