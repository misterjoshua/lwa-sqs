import { App, Duration, Stack, StackProps } from 'aws-cdk-lib';
import { DockerImageCode, DockerImageFunction, Tracing } from 'aws-cdk-lib/aws-lambda';
import { SqsEventSource } from 'aws-cdk-lib/aws-lambda-event-sources';
import { Queue } from 'aws-cdk-lib/aws-sqs';
import { Construct } from 'constructs';

export class LwaSqsStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    const handler = new DockerImageFunction(this, 'Handler', {
      code: DockerImageCode.fromImageAsset('.', {
        file: 'Dockerfile',
      }),
      memorySize: 4096,
      timeout: Duration.seconds(5),
      tracing: Tracing.ACTIVE,
    });

    const queue = new Queue(this, 'Queue', {
      visibilityTimeout: Duration.seconds(5),
      deadLetterQueue: {
        queue: new Queue(this, 'DeadLetters'),
        maxReceiveCount: 5,
      },
    });

    handler.addEventSource(
      new SqsEventSource(queue, {
        reportBatchItemFailures: true,
        batchSize: 20,
        maxBatchingWindow: Duration.seconds(5),
      }),
    );
  }
}

const app = new App();

new LwaSqsStack(app, 'lwa-sqs-dev', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});

app.synth();