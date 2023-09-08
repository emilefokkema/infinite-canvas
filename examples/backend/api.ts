import { default as express, type Express, json } from 'express'
import { findExampleDescriptions } from './retrieval/retrieve-examples';
import { addExample } from './retrieval/add-example'

export function createExamplesApi(): Express{
    const app = express();
    app.use(json())
    app.get('/examples', async (req, res) => {
        res.json(await findExampleDescriptions())
    })
    app.post('/examples/create', async (req, res) => {
        const id = await addExample(req.body)
        res.status(200).send(id)
    })
    return app;
}