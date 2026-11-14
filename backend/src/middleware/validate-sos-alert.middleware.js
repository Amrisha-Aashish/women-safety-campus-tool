export function validateCreateSosAlert(request, response, next) {
  const { latitude, longitude } = request.body;

  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
    return response.status(400).json({ success: false, message: 'latitude must be a number between -90 and 90.' });
  }

  if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180) {
    return response.status(400).json({ success: false, message: 'longitude must be a number between -180 and 180.' });
  }

  next();
}
