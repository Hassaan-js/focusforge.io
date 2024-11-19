import React from 'react';
import { Shield, Brain, Clock, Layout, Trophy, BarChart } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Smart Site Blocking',
    description: 'Block distracting websites with intelligent scheduling and customizable filters.',
    image: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?auto=format&fit=crop&w=800&q=80'
  },
  {
    icon: Brain,
    title: 'Focus Analytics',
    description: 'Track your productivity patterns and receive personalized insights.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'
  },
  {
    icon: Clock,
    title: 'Dynamic Timer',
    description: 'Customizable Pomodoro timer with adaptive break scheduling.',
    image: 'https://images.unsplash.com/photo-1584208124888-3a20b9c799e4?auto=format&fit=crop&w=800&q=80'
  },
  {
    icon: Layout,
    title: 'Workspace Templates',
    description: 'Pre-configured workspace layouts for different types of work.',
    image: 'https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&w=800&q=80'
  },
  {
    icon: Trophy,
    title: 'Achievement System',
    description: 'Gamified productivity with rewards and milestone tracking.',
    image: 'https://images.unsplash.com/photo-1579548122080-c35fd6820ecb?auto=format&fit=crop&w=800&q=80'
  },
  {
    icon: BarChart,
    title: 'Progress Tracking',
    description: 'Visualize your productivity journey with detailed analytics.',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'
  }
];

export function Features() {
  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 astral-text">
            Forge Your Perfect Workflow
          </h2>
          <p className="text-lg text-purple-200/80 max-w-2xl mx-auto">
            Discover powerful features designed to eliminate distractions and maximize your productivity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="glass-card p-6 group hover:scale-105 transition-all duration-300"
            >
              <div className="relative h-48 mb-6 rounded-lg overflow-hidden">
                <img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1120]/80 to-transparent" />
                <feature.icon className="absolute bottom-4 right-4 w-6 h-6 text-purple-400" />
              </div>
              
              <h3 className="text-xl font-semibold mb-3 astral-text">
                {feature.title}
              </h3>
              <p className="text-purple-200/70 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}