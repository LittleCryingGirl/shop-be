import { APIGatewayProxyHandler } from "aws-lambda";
import * as products from '../staticData/productsList.json';
import 'source-map-support/register';
import { headers } from "../constants";

export const getAllProducts: APIGatewayProxyHandler = async (_event, _context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      products
    }),
    headers
  };
}