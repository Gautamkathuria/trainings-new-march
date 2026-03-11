const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { OTLPLogExporter } = require('@opentelemetry/exporter-logs-otlp-http');
const { SimpleLogRecordProcessor } = require('@opentelemetry/sdk-logs');

const sdk = new NodeSDK({
  logRecordProcessor: new SimpleLogRecordProcessor(
    new OTLPLogExporter({
      url: 'http://otel-collector:4318/v1/logs',
    })
  ),
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();

const express = require('express');
const { logs } = require('@opentelemetry/api-logs');
const app = express();
const logger = logs.getLogger('sample-app');

function log(msg, level = 'INFO') {
  logger.emit({ severityText: level, body: msg });
  console.log(`[${level}] ${msg}`);
}

app.get('/', (req, res) => {
  log('GET / called');
  res.send('Hello World!');
});

app.get('/slow', async (req, res) => {
  log('GET /slow called');
  await new Promise(resolve => setTimeout(resolve, 1000));
  res.send('Slow response!');
});

app.get('/error', (req, res) => {
  log('GET /error called', 'ERROR');
  res.status(500).json({ error: 'Simulated error!' });
});

app.listen(8080, () => {
  log('App running on port 8080');
});
