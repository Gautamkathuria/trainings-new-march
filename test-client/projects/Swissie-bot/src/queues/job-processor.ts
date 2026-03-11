import { Worker, Job } from 'bullmq';
import { redisConnection } from './connection';
import { WorkflowPayload, QueueName, deadLetterQueue } from './definitions';

/**
 * Base worker configuration
 */
const workerOptions = {
  connection: redisConnection,
  autorun: true,
  concurrency: 5,
};

/**
 * Error handler - sends failed jobs to DLQ
 */
export async function handleJobFailure(job: Job<WorkflowPayload>, error: Error): Promise<void> {
  console.error(`❌ Job ${job.id} failed:`, error.message);
  
  // Send to Dead Letter Queue
  await deadLetterQueue.add('failed-job', {
    ...job.data,
    status: 'failed',
    error: error.message,
    failedAt: new Date().toISOString(),
  } as any);
}

/**
 * Success logger
 */
export function logJobSuccess(job: Job<WorkflowPayload>, result: any): void {
  console.log(`✅ Job ${job.id} completed successfully`, {
    workflowId: job.data.workflowId,
    result,
  });
}

/**
 * Create a worker with standard error handling
 */
export function createWorker(
  queueName: QueueName,
  processor: (job: Job<WorkflowPayload>) => Promise<any>
): Worker<WorkflowPayload> {
  const worker = new Worker<WorkflowPayload>(queueName, processor, workerOptions);

  worker.on('completed', (job) => {
    logJobSuccess(job, job.returnvalue);
  });

  worker.on('failed', (job, err) => {
    if (job) {
      handleJobFailure(job, err);
    }
  });

  worker.on('error', (err) => {
    console.error(`Worker error in ${queueName}:`, err);
  });

  console.log(`🔄 Worker started for queue: ${queueName}`);
  return worker;
}
