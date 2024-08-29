import { awscdk } from 'projen';
const project = new awscdk.AwsCdkTypeScriptApp({
  cdkVersion: '2.1.0',
  defaultReleaseBranch: 'main',
  description: 'An AWS CDK all to test AWS Lambda Web Adapter works with SQS Batch Item Failure Reporting',
  name: 'lwa-sqs',
  projenrcTs: true,

  deps: [
    'express@^4',
    'morgan@^1',
    '@aws-lambda-powertools/logger',
    '@aws-lambda-powertools/tracer',
    'aws-xray-sdk',
  ],
  devDeps: [
    '@types/express@^4',
    'esbuild@^0.23',
    '@types/aws-lambda@^8',
    '@types/morgan@^1',
  ],
});
project.synth();