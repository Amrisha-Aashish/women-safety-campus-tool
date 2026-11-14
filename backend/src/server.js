import 'dotenv/config';
import app from './app.js';
import { prisma } from './db/prisma.js';

const port = Number(process.env.PORT || 4000);

const server = app.listen(port, () => {
  console.log(`Campus Safety API listening on http://localhost:${port}`);
});

async function shutdown(signal) {
  console.log(`${signal} received; closing database connection.`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.once('SIGINT', () => shutdown('SIGINT'));
process.once('SIGTERM', () => shutdown('SIGTERM'));
