import { ConfigEnv, defineConfig } from 'vitest/config'

import express from "./express.plugin"
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react(), express("/server")],
//   test: {
//     globals: true,
//     environment: 'jsdom',
//     setupFiles: ['./vitest.setup.ts']
//   },
//   server:{
//     port: process.env.PORT || 5173
//   }
// })

export default defineConfig(({ command }: ConfigEnv) => {
  const isProduction = command === 'build';
  const port: number = Number(process.env.PORT) || 5173;

  return {
    plugins: [react(), express("/server")],
    server: {
      port,
      host: "0.0.0.0"
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./vitest.setup.ts']
    },
  };
});
