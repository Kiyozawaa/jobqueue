import { isEmpty, dequeue } from './queue.js';
import { getNext, updateJobStatus, requeue, updateLease } from './db.js';
import { setTimeout } from 'timers/promises';

const workerName = process.argv[2] || "Worker";
export async function startWorker() {
  console.log("Worker active....");
  let requeueStatus = false;
  while (true) {
    const result = await getNext();
    if (result.rows.length === 0) {
      await setTimeout(5000);
    } else {
      const job = result.rows[0];
      const controller = new AbortController();
      const renewal = extendLease(job, controller.signal);
      try {
        console.log(`${workerName} picked up Job ID ${job.id}`);
        await doSomeWork(job);
      } finally {
        controller.abort();
        await renewal;
      }
    }
    if (requeueStatus) {
      await requeue();
    }
    requeueStatus = !requeueStatus;
  }
}


async function doSomeWork(job) {
  //job.startedAt = new Date().toLocaleTimeString();
  await setTimeout(3000);
  await retry(job);
  console.log(`Job ID ${job.id} processed.`);
}

async function retry(job, MAX_RETRIES=3) {
  for (let i=0; i<=MAX_RETRIES; i++) {
    const success = Math.floor(Math.random() * 2);
    
    if (success) {
      //job.status = 'completed';
      //job.completedAt = new Date().toLocaleTimeString();
      await updateJobStatus(job.id, 'completed', job.claim_version);
      break;
    } else {
      job.attempts = i+1;
      
      if (!success && i===MAX_RETRIES) {
        //job.status = 'failed';
        //job.failedAt = new Date().toLocaleTimeString();
        await updateJobStatus(job.id, 'failed');
        break;
      }
    }
    await setTimeout(1000*(i+1));
    console.log(`Retry ${i+1} for Job ${job.id}`);
  }
}

async function extendLease(job, signal) {
  try {
    while (!signal.aborted) {
      await setTimeout(10000, undefined, { signal });
      if (signal.aborted) break;
      await updateLease(job.id, job.claim_version);
    }
  } catch (err) {
      if (err.name !== 'AbortError') {
        throw err;
      }
  }
}
await startWorker();