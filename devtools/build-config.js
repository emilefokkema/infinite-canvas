const path = require('path');
const fs = require('fs');

const tempDir = path.join(__dirname, 'temp');
const useCaseDir = path.resolve(__dirname, 'use-case');
const tempUseCaseDir = path.resolve(tempDir, 'use-case');
const tempPlaygroundDir = path.join(tempDir,'playground');
const infiniteCanvasWebpackConfig = require('../infinite-canvas-webpack-config')(tempDir, false);
const playgroundConfig = require('../playground/build-config')(tempPlaygroundDir, true);

function createTestCasesScript(){
    if(!fs.existsSync(tempDir)){
        fs.mkdirSync(tempDir);
    }
    const testCasesFilePath = path.join(tempDir, 'test-cases.js');
    const testCasesDirName = 'test-cases';
    const testCaseFiles = fs.readdirSync(path.resolve(__dirname, `../test/${testCasesDirName}`));
    let importSection = '';
    let mappingSection = '';
    let testCaseIndex = 0;
    let testCaseMappedIdentifiers = [];
    for(let testCaseFile of testCaseFiles){
        const extensionStripped = testCaseFile.replace(/\.js$/,'');
        const testCaseIdentifier = `case${testCaseIndex++}`;
        const testCaseMappedIdentifier = `${testCaseIdentifier}Mapped`;
        testCaseMappedIdentifiers.push(testCaseMappedIdentifier);
        importSection += `import ${testCaseIdentifier} from '../../test/${testCasesDirName}/${extensionStripped}';\n`;
        mappingSection += `const ${testCaseMappedIdentifier} = {id: '${extensionStripped}', definition: ${testCaseIdentifier}};\n`
    }
    const script = importSection + mappingSection + `export default [${testCaseMappedIdentifiers.join(',')}]`;
    fs.writeFileSync(testCasesFilePath, script);
}

function getUseCaseBuildStep(useCaseManifest, dirPath, useCaseTempDirPath){
    const fileNamesToCopy = [useCaseManifest.page, 'manifest.json'].concat(useCaseManifest.styles || []);
    const scriptsToBuild = useCaseManifest.scripts || [];
    const parallelSteps = [];
    if(fileNamesToCopy.length){
        parallelSteps.push({
            type: 'copyFiles',
            source: dirPath,
            destination: useCaseTempDirPath,
            fileNames: fileNamesToCopy
        });
    }
    if(scriptsToBuild.length){
        parallelSteps.push({
            type: 'buildScripts',
            source: dirPath,
            destination: useCaseTempDirPath,
            fileNames: scriptsToBuild
        });
    }
    return {
        parallel: parallelSteps
    };
}

module.exports = function(){
    return {
        steps: [
            {
                async run(watch, forProduction, build){
                    const useCasesDir = path.resolve(__dirname, 'use-cases');
                    const contents = fs.readdirSync(useCasesDir, {withFileTypes: true});
                    const dirNames = contents.filter(dirent => dirent.isDirectory()).map(dirent => dirent.name);
                    const steps = [];
                    const shortDefinitions = [];
                    for(let dirName of dirNames){
                        const dirPath = path.resolve(useCasesDir, dirName);
                        const useCaseTempDirPath = path.resolve(tempDir, 'use-cases', dirName);
                        const manifestPath = path.resolve(dirPath, 'manifest.json');
                        if(!fs.existsSync(manifestPath)){
                            continue;
                        }
                        const manifest = JSON.parse(fs.readFileSync(manifestPath, {encoding: 'utf8'}));
                        const buildStep = getUseCaseBuildStep(manifest, dirPath, useCaseTempDirPath);
                        steps.push(buildStep);
                        shortDefinitions.push({
                            id: dirName,
                            title: manifest.title
                        });
                    }
                    steps.push({
                        run(){
                            const summaryPath = path.resolve(tempDir, 'use-cases-summary.json');
                            fs.writeFileSync(summaryPath, JSON.stringify(shortDefinitions), {encoding: 'utf8'});
                        }
                    });
                    const config = {
                        steps
                    };
                    await build(config);
                }
            },
            {
                parallel: [
                    {
                        run(watch){
                            createTestCasesScript()
                        }
                    },
                    {
                        type: 'copyFiles',
                        source: __dirname,
                        destination: tempDir,
                        fileNames: ['index.html','test-case.html','test-case.css','rhino.jpg','index.css','test-runner-worker.html']
                    },
                    {
                        type: 'copyFiles',
                        source: useCaseDir,
                        destination: tempUseCaseDir,
                        fileNames: ['index.html','index.css']
                    },
                    {
                        type: 'copyFiles',
                        source: __dirname,
                        destination: tempPlaygroundDir,
                        fileNames: ['rhino.jpg']
                    },
                    {
                        type: 'webpack',
                        config: () => infiniteCanvasWebpackConfig
                    },
                    playgroundConfig
                ]
            },
            {
                parallel: [
                    {
                        type: 'buildScripts',
                        source: __dirname,
                        destination: tempDir,
                        fileNames: ['index.js', 'test-case.js', 'test-runner-worker.js']
                    },
                    {
                        type: 'buildScripts',
                        source: useCaseDir,
                        destination: tempUseCaseDir,
                        fileNames: ['index.js']
                    },
                    {
                        type: 'copyFiles',
                        source: tempDir,
                        destination: tempPlaygroundDir,
                        fileNames: ['infinite-canvas.js']
                    }
                ]
            }
        ]
    }
}