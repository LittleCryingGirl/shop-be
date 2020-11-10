import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { headers } from "../constants";
import { addNewProductToBD } from '../pg-client-lambda';

export const addNewProduct: APIGatewayProxyHandler = async (params) => {
  console.log('add params: ',params.body);
  try {
    const product = await addNewProductToBD(JSON.parse(params.body));
    return {
      statusCode: 200,
      body: product,
      headers
    };
  } catch (e) {
    return {
      statusCode: 500,
      body: e,
      headers
    }
  }
}
