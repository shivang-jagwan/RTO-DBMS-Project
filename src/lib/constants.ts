import { LayoutDashboard, Car, AlertTriangle, FileText } from 'lucide-react';

export const NAV_LINKS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/vehicles', label: 'Vehicles', icon: Car },
  { href: '/violations', label: 'Violations', icon: AlertTriangle },
  { href: '/reports', label: 'Reports', icon: FileText },
];
