import type {z} from 'zod';

import {LangChain} from '../LangChain';
import * as assets from '../assets';
import getPromptCategorization from '../assets/categorization';
import type {categorizationSchema} from '../schemas';
import type Asset from '../assets/Asset';
import liferayHeadless from '../services/apis';
import getLiferayInstance from '../services/liferay';
import env from '../env';
import {createJSON} from '../services/addPage';

export default async function generate(body: any) {
	const langChain = new LangChain('google', {
		modelName: 'gemini-1.5-flash-001'
		// apiKey: env.OPENAI_KEY
	});

	const themeDisplay = body.themeDisplay;

	const categorizationPrompt = getPromptCategorization(body.question);
	const data = await langChain.getStructuredContent(categorizationPrompt);

	const categorization = data as z.infer<typeof categorizationSchema>;

	console.info({categorization});

	console.log(categorization.assetType);

	if (categorization.assetType === 'none') {
		return {message: 'Asset Type invalid'};
	}

	if (categorization.assetType === 'page') {
		return generateLayout(body.image);
	}

	const _Asset = (assets as any)[categorization.assetType];

	if (!_Asset) {
		throw new Error('Invalid asset type.');
	}

	const asset: Asset = new _Asset(
		{
			langChain,
			liferay: liferayHeadless(getLiferayInstance()),
			themeDisplay
		},
		categorization
	);

	return asset.run();
}

async function generateLayout(image: string) {
	console.log('entro');

	const langChain = new LangChain('google', {
		modelName: 'gemini-1.5-pro-001',
		temperature: 0,
		responseMimeType: 'application/json'
		// apiKey: env.OPENAI_KEY
	});

	const content = await langChain.getImageDescription(image);

	await createJSON(content);

	return {output: 'Page generated!'};
}
