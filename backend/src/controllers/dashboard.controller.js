import { prisma } from '../db/prisma.js';

function countBy(items, key) {
  return Object.fromEntries(
    items.map((item) => [item[key], item._count._all])
  );
}

export async function getDashboardSummary(_request, response, next) {
  try {
    const [
      totalReports,
      reportsByCategory,
      reportsByStatus,
      totalSosAlerts,
      activeSosAlerts,
      recentReports
    ] = await Promise.all([
      prisma.report.count(),
      prisma.report.groupBy({
        by: ['category'],
        _count: { _all: true }
      }),
      prisma.report.groupBy({
        by: ['status'],
        _count: { _all: true }
      }),
      prisma.sOSAlert.count(),
      prisma.sOSAlert.count({
        where: { status: 'ACTIVE' }
      }),
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
        reports: {
          total: totalReports,
          byCategory: countBy(reportsByCategory, 'category'),
          byStatus: countBy(reportsByStatus, 'status')
        },
        sosAlerts: {
          total: totalSosAlerts,
          active: activeSosAlerts
        },
        recentReports
      }
    });
  } catch (error) {
    next(error);
  }
}