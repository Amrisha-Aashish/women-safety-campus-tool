const validCategories = new Set(['HARASSMENT', 'STALKING', 'UNSAFE_AREA', 'EMERGENCY', 'OTHER']);

export function validateCreateReport(request, response, next) {
  const { category, description, location } = request.body;

  if (!validCategories.has(category)) {
    return response.status(400).json({
      success: false,
      message: 'category must be HARASSMENT, STALKING, UNSAFE_AREA, EMERGENCY, or OTHER.'
    });
  }

  if (typeof description !== 'string' || description.trim().length < 10 || description.length > 2000) {
    return response.status(400).json({
      success: false,
      message: 'description must contain 10 to 2000 characters.'
    });
  }

  if (!location || typeof location.name !== 'string' || !Number.isFinite(location.latitude) || !Number.isFinite(location.longitude)) {
    return response.status(400).json({
      success: false,
      message: 'location must include name, latitude, and longitude.'
    });
  }

  next();
}
