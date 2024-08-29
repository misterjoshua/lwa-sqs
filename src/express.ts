import { Logger } from '@aws-lambda-powertools/logger';
import type * as lambda from 'aws-lambda';
import express from 'express';

const logger = new Logger({ serviceName: 'lwa-sqs' });

const app = express();

// Parse JSON bodies
app.use(express.json());
// Handle SQS events
app.post('/events', (req, res) => {
  const event: lambda.SQSEvent = req.body;
  const response: lambda.SQSBatchResponse = {
    batchItemFailures: event.Records.flatMap((record) => {
      if (record.body === 'fail') {
        logger.info('Simulating failure to process record', { messageId: record.messageId, receiveCount: record.attributes.ApproximateReceiveCount, body: record.body });
        return [{ itemIdentifier: record.messageId }];
      }

      logger.info('Processing record', { messageId: record.messageId, receiveCount: record.attributes.ApproximateReceiveCount, body: record.body });
      return [];
    }),
  };

  res.json(response);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  logger.info('Server is listening', { port });
});
