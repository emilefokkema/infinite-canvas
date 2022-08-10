module.exports = {
    transform: {
      '^.+\\.tsx?$': 'ts-jest',
    },

    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    globalSetup: './setup.js',
    globalTeardown: './teardown.js',
    bail: true,
    testTimeout: 10000,
    projects: [
        {
            testRegex: '^(?:(?!test-case\\.spec\\.ts$).)*\\.spec\\.ts$',
        },
        {
            displayName: '1/3',
            testRegex: 'test-case\\.spec\\.ts$',
            globals: {
                __TEST_CASE_MOD__: 0
            }
        },
        {
            displayName: '2/3',
            testRegex: 'test-case\\.spec\\.ts$',
            globals: {
                __TEST_CASE_MOD__: 1
            }
        },
        {
            displayName: '3/3',
            testRegex: 'test-case\\.spec\\.ts$',
            globals: {
                __TEST_CASE_MOD__: 2
            }
        }
    ]
  }
