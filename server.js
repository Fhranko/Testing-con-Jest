const express = require('express');
const app = express();
const port = 3000;

const axios = require('axios');

const { expect } = require('@jest/globals');

app.get('/', async (req, res) => {
	// res.send('Hello World!');
	const businessApiToken =
		'$2y$10$2TxPJsRhkHEsx6ZtNtwMP.E6t.YQwVp.gQ.H61HeIv2rRY.70JbLC';
	const appKey = 'Vm0xMFlXRXlVWGxUYmxKWFlUQndVbFpyVWtKUFVUMDk=-BFGCH';

	const body = {
		appkey: appKey,
		callback_url: 'mail.com',
		currency_code: 'BOB',
		customer_email: 'francohuanaco@gmail.com',
		customer_first_name: 'Franco',
		customer_last_name: 'Huanaco',
		detail: 'Pago Efectivo',
		items: [
			{
				name: 'Detalle de item',
				price: 1,
				quantity: 1,
			},
		],
		payment_method: 'CASH',
		payment_type: 'EMBED',
	};

	const testingUrl =
		'https://testingcheckout.qhantuy.com/external-api/checkout';

	// send post request to testingurl, body as body and businessApiToken as header
	const response = await axios.post(testingUrl, body, {
		headers: {
			Authorization: `Bearer ${businessApiToken}`,
		},
	});

	res.send(response.data);

	// test whit jest response.data.process must be true
	expect(response.data.process).toBe(true);
});

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
