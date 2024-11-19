import React, { useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Dashboard } from './Dashboard';
import { FocusTimer } from './pages/FocusTimer';
import { SiteBlocker } from './pages/SiteBlocker';
import { Templates } from './pages/Templates';
import { Progress } from './pages/Progress';
import { Analytics } from './pages/Analytics';

export type Page = 'dashboard' | 'timer' | 'blocker' | 'templates' | 'progress' | 'analytics';

export function MainApp() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'timer':
        return <FocusTimer />;
      case 'blocker':
        return <SiteBlocker />;
      case 'templates':
        return <Templates />;
      case 'progress':
        return <Progress />;
      case 'analytics':
        return <Analytics />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
        <main className="flex-1 overflow-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}