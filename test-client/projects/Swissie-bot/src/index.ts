import * as dotenv from 'dotenv';
import { validateEnv } from './config/secrets';
import { createWorker } from './queues/job-processor';
import { startApiServer } from './api/server';
import {
  QueueName,
  mainQueue,
  controllerQueue,
  channelSelectorQueue,
  messageBuilderQueue,
  followUpQueue,
  responseParserQueue,
  escalationQueue,
  completionQueue,
} from './queues/definitions';
import { processControllerJob } from './workers/extended-controller.worker';
import { processChannelSelectorJob } from './workers/channel-selector.worker';
import { processMessageBuilderJob } from './workers/message-builder.worker';
import { processFollowUpJob } from './workers/follow-up-engine.worker';
import { processResponseParserJob } from './workers/response-parser.worker';
import { processEscalationJob } from './workers/escalation-path.worker';
import { processCompletionJob } from './workers/completion-webhook.worker';

// Load environment variables
dotenv.config();

/**
 * Initialize all workers
 */
async function initializeWorkers(): Promise<void> {
  console.log('🚀 Starting Rajat Task Bot...');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  // Validate environment
  try {
    validateEnv();
  } catch (error) {
    console.error('❌ Environment validation failed:', error);
    process.exit(1);
  }

  console.log('\n📦 Initializing BullMQ Workers...\n');

  // Create workers for each queue
  createWorker(QueueName.MAIN, async (job) => {
    // Main queue receives jobs from n8n and routes to controller
    console.log(`📥 [Main Queue] New job received: ${job.id}`);
    await controllerQueue.add('start-workflow', job.data);
  });

  createWorker(QueueName.CONTROLLER, processControllerJob);
  createWorker(QueueName.CHANNEL_SELECTOR, processChannelSelectorJob);
  createWorker(QueueName.MESSAGE_BUILDER, processMessageBuilderJob);
  createWorker(QueueName.FOLLOW_UP, processFollowUpJob);
  createWorker(QueueName.RESPONSE_PARSER, processResponseParserJob);
  createWorker(QueueName.ESCALATION, processEscalationJob);
  createWorker(QueueName.COMPLETION, processCompletionJob);

  console.log('\n✅ All workers initialized successfully!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  // Start API server
  startApiServer();
  
  console.log('🎯 System Status:');
  console.log('   • Workers: Running');
  console.log('   • Queues: Ready');
  console.log('   • API: Running');
  console.log('   • Waiting for jobs from n8n...\n');
}

/**
 * Graceful shutdown handler
 */
async function shutdown(): Promise<void> {
  console.log('\n🛑 Shutting down gracefully...');

  // Close all queues
  await Promise.all([
    mainQueue.close(),
    controllerQueue.close(),
    channelSelectorQueue.close(),
    messageBuilderQueue.close(),
    followUpQueue.close(),
    responseParserQueue.close(),
    escalationQueue.close(),
    completionQueue.close(),
  ]);

  console.log('✅ All queues closed');
  process.exit(0);
}

// Handle process signals
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Handle uncaught errors
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Start the application
initializeWorkers().catch((error) => {
  console.error('❌ Failed to initialize workers:', error);
  process.exit(1);
});
