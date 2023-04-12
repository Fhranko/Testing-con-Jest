const request = require('supertest');
require('dotenv').config();

const businessApiToken = process.env.businessApiToken;
const appKey = process.env.appKey;

describe('Generar cobro en efectivo', () => {
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
	it('Debería crear una nueva orden de pago', async () => {
		const response = await request('https://testingcheckout.qhantuy.com')
			.post('/external-api/checkout')
			.set('Authorization', businessApiToken)
			.send(body)
			.expect(200);

		expect(response.body).toMatchObject({
			process: true,
			message: 'Pago en efectivo realizado correctamente',
			transaction_id: expect.any(Number),
			checkout_amount: expect.any(Number),
			payment_status: 'success',
		});
	}, 10000);
});

describe('Generar cobro con tarjeta', () => {
	const body = {
		appkey: appKey,
		callback_url: 'qhantuy.com',
		credit_card: {
			card_holder_email: 'francohuanaco@gmail.com',
			card_holder_name: 'Franco Huanaco',
			credit_card_number: '4111111111111111',
			cvv_code: '111',
			expiration_month: '02',
			expiration_year: '24',
			tokenization: false,
		},
		currency_code: 'BOB',
		detail: 'Pedido 1',
		items: [
			{
				name: 'Ayuda campaña 1',
				price: 1,
				quantity: 1,
			},
		],
		payment_method: 'CYBERSOURCE',
		payment_type: 'EMBED',
	};

	it('Debería crear un pago con tarjeta', async () => {
		const response = await request('https://testingcheckout.qhantuy.com')
			.post('/external-api/checkout')
			.set('Authorization', businessApiToken)
			.send(body)
			.expect(200);

		expect(response.body).toMatchObject({
			process: true,
			payment_status: 'success',
		});
	}, 30000);

	it('Deberia dar error tarjeta con más digitos de los permitidos', async () => {
		const body = {
			appkey: appKey,
			callback_url: 'qhantuy.com',
			credit_card: {
				card_holder_email: 'francohuanaco@gmail.com',
				card_holder_name: 'Franco Huanaco',
				credit_card_number: '41111111111111111',
				cvv_code: '111',
				expiration_month: '02',
				expiration_year: '24',
				tokenization: false,
			},
			currency_code: 'BOB',
			detail: 'Pedido 1',
			items: [
				{
					name: 'Ayuda campaña 1',
					price: 1,
					quantity: 1,
				},
			],
			payment_method: 'CYBERSOURCE',
			payment_type: 'EMBED',
		};
		const response = await request('https://testingcheckout.qhantuy.com')
			.post('/external-api/checkout')
			.set('Authorization', businessApiToken)
			.send(body)
			.expect(200);

		expect(response.body).toMatchObject({
			process: false,
		});
	}, 30000);
});
