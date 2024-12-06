import { fileURLToPath } from "url";
import { InlineConfig } from "vite";
import { addDarkTheme } from "../../../utils/dark-theme/vite-plugin";
import { addTestCasesList } from "../../../test-cases/vite-plugins";
import { addInfiniteCanvas } from "../../../src/add-infinite-canvas";

export function createViteConfig(): InlineConfig{
    const root = fileURLToPath(new URL('.', import.meta.url))
    return { 
        root,
        plugins: [addDarkTheme(), addTestCasesList(), addInfiniteCanvas()]
     }
}