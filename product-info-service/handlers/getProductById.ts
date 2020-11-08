import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { headers } from '../constants';
import {getProductByIdFromDB} from "../pg-client-lambda";

export const getProductById: APIGatewayProxyHandler = async (event, _context, _callback) => {
  try {
    const { productId } = event.pathParameters;
    const product = await getProductByIdFromDB(productId);

    if (product) {
      return {
        statusCode: 200,
        body: JSON.stringify(product),
        headers
      };
    } else {
      return {
        statusCode: 404,
        body: 'Product not found',
        headers
      }
    }
  } catch {
    return {
      statusCode: 500,
      body: 'Whoops!.. Something went wrong :(',
      headers
    }
  }





}
