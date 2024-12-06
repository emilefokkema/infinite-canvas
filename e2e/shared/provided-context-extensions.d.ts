import 'vitest'
import { Options as PageFactoryOptions } from '../../e2e-test-utils/page-factory/shared/options'
import { Options as RuntimeEventTargetOptions } from '../../e2e-test-utils/runtime-event-target/shared/options'

declare module 'vitest' {
    
    export interface ProvidedContext {
      pageFactoryOptions: PageFactoryOptions,
      runtimeEventTargetOptions: RuntimeEventTargetOptions
    }
  }