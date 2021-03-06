import type { Serverless } from 'serverless/aws';

const serverlessConfiguration: Serverless = {
  service: {
    name: 'product-info-service',
    // app and org for use with dashboard.serverless.com
    // app: your-app-name,
    // org: your-org-name,
  },
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    }
  },
  // Add the serverless-webpack plugin
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
    region: 'eu-west-1',
  },
  functions: {
    getProductById: {
      handler: 'handler.getProductById',
      events: [
        {
          http: {
            method: 'get',
            path: 'products/{productId}',
            request: {
              parameters: {
                paths: {
                  productId: true
                }
              }
            },
            cors: true
          },
        }
      ]
    },
    addNewProduct: {
      handler: 'handler.addNewProduct',
      events: [
        {
          http: {
            method: 'post',
            path: 'products',
            cors: true
          },
        }
      ]
    },
    getAllProducts: {
      handler: 'handler.getAllProducts',
      events: [
        {
          http: {
            method: 'get',
            path: 'products',
            cors: true
          },
        }
      ]
    }
  }
}

module.exports = serverlessConfiguration;
