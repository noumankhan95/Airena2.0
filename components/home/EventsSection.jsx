import React from 'react';
import { Button } from '@/components/ui/button';
import { CalendarDays } from 'lucide-react';

const events = [
  {
    title: 'NMIMS Sports Live Coverage (upcoming',
    date: '25-26th March, 2025',
    location: ' Air India Ground, Mumbai and Portuguese Ground, Mumbai'  ,
    
  },
  {
    title: 'Shivmudra Pratishthan Chashak 2025 Live',
    date: '25-28th February, 2025',
    location: 'Shramik Gymkhana, Lower Parel, Mumbai',
    
  },
  {
    title: 'Xuberance SNDTWU Sports Festival ',
    date: '10-14th February, 2025',
    location: 'UMIT, SNDTU, Juhu Tara Road, Mumbai',
    
  },
];

const EventsSection = () => {
  return (
    <section className="py-6 sm:py-8 px-3 sm:px-4 bg-black">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white">Upcoming Offline Events</h2>
          <CalendarDays className="h-5 w-5 sm:h-6 sm:w-6 text-green-400" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {events.map((event, index) => (
            <div 
              key={index} 
              className="bg-gray-900/30 rounded-lg overflow-hidden p-4 sm:p-6"
            >
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">{event.title}</h3>
              <div className="space-y-1 mb-4 sm:mb-6">
                <p className="text-sm sm:text-base text-gray-400">{event.date}</p>
                <p className="text-sm sm:text-base text-gray-400">{event.location}</p>
                
              </div>
              <Button 
                className="w-full bg-transparent text-white border border-green-400/70 hover:bg-green-400/10 rounded-md text-sm sm:text-base py-1.5 sm:py-2"
              >
                Register Now
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventsSection;