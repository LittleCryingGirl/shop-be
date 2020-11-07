import { getAllProducts } from "./getAllProducts";
import * as products from '../staticData/productsList.json';

test('should return full products list', done => {
	function callback(data) {
		try {
			expect(data.body).toBe(JSON.stringify({products}));
			expect(data.statusCode).toBe(200);
			done();
		} catch (error) {
			done(error);
		}
	}

	(getAllProducts(null, null, null) as Promise<any>).then(callback);
});