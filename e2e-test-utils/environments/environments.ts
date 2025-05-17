import { UnknownEnvironmentError } from "./unknown-environment-error";

interface Environment {
    id: string
    isCurrent(): boolean
}

const WINDOWS: Environment = {
    id: 'windows',
    isCurrent() {
        return process.platform === 'win32'
    },
};

const LINUX: Environment = {
    id: 'linux',
    isCurrent() {
        return process.platform === 'linux' && process.env.CI !== 'true'
    },
}

const DARWIN: Environment = {
    id: 'darwin',
    isCurrent() {
        return process.platform === 'darwin';
    },
}

const CI: Environment = {
    id: 'ci',
    isCurrent() {
        return process.env.CI === 'true'
    },
}

const knownEnvironments: Environment[] = [WINDOWS, LINUX, CI, DARWIN];

export function getCurrentEnvironment(): Environment {
    const current = knownEnvironments.find(e => e.isCurrent());
    if(!current){
        throw new UnknownEnvironmentError('Could not determine current environment')
    }
    return current;
}

