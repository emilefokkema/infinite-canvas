import { PluginOption } from "vite";
import { InputOption } from 'rollup'
import path from 'path'
import fs from 'fs'
import { readFile } from 'fs/promises'

function findExistingInputAliases(input: InputOption): string[]{
    if(typeof input === 'string' || Array.isArray(input)){
        return [];
    }
    return Object.getOwnPropertyNames(input);
}

function findExistingInputs(input: InputOption): {input: string, alias?: string}[]{
    if(typeof input === 'string'){
        return [{input}]
    }
    if(Array.isArray(input)){
        return input.map(i => ({input: i}))
    }
    return Object.getOwnPropertyNames(input).map(key => ({
        input: input[key],
        alias: key
    }))
}

function createNewName(existingNames: string[], desiredName: string): string{
    let counter = 1;
    let result = desiredName;
    while(existingNames.includes(result)){
        result = `${result}${counter++}`
    }
    return result;
}

export function addIndexDarkToInput(): PluginOption{
    return {
        name: 'vite-plugin-dark-theme-add-index-dark',
        apply: 'build',
        config(config){
            const root = config.root;
            const rootIndexHtmlExists = fs.existsSync(path.resolve(root, 'index.html'))
            const existingInput = config.build?.rollupOptions?.input;
            const existingAliases = findExistingInputAliases(existingInput);
            const additionalInput: {[name: string]: string} = {};
            let inputAdded = false;
            if(rootIndexHtmlExists){
                addInputForIndexDark(root, 'root-index-dark');
            }
            for(const {input, alias} of findExistingInputs(existingInput)){
                if(!input || !/\/index\.html$/.test(input)){
                    continue;
                }
                const directory = path.dirname(input)
                addInputForIndexDark(directory, alias ? `${alias}-dark` : 'anonymous-dark');
            }
            if(inputAdded){
                return {
                    build: {
                        rollupOptions: {
                            input: additionalInput
                        }
                    }
                }
            }
            function addInputForIndexDark(directory: string, alias: string): void{
                const newName = createNewName([...existingAliases], alias)
                additionalInput[newName] = path.resolve(directory, 'index-dark.html')
                existingAliases.push(newName)
                inputAdded = true;
            }
        },
        resolveId(id){
            if(!/\/index-dark\.html/.test(id)){
                return;
            }
            return id;
        },
        async load(id){
            if(!/\/index-dark\.html/.test(id)){
                return;
            }
            const directory = path.dirname(id);
            const indexHtmlPath = path.resolve(directory, 'index.html');
            return await readFile(indexHtmlPath, {encoding: 'utf-8'})
        }
    }
}