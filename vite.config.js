import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";

export default defineConfig(({ mode }) => {
  if (mode === "development") {
    return {
      plugins: [react()],
      server: {
        // host: "https://test-rr.treibaer.de",
      },
    };
  } else if (mode === "production") {
    return {
      plugins: [react()],
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
  }
});
