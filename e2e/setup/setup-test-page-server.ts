import { default as express, type Express } from 'express'
import { distPath as testAppDistPath } from '../test-page-app/frontend/constants'
import { catalogRoot, serveStaticContent } from '../../test-cases/backend'

export async function setupTestPageServer(app: Express): Promise<void>{
    
    app.use(express.static(testAppDistPath))
    app.use('/test-cases', express.static(catalogRoot))
    serveStaticContent(app);
}