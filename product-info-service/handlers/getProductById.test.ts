import { getProductById } from './getProductById';
import * as products from '../staticData/productsList.json';

test('should return code 400 if id wasn\'t provided', done => {
	function callback(data) {
		try {
			expect(data.statusCode).toBe(400);
			expect(data.body).toBe('Wrong parameters');
			done();
		} catch (error) {
			done(error);
		}
	}

	(getProductById(null, null, null) as Promise<any>).then(callback);
});

test('should return found product', done => {
	function callback(data) {
		try {
			expect(data.statusCode).toBe(200);
			expect(data.body).toBe(JSON.stringify(products[0]));
			done();
		} catch (error) {
			done(error);
		}
	}
	// @ts-ignore-next-line
	(getProductById({pathParameters: { productId: products[0].id}}, null, null)).then(callback);
});

test('should return error if product not found', done => {
	function callback(data) {
		try {
			expect(data.statusCode).toBe(404);
			expect(data.body).toBe('Product not found');
			done();
		} catch (error) {
			done(error);
		}
	}
	// @ts-ignore-next-line
	(getProductById({pathParameters: { productId: -1}}, null, null)).then(callback);
});