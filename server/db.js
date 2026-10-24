import { Pool } from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env')});
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

export async function createJob(type, payload) {
  await pool.query(`INSERT INTO jobs (type, payload) VALUES ($1, $2)`, [type, payload]);
}

export async function updateJobStatus(id, status, claim_version) {
  await pool.query(`
    UPDATE jobs
    SET
      status = $1,
      completed_at = NOW()
    WHERE id = $2
    AND claim_version = $3
    AND locked_until > NOW()
    `,
    [status, id, claim_version]);
}

export async function getQueues() {
  const queues = await pool.query(`SELECT * FROM jobs WHERE status = 'queue'`);
  return queues;
}

export async function getAllJobs() {
  const jobs = await pool.query(`SELECT * FROM jobs ORDER BY id ASC`);
  return jobs;
}

export async function getNext() {
  const next = await pool.query(`
    WITH next_job as(
      SELECT * FROM jobs
      WHERE status = 'queued'
      ORDER BY id ASC
      LIMIT 1
      FOR UPDATE SKIP LOCKED)
    UPDATE jobs
      SET
        status = 'processing',
        started_at = NOW(),
        locked_until = NOW() + INTERVAL '5 minutes',
        claim_version = claim_version + 1
      WHERE id = (SELECT id FROM next_job)
    RETURNING *
    `);
  return next;
}

export async function requeue() {
  await pool.query(`
    UPDATE jobs
    SET status = 'queued'
    WHERE status = 'processing'
    AND locked_until < NOW()
  `);
}

export async function updateLease(id, claim_version) {
  await pool.query(`
    UPDATE jobs
    SET locked_until = NOW() + INTERVAL '10 seconds'
    WHERE id = $1
    AND claim_version = $2
    `, [id, claim_version]);
}