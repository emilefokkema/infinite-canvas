import 'vitest'
import { Options as PageFactoryOptions } from '../../e2e-test-utils/page-factory/shared/options'

declare module 'vitest' {
    
    export interface ProvidedContext {
      pageFactoryOptions: PageFactoryOptions
    }
  }