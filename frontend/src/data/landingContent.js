// Copy for the landing page sections. `icon` is a lucide-react icon component.
import { Bell, ChartColumn, EyeOff, Funnel, LayoutDashboard, Map as MapIcon, Route, User } from 'lucide-react';

export const STEPS = [
  {
    title: 'Report',
    text: 'A student notes what happened, where and when. Anonymous reporters get a pseudonym like “CalmRiver4821” instead of their name.',
  },
  {
    title: 'Analyse',
    text: 'Reports are grouped by place and hour. Places that keep coming up become black spots; busy hours become red time zones.',
  },
  {
    title: 'Prevent',
    text: 'Administrators see the patterns live and act first: more lighting, patrols at the right hour, a guard where one is missing.',
  },
];

export const FEATURES = [
  { icon: EyeOff, title: 'Anonymous reporting', text: 'Report without revealing who you are. Your name never reaches the dashboard.' },
  { icon: User, title: 'Named reporting', text: 'Choose to share your identity when you want follow-up from the safety team.' },
  { icon: Funnel, title: 'Clear categories', text: 'Harassment, stalking, unsafe areas, emergencies and other concerns.' },
  { icon: LayoutDashboard, title: 'Live admin dashboard', text: 'Totals, open vs resolved, categories and the latest reports, refreshed automatically.' },
  { icon: MapIcon, title: 'Campus safety map', text: 'Every report and risk zone on a real map, filterable by category.' },
  { icon: ChartColumn, title: 'Risk analytics', text: 'Find the riskiest places and hours so preventive action goes where it matters.' },
  { icon: Bell, title: 'SOS alerts', text: 'One large button, a confirmation step and your location sent with the alert.' },
  { icon: Route, title: 'Safe routes', text: 'Route guidance and walking companions around black spots.', soon: true },
];
