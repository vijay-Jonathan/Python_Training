import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// 5100/8100 rather than Vite's 5173 and FastAPI's 8000: those belong to the Labs platform,
// and a generated application running beside it must not fight it for a port.
const PORT = 5100;
const DEFAULT_BACKEND = "http://127.0.0.1:8100";

// Same-origin in development: the app calls `/api/...` and Vite forwards to FastAPI, so
// CORS stays out of the dev loop and the API base never differs between environments.
//
// The target is configuration, not a constant, because several generated applications
// eventually run at once and cannot all own one port. It is read with `loadEnv` rather
// than from `process.env`, so a `.env` file in this directory is enough to point the app
// at a different backend — no exported shell variable required.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    server: {
      port: PORT,
      proxy: {
        "/api": {
          target: env.VITE_PROXY_TARGET || DEFAULT_BACKEND,
          changeOrigin: true,
        },
      },
    },
    // `vite preview` inherits the port and the proxy above, but not this.
    //
    // Vite rejects any request whose Host header it does not recognise, which
    // is a defence against DNS rebinding and is why a preview opened by its
    // hostname rather than as localhost otherwise answers with a blank page and
    // "host not allowed". Labs serves previews from a container reached by
    // whatever name the deployment has, so the set of valid hosts is not
    // knowable here. Safe to open up because the server holds nothing to
    // rebind to: it serves this application's own static build, and the one
    // thing it proxies is that application's backend.
    preview: {
      allowedHosts: true,
    },
  };
});
