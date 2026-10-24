const jobs = [];
let nextId = 1;

export function createJob(type, payload) {
  const createdAt = new Date().toLocaleTimeString();
  const job = {
    id: nextId,
    type: type,
    payload: payload,
    status: 'queued',
    createdAt: createdAt
  };
  jobs.push(job);
  nextId++;
  return job;
}

export function getJobs() {
  return jobs;
}