const queue = [];

export function isEmpty() {
  return queue.length === 0;
}

export function enqueue(job) {
  queue.push(job);
}

export function dequeue() {
  return queue.shift();
}