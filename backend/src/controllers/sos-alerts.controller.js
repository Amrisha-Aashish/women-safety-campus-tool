import { SOSStatus } from '@prisma/client';
import { prisma } from '../db/prisma.js';

export async function listSosAlerts(request, response, next) {
  try {
    const status = request.query.status;
    const where = status ? { status } : undefined;
    const alerts = await prisma.sOSAlert.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    response.status(200).json({ success: true, data: alerts });
  } catch (error) {
    next(error);
  }
}

export async function createSosAlert(request, response, next) {
  try {
    const { latitude, longitude } = request.body;
    const alert = await prisma.sOSAlert.create({
      data: { latitude, longitude, userId: request.user?.id || null }
    });

    response.status(201).json({ success: true, data: alert });
  } catch (error) {
    next(error);
  }
}

export async function acknowledgeSosAlert(request, response, next) {
  try {
    const alert = await prisma.sOSAlert.update({
      where: { id: request.params.id },
      data: { status: SOSStatus.ACKNOWLEDGED }
    });

    response.status(200).json({ success: true, data: alert });
  } catch (error) {
    if (error.code === 'P2025') {
      return response.status(404).json({ success: false, message: 'SOS alert not found.' });
    }
    next(error);
  }
}

export async function resolveSosAlert(request, response, next) {
  try {
    const alert = await prisma.sOSAlert.update({
      where: { id: request.params.id },
      data: { status: SOSStatus.RESOLVED, resolvedAt: new Date() }
    });

    response.status(200).json({ success: true, data: alert });
  } catch (error) {
    if (error.code === 'P2025') {
      return response.status(404).json({ success: false, message: 'SOS alert not found.' });
    }
    next(error);
  }
}
