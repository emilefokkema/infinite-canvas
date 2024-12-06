import { fileURLToPath } from 'url'

export const outDirPath = fileURLToPath(new URL('../dist', import.meta.url))