import { fileURLToPath } from "url";
import { InlineConfig } from "vite";
import { TestCaseRunnerOptions } from "./options";
import { addDarkTheme } from "../../../utils/dark-theme/vite-plugin";
import { addTestCasesList } from "../../../test-cases/vite-plugins";

export function createViteConfig({infiniteCanvasPath}: TestCaseRunnerOptions): InlineConfig{
    const root = fileURLToPath(new URL('.', import.meta.url))
    return { 
        root,
        resolve: {
            alias: {
                'infinite-canvas': infiniteCanvasPath
            }
        },
        plugins: [addDarkTheme(), addTestCasesList()]
     }
}