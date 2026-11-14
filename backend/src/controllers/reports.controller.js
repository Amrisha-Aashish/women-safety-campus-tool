import { prisma } from '../db/prisma.js';
import { createPseudonym } from '../utils/pseudonym.js';

function toApiReport(report) {
  const { latitude, longitude, locationName, userId: _userId, ...fields } = report;
  return {
    ...fields,
    location: { name: locationName, latitude, longitude }
  };
}

export async function listReports(_request, response, next) {
  try {
    const reports = await prisma.report.findMany({
      orderBy: { createdAt: 'desc' }
    });

    response.status(200).json({ success: true, data: reports.map(toApiReport) });
  } catch (error) {
    next(error);
  }
}

export async function createReport(request, response, next) {
  try {
    const { category, description, location, occurredAt, isAnonymous = true } = request.body;
    const authenticatedUserId = request.user?.id;

    if (!isAnonymous && !authenticatedUserId) {
      return response.status(401).json({
        success: false,
        message: 'Sign-in is required to submit a non-anonymous report.'
      });
    }

    const report = await prisma.report.create({
      data: {
        category,
        description: description.trim(),
        latitude: location.latitude,
        longitude: location.longitude,
        locationName: location.name.trim(),
        occurredAt: occurredAt ? new Date(occurredAt) : new Date(),
        isAnonymous,
        reporterPseudonym: isAnonymous ? createPseudonym() : null,
        userId: isAnonymous ? null : authenticatedUserId
      }
    });

    response.status(201).json({ success: true, data: toApiReport(report) });
  } catch (error) {
    next(error);
  }
}
