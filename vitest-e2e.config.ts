import { defineConfig } from 'vitest/config'
import { addTestCasesMetadataList } from './test-cases/vite-plugins'
import { getCurrentEnvironment } from './e2e-test-utils/environments/environments'
import { join, dirname, basename } from 'path'

export default defineConfig(() => {
  const currentEnvironment = getCurrentEnvironment();
  return {
    test: {
      include: ['e2e/tests/**/*.spec.ts'],
      globalSetup: ["e2e/setup/index.ts"],
      setupFiles: ["e2e/tests/test-page/setup.ts"],
      hookTimeout: 120000,
      testTimeout: 120000,
      reporters: ['dot'],
      resolveSnapshotPath(path: string, extension: string): string {
        return join(dirname(path), '__snapshots__', currentEnvironment.id, `${basename(path)}${extension}`)
      },
      env: {
        SNAPSHOT_ENVIRONMENT: currentEnvironment.id
      }
    },
    plugins: [addTestCasesMetadataList()],
  }
})