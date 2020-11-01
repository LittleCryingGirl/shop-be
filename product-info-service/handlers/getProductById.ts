import { APIGatewayProxyHandler } from 'aws-lambda';
import * as products from '../staticData/productsList.json';
import 'source-map-support/register';
import { headers } from '../constants';

export const getProductById: APIGatewayProxyHandler = async (event, _context, _callback) => {
  const { productId } = event.pathParameters;

  if (!productId) {
    return {
      statusCode: 400,
      body: 'Wrong parameters',
      headers
    }
  }

  const product = products.find(p => p.id === productId);

  if (product) {
    return {
      statusCode: 200,
      body: JSON.stringify(product),
      headers
    };
  }
  
  return {
    statusCode: 404,
    body: 'Product not found',
    headers
  }
}