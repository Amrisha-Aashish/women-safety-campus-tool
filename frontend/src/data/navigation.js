// Sidebar links for the internal app. `icon` is an <Icon> name; `section` is the
// sidebar group the link is listed under.
export const APP_NAV = [
  { to: '/dashboard', label: 'Dashboard', title: 'Safety dashboard', description: 'Live overview of every report on campus', icon: 'dashboard', section: 'Workspace' },
  { to: '/report', label: 'Report incident', title: 'Report an incident', description: 'Anonymous or with your name. It takes under a minute.', icon: 'file-text', section: 'Workspace' },
  { to: '/map', label: 'Safety map', title: 'Safety map', description: 'Ajeenkya DY Patil University, Lohegaon, Pune', icon: 'map', section: 'Workspace' },
  { to: '/sos-alerts', label: 'SOS alerts', title: 'SOS alerts', description: 'Respond to students who pressed SOS', icon: 'bell', section: 'Admin' },
  { to: '/sos', label: 'SOS', title: 'Emergency SOS', description: 'Alert campus security with your location', icon: 'siren', danger: true, section: 'Emergency' },
];

/** True when `pathname` is `to` or a page below it ("/sos" doesn't match "/sos-alerts"). */
export const isActivePath = (pathname, to) => pathname === to || pathname.startsWith(`${to}/`);

/** The nav item for a path, used for the page title in the top bar. */
export function navItemFor(pathname) {
  return APP_NAV.find((item) => isActivePath(pathname, item.to));
}
