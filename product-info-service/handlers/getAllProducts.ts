import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { headers } from "../constants";
import { getProductsFromDB } from '../pg-client-lambda';

export const getAllProducts: APIGatewayProxyHandler = async () => {
  const products = await getProductsFromDB();
  try {
    return {
      statusCode: 200,
      body: JSON.stringify({
        products
      }),
      headers
    };
  } catch {
    return {
      statusCode: 500,
      body: 'Whoops!.. Something went wrong :(',
      headers
    }
  }
}
