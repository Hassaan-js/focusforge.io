import React from 'react';
import { Home, Clock, Shield, Layout, Trophy, BarChart } from 'lucide-react';
import type { Page } from './MainApp';

interface SidebarProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
}

const navItems = [
  { icon: Home, label: 'Dashboard', id: 'dashboard' as const },
  { icon: Clock, label: 'Focus Timer', id: 'timer' as const },
  { icon: Shield, label: 'Site Blocker', id: 'blocker' as const },
  { icon: Layout, label: 'Templates', id: 'templates' as const },
  { icon: Trophy, label: 'Progress', id: 'progress' as const },
  { icon: BarChart, label: 'Analytics', id: 'analytics' as const },
] as const;

export function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  return (
    <aside className="w-72 glass border-r border-white/20">
      <nav className="p-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onPageChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl group transition-all duration-300 ${
              currentPage === item.id
                ? 'glass astral-gradient text-white'
                : 'text-gray-300 glass-hover'
            }`}
          >
            <item.icon className={`w-5 h-5 ${
              currentPage === item.id
                ? 'text-white'
                : 'group-hover:text-purple-400 transition-colors'
            }`} />
            <span className={currentPage === item.id ? 'text-white' : 'group-hover:text-white transition-colors'}>
              {item.label}
            </span>
          </button>
        ))}
      </nav>
    </aside>
  );
}