import express from 'express';
import app from './app.js';
import router from './routes.js';
const PORT = 8006;

app.use(express.urlencoded({extended:true}));
app.use(router);

app.listen(PORT, async () => {
  console.log(`Job Queue running on http://localhost:${PORT}`);
});