import express from 'express';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { enqueue } from './queue.js';
import { createJob, getAllJobs } from './db.js';

const router = express.Router();
const queue = [];
const __dirname = dirname(fileURLToPath(import.meta.url));

router.get('/', async (req, res) => {
  res.sendFile(join(__dirname, '..', 'public', 'index.html'));
});

router.post('/jobs', async (req, res) => {
  const { type, payload } = req.body;
  const newJob = createJob(type, payload);
  //enqueue(newJob);
  res.json('queued');
});

router.get('/jobs', async (req, res) => {
  const allJobs = await getAllJobs();
  res.json(allJobs.rows);
});

export default router;