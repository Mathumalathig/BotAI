import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

const configuration = new Configuration({
    apiKey : process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration);

const app = express();

//allow to make those cross origin request and 
//allow our server to be called front end request
app.use(cors());
//allows to pass the json from the front-end to back-end 
app.use(express.json())

app.get('/', async (req, res) => {
    res.status(200).send({
        message : 'Hello from AI',
    })
})

app.post('/', async (req, res) => {
    try{

        const prompt = req.body.prompt;
        const responce = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 0,
            max_tokens: 3000,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        });

        res.status(200).send({
            bot : responce.data.choices[0].text
        });

    } catch(error) {
        console.log(error);
        //and alos
        res.status(500).send({error});       
    }
})

app.listen(5050, () => console.log('Server is Running on the port http://localhost:5050'));