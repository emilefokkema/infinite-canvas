import { TestCasesLib } from "./test-cases-lib"
import { TestPageLib } from "./test-page-lib"

declare global{
    interface Window{
        TestPageLib: TestPageLib
        TestCasesLib: TestCasesLib
    }
}

export {}