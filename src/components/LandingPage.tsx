import React from 'react';
import { Features } from './Features';
import { Hero } from './Hero';
import { Navbar } from './Navbar';

export function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
    </div>
  );
}