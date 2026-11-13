import { createPseudonym } from '../utils/pseudonym.js';

// Temporary in-memory store. Replace with Prisma queries after the database
// teammate merges the schema and database client.
const reports = [];

export function listReports(_request, response) {
  response.status(200).json({
    success: true,
    data: reports
  });
}

export function createReport(request, response) {
  const { category, description, location, occurredAt, isAnonymous = true } = request.body;

  const report = {
    id: crypto.randomUUID(),
    category,
    description,
    location,
    occurredAt: occurredAt || new Date().toISOString(),
    isAnonymous,
    reporterPseudonym: isAnonymous ? createPseudonym() : null,
    status: 'OPEN',
    createdAt: new Date().toISOString()
  };

  reports.push(report);
  response.status(201).json({ success: true, data: report });
}
