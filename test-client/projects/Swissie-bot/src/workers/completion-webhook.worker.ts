import { Job } from 'bullmq';
import { WorkflowPayload } from '../queues/definitions';
import { sendWebhook } from '../adapters/http.adapter';
import { config } from '../config/secrets';

/**
 * Completion Webhook Worker
 * The Reporter - Sends final status back to n8n
 */
export async function processCompletionJob(job: Job<WorkflowPayload>): Promise<void> {
  const { workflowId, status, currentDay, customerResponse } = job.data;

  console.log(`📢 [Completion] Sending webhook for workflow: ${workflowId}`);

  // Prepare webhook payload with masked data (no sensitive info)
  const webhookPayload = {
    workflowId,
    status: status || 'completed',
    completedAt: new Date().toISOString(),
    totalDays: currentDay || 0,
    outcome: determineOutcome(status, customerResponse),
    metadata: {
      finalDay: currentDay,
      hasResponse: !!customerResponse,
    },
  };

  try {
    // Send to n8n webhook
    await sendWebhook(config.webhook.url, webhookPayload);

    console.log(`✅ [Completion] Webhook sent successfully for ${workflowId}`);
    console.log(`   Status: ${webhookPayload.status}`);
    console.log(`   Outcome: ${webhookPayload.outcome}`);
  } catch (error) {
    console.error(`❌ [Completion] Failed to send webhook for ${workflowId}:`, error);
    throw error;
  }
}

/**
 * Determine the outcome based on status and response
 */
function determineOutcome(
  status?: string,
  customerResponse?: string
): 'success' | 'timeout' | 'declined' | 'unknown' {
  if (status === 'completed' && customerResponse) {
    return 'success';
  }
  if (status === 'failed' && customerResponse) {
    return 'declined';
  }
  if (status === 'failed') {
    return 'timeout';
  }
  return 'unknown';
}
