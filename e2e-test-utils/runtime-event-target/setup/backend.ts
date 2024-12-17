import { default as express, type Router} from 'express'
import { build } from 'vite'
import { createConfig } from '../frontend/lib/create-vite-config'
import { distPath } from '../frontend/lib/constants'
import { FRONTEND_PATH } from '../shared/constants'

export interface RuntimeEventTargetBackend{
    router: Router
}

export async function createBackend(): Promise<RuntimeEventTargetBackend>{
    await build(createConfig());
    const router = express.Router();
    router.use(`/${FRONTEND_PATH}`, express.static(distPath))
    return { router }
}