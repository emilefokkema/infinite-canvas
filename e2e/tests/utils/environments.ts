export const CI = { id: 'CI'} as const
export const CODESPACES = { id: 'codespaces'} as const
export const DEFAULT = {id: 'default'} as const
export type Environment = typeof CI | typeof DEFAULT | typeof CODESPACES

interface PossibleEnvironment{
    environment: Environment
    isCurrent(): boolean
}

const environments: PossibleEnvironment[] = [
    {
        environment: CI,
        isCurrent: () => import.meta.env.CI
    },
    {
        environment: CODESPACES,
        isCurrent: () => import.meta.env.CODESPACES
    }
]

export function getCurrentEnvironment(): Environment{
    const current = environments.find(e => e.isCurrent());
    if(current){
        return current.environment;
    }
    return DEFAULT;
}

export function selectEnvironment(...choices: Environment[]): Environment{
    const choice = environments.find(e => e.isCurrent() && choices.includes(e.environment));
    return choice?.environment || DEFAULT;
}