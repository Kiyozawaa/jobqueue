#Job Queue System
A backend job queue system built with Node.js, Express, and PostgreSQL to process background tasks asynchronously. Features include multiple independent workers, atomic job claiming using PostgreSQL's "FOR UPDATE SKIP LOCKED", job status tracking, lease-based recovery, and claim versioning to prevent stale workers from modifying jobs they no longer own.

##Features
- Asynchronous background job processing
- Multiple independent worker processes
- Atomic job claiming
- Job status tracking
- Lease-based recovery for abandoned jobs
- Claim versions to prevent stale workers to update jobs


##Tech Stack
- Javascript (Node.js)
- Express.js
- PostgreSQL


##Setup

1. Clone the repository.

```bash
git clone https://github.com/Kiyozawaa/jobqueue.git
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file

```bash
DATABASE_URL=your_postgres_url
```

4. Start the server.
```bash
npm start
```

5. Start a worker
```bash
node server/worker.js
```
You can start multiple worker instances in separate terminals to process jobs concurrently. Adjust the worker path if your project uses a different directory structure. You can also give workers a name to distinguish them.
```


##Current Limitations
- Error handling and failure recovery could be improved.
- No dedicated user interface.


