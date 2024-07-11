import {cors} from '@elysiajs/cors';
import {Elysia, t} from 'elysia';

import env from './env';
import generate from './controllers/generate.controller';
import {LangChain} from './LangChain';

const PORT = env.PORT;

new Elysia()
	.use(cors({allowedHeaders: '*'}))
	.get('/settings', () => ({
		configured: true
	}))
	.post('/generate', async ({body}) => generate(body), {
		body: t.Object({
			themeDisplay: t.Any(),
			question: t.String(),
			image: t.String()
		})
	})
	.listen(PORT, () => console.log(`Elysia is running on PORT ${PORT}`));

// const langChain = new LangChain('google', {
// 	modelName: 'gemini-1.5-pro-001',
// 	temperature: 0,
// 	responseMimeType: 'application/json'
// 	// apiKey: env.OPENAI_KEY
// });

// await langChain.test();
