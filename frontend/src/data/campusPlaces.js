// Known campus places, used by the report form's place picker and the map.
// Coordinates sit around the example point from the backend README
// (23.3441, 85.3096). Replace them with the real campus before launch.
export const CAMPUS_CENTER = { latitude: 23.3441, longitude: 85.3096 };

/**
 * Campus boundary as [latitude, longitude] corners, in order. Reports must be
 * inside it, and the map shows only this area. Keep it identical to
 * backend/src/config/campus.js. Replace with the real campus outline.
 */
export const CAMPUS_BOUNDARY = [
  [23.3484, 85.3058],
  [23.3484, 85.3128],
  [23.3466, 85.3142],
  [23.3416, 85.3142],
  [23.3402, 85.3124],
  [23.3402, 85.3058],
];

export const CAMPUS_PLACES = [
  { id: 'main-gate', name: 'Main Gate', latitude: 23.3412, longitude: 85.3071 },
  { id: 'east-gate', name: 'East Gate Walkway', latitude: 23.3441, longitude: 85.3131 },
  { id: 'library', name: 'Central Library', latitude: 23.3446, longitude: 85.3089 },
  { id: 'academic', name: 'Academic Block', latitude: 23.3431, longitude: 85.3098 },
  { id: 'admin', name: 'Admin Block', latitude: 23.3421, longitude: 85.3084 },
  { id: 'canteen', name: 'Canteen', latitude: 23.3453, longitude: 85.3104 },
  { id: 'girls-hostel', name: "Girls' Hostel", latitude: 23.3467, longitude: 85.3117 },
  { id: 'boys-hostel', name: "Boys' Hostel", latitude: 23.3469, longitude: 85.3074 },
  { id: 'sports', name: 'Sports Ground', latitude: 23.3424, longitude: 85.3119 },
  { id: 'parking', name: 'Parking Lot', latitude: 23.3409, longitude: 85.3101 },
  { id: 'back-road', name: 'Back Road (behind hostels)', latitude: 23.3478, longitude: 85.3096 },
  { id: 'auditorium', name: 'Auditorium', latitude: 23.3438, longitude: 85.3076 },
];
