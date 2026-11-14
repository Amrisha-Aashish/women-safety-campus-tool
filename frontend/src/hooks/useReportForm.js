import { useState } from 'react';
import { createReport } from '../lib/api.js';

const EMPTY = {
  category: null,
  description: '',
  placeId: null,
  locationName: '',
  latitude: '',
  longitude: '',
  isAnonymous: true,
};

/** Same rules as backend/src/middleware/validate-report.middleware.js, so errors show before sending. */
export function validate(values) {
  const errors = {};
  if (!values.category) errors.category = 'Pick the category that fits best.';
  const text = values.description.trim();
  if (text.length < 10) errors.description = 'Please describe what happened in at least 10 characters.';
  else if (text.length > 2000) errors.description = 'Keep the description under 2000 characters.';
  if (!values.locationName.trim()) errors.locationName = 'Name the place, e.g. “East Gate Walkway”.';
  const lat = Number(values.latitude);
  const lng = Number(values.longitude);
  if (values.latitude === '' || !Number.isFinite(lat) || lat < -90 || lat > 90) errors.latitude = 'Latitude must be between -90 and 90.';
  if (values.longitude === '' || !Number.isFinite(lng) || lng < -180 || lng > 180) errors.longitude = 'Longitude must be between -180 and 180.';
  return errors;
}

/**
 * State, validation and submission for the report form.
 * Errors are shown per field once the user has tried to submit.
 */
export function useReportForm() {
  const [values, setValues] = useState(EMPTY);
  const [submitted, setSubmitted] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [result, setResult] = useState(null);
  const [serverError, setServerError] = useState(null);

  const errors = validate(values);
  const visibleErrors = submitted ? errors : {};

  /** Update one or more fields: set({ description: '…' }) */
  const set = (patch) => setValues((v) => ({ ...v, ...patch }));

  const submit = async () => {
    setSubmitted(true);
    if (Object.keys(errors).length) return false;
    setStatus('sending');
    setServerError(null);
    try {
      const saved = await createReport({
        category: values.category,
        description: values.description.trim(),
        location: {
          name: values.locationName.trim(),
          latitude: Number(values.latitude),
          longitude: Number(values.longitude),
        },
        isAnonymous: values.isAnonymous,
      });
      setResult(saved);
      setStatus('success');
      return true;
    } catch (error) {
      setServerError(error.message);
      setStatus('error');
      return false;
    }
  };

  const reset = () => {
    setValues(EMPTY);
    setSubmitted(false);
    setStatus('idle');
    setResult(null);
    setServerError(null);
  };

  return { values, set, errors: visibleErrors, status, result, serverError, submit, reset };
}
