import ky from 'ky';

export default function getLiferayInstance() {
	return ky.extend({
		prefixUrl: 'http://localhost:8080',
		headers: {
			Authorization: 'Basic dGVzdEBsaWZlcmF5LmNvbTp0ZXN0'
		},
		hooks: {
			beforeError: [
				(error) => {
					console.log(error.message);
					console.log({error});

					return error;
				}
			]
		},
		retry: {
			limit: 5,
			methods: ['get', 'post'],
			statusCodes: [403, 401],
			backoffLimit: 3000
		}
	});
}

export type LiferayInstance = ReturnType<typeof getLiferayInstance>;
