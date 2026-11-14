import { prisma } from '../db/prisma.js';

export async function getDashboardSummary(_request, response, next) {
  try {
    const [totalReports, reportsByCategory, reportsByStatus, totalSosAlerts, activeSosAlerts, recentReports] =
      await Promise.all([
        prisma.report.count(),
        prisma.report.groupBy({
          by: ['category'],
          _count: { _all: true },
          orderBy: { category: 'asc' }
        }),
        prisma.report.groupBy({
          by: ['status'],
          _count: { _all: true },
          orderBy: { status: 'asc' }
        }),
        prisma.sOSAlert.count(),
        prisma.sOSAlert.count({ where: { status: 'ACTIVE' } }),
        prisma.report.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            category: true,
            status: true,
            locationName: true,
            createdAt: true
          }
        })
      ]);

    response.status(200).json({
      success: true,
      data: {
        totalReports,
        reportsByCategory: reportsByCategory.map(({ category, _count }) => ({
          category,
          count: _count._all
        })),
        reportsByStatus: reportsByStatus.map(({ status, _count }) => ({
          status,
          count: _count._all
        })),
        totalSosAlerts,
        activeSosAlerts,
        recentReports
      }
    });
  } catch (error) {
    next(error);
  }
}
