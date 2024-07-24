import { default as express, type Express, type Request, type Response, json } from 'express'
import { ExampleDescription } from '../shared';
import { createExample, getExamplesMetadata } from '../../examples/access'
import { getTestCasesMetadata } from '../../test-cases/backend'

function logRequest(req: Request, res: Response): void{
    console.log(`responding with ${res.statusCode} to ${req.path}`)
}

export function createRouter(): Express{
    const app = express();
    app.use(json())
    app.get('/examples', async (_, res, next) => {
        const [examples, testCases] = await Promise.all([getExamplesMetadata(), getTestCasesMetadata()])
        const exampleDescriptions: ExampleDescription[] = examples.map(({dirName, title}) => ({
            id: dirName,
            title,
            kind: 'use-case'
        }));
        const testCaseDescriptions: ExampleDescription[] = testCases.map(({id, title}) => ({
            id,
            title,
            kind: 'test-case'
        }))
        res.json(exampleDescriptions.concat(testCaseDescriptions))
        next()
    }, logRequest)
    app.post('/examples/create', async (req, res) => {
        const id = await createExample(req.body)
        res.status(200).send(id)
    })
    return app;
}