/// <reference types="vite/client" />

interface SnapshotEnvironment{
    identifier: string
    isCurrent(): boolean
}

const snapshotEnvironments: SnapshotEnvironment[] = [
    {
        identifier: 'gitpod',
        isCurrent: () => import.meta.env.GITPOD_WORKSPACE_ID !== undefined
    },
    {
        identifier: 'CI',
        isCurrent: () => import.meta.env.CI
    }
]

export default snapshotEnvironments;