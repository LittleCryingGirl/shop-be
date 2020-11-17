import { headers } from "./constants";

export const createResponse = (code, data) => {
  return {
    statusCode: code,
    body: JSON.stringify(data),
    headers
  }
}
