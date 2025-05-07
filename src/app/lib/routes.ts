// Navigation routes for the application
// This file defines all the navigation routes used throughout the app

export interface NavItem {
  name: string;
  href: string;
}

export const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/' },
  { name: 'Athletes', href: '/athletes' },
  { name: 'Events', href: '/events' },
  { name: 'Results', href: '/results' },
  { name: 'Training', href: '/training' },
  { name: 'Coaches', href: '/coaches' },
  { name: 'Reports', href: '/reports' },
];
