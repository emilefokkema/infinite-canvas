module.exports = function(snapshotSuffix, deltaYDistortion){
    return {
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
                globals: {
                    __SNAPSHOT_SUFFIX__: snapshotSuffix,
                    __DELTAY_DISTORTION__: deltaYDistortion
                }
            },
            {
                displayName: '1/3',
                testRegex: 'test-case\\.spec\\.ts$',
                globals: {
                    __TEST_CASE_MOD__: 0,
                    __SNAPSHOT_SUFFIX__: snapshotSuffix,
                    __DELTAY_DISTORTION__: deltaYDistortion
                }
            },
            {
                displayName: '2/3',
                testRegex: 'test-case\\.spec\\.ts$',
                globals: {
                    __TEST_CASE_MOD__: 1,
                    __SNAPSHOT_SUFFIX__: snapshotSuffix,
                    __DELTAY_DISTORTION__: deltaYDistortion
                }
            },
            {
                displayName: '3/3',
                testRegex: 'test-case\\.spec\\.ts$',
                globals: {
                    __TEST_CASE_MOD__: 2,
                    __SNAPSHOT_SUFFIX__: snapshotSuffix,
                    __DELTAY_DISTORTION__: deltaYDistortion
                }
            }
        ]
      };
};