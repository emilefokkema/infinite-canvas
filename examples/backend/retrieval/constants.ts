import { fileURLToPath } from 'url'

export const catalogPath = fileURLToPath(new URL('../../catalog', import.meta.url));
export const testCasesPath = fileURLToPath(new URL('../../../test-e2e/test-cases', import.meta.url))
export const testCasesStaticPath = fileURLToPath(new URL('../../../test-e2e/test-cases/static', import.meta.url))