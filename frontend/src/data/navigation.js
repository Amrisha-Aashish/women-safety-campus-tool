// Sidebar links for the internal app. `icon` is an <Icon> name.
export const APP_NAV = [
  { to: '/dashboard', label: 'Dashboard', title: 'Safety dashboard', description: 'Live overview of every report on campus', icon: 'dashboard' },
  { to: '/report', label: 'Report incident', title: 'Report an incident', description: 'Anonymous or with your name. It takes under a minute.', icon: 'file-text' },
  { to: '/map', label: 'Safety map', title: 'Safety map', description: 'Reported incidents, black spots and risk zones', icon: 'map' },
  { to: '/sos', label: 'SOS', title: 'Emergency SOS', description: 'Alert campus security with your location', icon: 'siren', danger: true },
];

/** The nav item for a path, used for the page title in the top bar. */
export function navItemFor(pathname) {
  return APP_NAV.find((item) => pathname.startsWith(item.to));
}
