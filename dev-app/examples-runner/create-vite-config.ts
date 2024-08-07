import http from 'http'
import { InlineConfig } from "vite";
import { fileURLToPath } from "url";
import { addRunner } from './add-runner'
import { PORT } from "../backend/constants";

export function createViteConfig(server: http.Server): InlineConfig{
    const root = fileURLToPath(new URL('.', import.meta.url));
    return {
        root,
        optimizeDeps: {
            exclude: ['virtual:test-cases-list', 'infinite-canvas']
        },
        plugins: [addRunner({port: PORT, server})],
        server: {
            middlewareMode: { server: server },
            hmr: {
                port: PORT,
                server: server
            }
        }
    };
}