import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { headers } from "../constants";
import { addNewProductToBD } from '../pg-client-lambda';

export const addNewProduct: APIGatewayProxyHandler = async (params) => {
  try {
    await addNewProductToBD(params);
    return {
      statusCode: 200,
      body: 'Successfully added!',
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
