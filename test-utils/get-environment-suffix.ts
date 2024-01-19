import snapshotEnvironments from './snapshot-environments'

export function getEnvironmentSuffix(environmentIdentifiers: string[]): string{
    const match = snapshotEnvironments.find(e => e.isCurrent());
    if(!!match && environmentIdentifiers.includes(match.identifier)){
        return match.identifier;
    }
    return 'default';
}