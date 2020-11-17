import { Serverless } from "serverless/plugins/aws/provider/awsProvider";

const serverlessConfiguration: Serverless = {
  service: {
    name: 'import-service-example',
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
    iamRoleStatements: [{
      Effect: 'Allow',
      Action: ['s3:ListBucket', 's3:GetObject'],
      Resource: 'arn:aws:s3:::import-service-example'
    }, {
      Effect: 'Allow',
      Action: 's3:*',
      Resource: 'arn:aws:s3:::import-service-example/*'
    }],
  },
  functions: {
    importProductsFile: {
      handler: 'handler.importProductsFile',
      events: [
        {
          http: {
            method: 'get',
            path: 'import',
            request: {
              parameters: {
                querystrings: {
                  name: true
                }
              }
            },
            cors: true
          }
        }
      ]
    },
    importFileParser: {
      handler: 'handler.importFileParser',
      events: [
        {
          s3: {
            event: 's3:ObjectCreated:*',
            bucket: 'import-service-example',
            rules: [{
              prefix: 'uploaded/',
              suffix: '.csv'
            }],
            existing: true
          }
        }
      ]
    }
  }
}

module.exports = serverlessConfiguration;
