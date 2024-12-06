import { fileURLToPath } from "url";

export const catalogRoot = fileURLToPath(new URL('../catalog', import.meta.url));
export const catalogStaticRoot = fileURLToPath(new URL('../catalog/static', import.meta.url));
