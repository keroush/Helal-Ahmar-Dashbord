'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [selectedTime, setSelectedTime] = useState('24');
  const [displayCount, setDisplayCount] = useState(0);
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());
  const [chartView, setChartView] = useState<'cities' | 'ratio' | 'ranks'>('cities');
  const [volunteerDisplayCount, setVolunteerDisplayCount] = useState(0);
  const [volunteerTargetCount, setVolunteerTargetCount] = useState(3541992);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
  // Random incidents for swiper
  const randomIncidents = [
    'حادثه رانندگی در مسیر مشهد بجنورد، آبگرفتی در روستای مرحنجان',
    'آتش سوزی در جنگل های شمال کشور، عملیات امداد و نجات در حال انجام',
    'سیل در استان خوزستان، تخلیه مناطق پرخطر در دستور کار قرار گرفت',
    'زمین لرزه در شهرستان بم، تیم های امدادی به منطقه اعزام شدند',
  ];
  
  // Event counts based on time period
  const eventCounts: { [key: string]: number } = {
    '24': 176, // Sum of all incident types for 24h
    '48': 257, // Sum of all incident types for 48h (1+5+154+57+2+8+3)
    '72': 340 // Sum of all incident types for 72h (1+5+215+62+1+5+11+7)
  };
  
  const eventCount = eventCounts[selectedTime] || 0;

  // Column labels for status data (25 columns from right to left in Persian)
  const statusLabels = [
    // 'تخلیه آب منازل',
    // 'دریافت کننده اقلام بهداشتی',
    // 'دریافت کننده اقلام زیستی',
    // 'دریافت کننده اقلام غذایی',
    // 'انتقال به مناطق امن',
    // 'خانوار اسکان داده شده',
    // 'افراد اسکان داده شده',
    // 'رهاسازی گرفتارین در برف و سیل (خودرو)',
    // 'رهاسازی گرفتارین در برف و سیل (نفر)',
    // 'تعداد فوتی رهاسازی شده',
    // 'نجات فنی',
    // 'مفقودی جستجو شده توسط آنست',
    // 'فوتی جستجو شده توسط آنست',
    // 'مجموع کل فوتی های در صحنه وحين انتقال',
    // 'کل فوتی حين انتقال',
    'کل فوتی در صحنه',
    'کل افراد نجات یافته توسط جمعیت',
    'کل مصدوم سرپایی توسط جمعیت',
    'کل مصدوم انتقالی توسط جمعیت',
    'کل مصدومان حادثه',
    'کل افراد امداد رسانی شده',
    'کل افراد حادثه دیده',
    'خانوار',
    'تعداد حوادث'
  ];

  // Incident type data with titles, counts, and detailed status (24 hours data)
  const incidentTypes24h = [
    { 
      title: 'آوار', 
      count: 1,
      // All zeros except count
      status: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]
    },
    { 
      title: 'تجمعات انبوه', 
      count: 4,
      // All zeros except count
      status: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4]
    },
    { 
      title: 'ترافیکی', 
      count: 101,
      // Status: [تخلیه آب, بهداشتی, زیستی, غذایی, انتقال, خانوار اسکان, افراد اسکان, خودرو, نفر, فوتی رهاسازی, نجات فنی, مفقودی, فوتی جستجو, مجموع فوتی, فوتی انتقال, فوتی صحنه, نجات یافته, سرپایی, انتقالی, مصدومان, امداد, حادثه دیده, خانوار, تعداد حوادث]
      status: [0, 0, 0, 0, 0, 0, 0, 5, 13, 0, 0, 0, 0, 0, 0, 10, 0, 10, 11, 64, 221, 0, 352, 101]
    },
    { 
      title: 'جوی', 
      count: 46,
      // Status data from chart
      status: [153, 5, 513, 285, 5, 11, 304, 123, 288, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1452, 1463, 311, 46]
    },
    { 
      title: 'صنعتی و کارگاهی', 
      count: 1,
      // Status: [all zeros except مصدوم انتقالی=1, مصدومان=1, حادثه دیده=1, تعداد حوادث=1]
      status: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1]
    },
    { 
      title: 'فوریت های پزشکی', 
      count: 4,
      // Status: [all zeros except نجات یافته=1, سرپایی=3, مصدومان=4, حادثه دیده=4, تعداد حوادث=4]
      status: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 4, 0, 4, 0, 4, 4]
    },
    { 
      title: 'کوهستان', 
      count: 3,
      // Status: [all zeros except مفقودی=1, حادثه دیده=3, تعداد حوادث=3]
      status: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 3]
    },
  ];

  // Incident type data with titles, counts, and detailed status (48 hours data)
  const incidentTypes48h = [
    { 
      title: 'آوار', 
      count: 1,
      // All zeros except count
      status: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]
    },
    { 
      title: 'تجمعات انبوه', 
      count: 5,
      // All zeros except count
      status: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5]
    },
    { 
      title: 'ترافیکی', 
      count: 154,
      // Status data for 48h: [تخلیه آب, بهداشتی, زیستی, غذایی, انتقال, خانوار اسکان, افراد اسکان, خودرو, نفر, فوتی رهاسازی, نجات فنی, مفقودی, فوتی جستجو, مجموع فوتی, فوتی انتقال, فوتی صحنه, نجات یافته, سرپایی, انتقالی, مصدومان, امداد, حادثه دیده, خانوار, تعداد حوادث]
      status: [0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 22, 0, 0, 20, 0, 20, 0, 19, 89, 339, 0, 593, 0, 154]
    },
    { 
      title: 'جوی', 
      count: 57,
      // Status data for 48h
      status: [159, 5, 838, 739, 11, 5, 717, 353, 1010, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2597, 2611, 432, 57]
    },
    { 
      title: 'صنعتی و کارگاهی', 
      count: 2,
      // Status: [all zeros except مصدوم انتقالی=2, مصدومان=2, حادثه دیده=2, تعداد حوادث=2]
      status: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 2, 0, 2]
    },
    { 
      title: 'فوریت های پزشکی', 
      count: 8,
      // Status: [all zeros except سرپایی=1, انتقالی=6, مصدومان=7, حادثه دیده=8, تعداد حوادث=8]
      status: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 6, 7, 0, 8, 0, 8]
    },
    { 
      title: 'کوهستان', 
      count: 3,
      // Status: [all zeros except فوتی جستجو=1, حادثه دیده=3, تعداد حوادث=3]
      status: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 3]
    },
  ];

  // Incident type data with titles, counts, and detailed status (72 hours data)
  const incidentTypes72h = [
    { 
      title: 'آوار', 
      count: 1,
      // All zeros except count
      status: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]
    },
    { 
      title: 'تجمعات انبوه', 
      count: 5,
      // All zeros except count
      status: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5]
    },
    { 
      title: 'ترافیکی', 
      count: 215,
      // Status data for 72h
      status: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 0, 27, 30, 0, 30, 0, 25, 124, 462, 0, 763, 0, 215]
    },
    { 
      title: 'جوی', 
      count: 62,
      // Status data for 72h
      status: [5, 848, 739, 5, 11, 717, 0, 571, 1598, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 3239, 3253, 663, 62]
    },
    { 
      title: 'زمین لرزه', 
      count: 1,
      // All zeros except count
      status: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1]
    },
    { 
      title: 'صنعتی و کارگاهی', 
      count: 5,
      // Status data for 72h
      status: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 4, 5, 0, 6, 0, 5]
    },
    { 
      title: 'فوریت های پزشکی', 
      count: 11,
      // Status data for 72h
      status: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 8, 10, 0, 11, 0, 11]
    },
    { 
      title: 'کوهستان', 
      count: 7,
      // Status data for 72h
      status: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 4, 3, 0, 8, 0, 7]
    },
  ];

  // Get incident types based on selected time
  const incidentTypes = selectedTime === '72' ? incidentTypes72h : selectedTime === '48' ? incidentTypes48h : incidentTypes24h;
  
  // Calculate total (sum of all or just selected card)
  const totalCount = selectedCardIndex !== null
    ? incidentTypes[selectedCardIndex].count
    : incidentTypes.reduce((sum, incident) => sum + incident.count, 0);
  
  // Sticky note colors and rotations (8 colors for 8 incident types in 72h)
  const stickyNoteStyles = [
    { bg: 'bg-yellow-200', rotation: '-rotate-1' },
    { bg: 'bg-pink-200', rotation: 'rotate-1' },
    { bg: 'bg-blue-200', rotation: '-rotate-2' },
    { bg: 'bg-green-200', rotation: 'rotate-1' },
    { bg: 'bg-purple-200', rotation: '-rotate-1' },
    { bg: 'bg-orange-200', rotation: 'rotate-2' },
    { bg: 'bg-yellow-300', rotation: '-rotate-1' },
    { bg: 'bg-cyan-200', rotation: 'rotate-1' },
  ];

  // Animate counting from 0 to target number
  useEffect(() => {
    setDisplayCount(0);
    const duration = 1500; // 1.5 seconds
    const steps = 60;
    const increment = eventCount / steps;
    const stepDuration = duration / steps;
    
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      const nextValue = Math.min(Math.floor(increment * currentStep), eventCount);
      setDisplayCount(nextValue);
      
      if (currentStep >= steps || nextValue >= eventCount) {
        setDisplayCount(eventCount);
        clearInterval(timer);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [eventCount]);

  // Animate volunteer count from 0 to target (initial load) or only last digit (increments)
  useEffect(() => {
    if (isInitialLoad) {
      // Initial load: animate whole number from 0
      setVolunteerDisplayCount(0);
      const duration = 1500; // 1.5 seconds
      const steps = 60;
      const increment = volunteerTargetCount / steps;
      const stepDuration = duration / steps;
      
      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        const nextValue = Math.min(Math.floor(increment * currentStep), volunteerTargetCount);
        setVolunteerDisplayCount(nextValue);
        
        if (currentStep >= steps || nextValue >= volunteerTargetCount) {
          setVolunteerDisplayCount(volunteerTargetCount);
          clearInterval(timer);
          setIsInitialLoad(false);
        }
      }, stepDuration);

      return () => clearInterval(timer);
    } else {
      // Increment: only animate last digit from 0 to new last digit
      const baseNumber = Math.floor(volunteerTargetCount / 10);
      const lastDigit = volunteerTargetCount % 10;
      
      const duration = 500; // 0.5 seconds for last digit
      const steps = 20;
      const stepDuration = duration / steps;
      
      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        const animatedDigit = Math.min(Math.floor((lastDigit / steps) * currentStep), lastDigit);
        setVolunteerDisplayCount(baseNumber * 10 + animatedDigit);
        
        if (currentStep >= steps || animatedDigit >= lastDigit) {
          setVolunteerDisplayCount(volunteerTargetCount);
          clearInterval(timer);
        }
      }, stepDuration);

      return () => clearInterval(timer);
    }
  }, [volunteerTargetCount, isInitialLoad]);

  // Increment volunteer target count by 1 every 10 seconds and update last update time
  useEffect(() => {
    const interval = setInterval(() => {
      setVolunteerTargetCount(prev => prev + 1);
      setLastUpdateTime(new Date());
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-coca-cola-dark flex">
      {/* Left Section - Hero Card */}
      <section className="w-1/2 flex flex-col relative bg-gradient-to-br from-coca-cola-red via-[#d60008] to-coca-cola-red shadow-inner">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"></div>
          <div className="relative z-10 w-full flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="max-w-xl mx-auto space-y-4">
            {/* Title Card */}
            <div className="bg-white rounded-lg shadow-2xl p-6 transform transition-all duration-300">
              <h1 className="text-2xl font-bold text-coca-cola-red text-center leading-relaxed">
                داشبورد رصد و پایش نیروی داوطلبی و خدمات ارائه شده توسط جمعیت هلال احمر
              </h1>
            </div>
            
            {/* Service Count Card */}
            <div className="bg-gradient-to-r from-coca-cola-red via-[#e6000a] to-coca-cola-red rounded-lg shadow-2xl p-3 transform transition-all duration-300 border-2 border-white/20">
              <div className="flex items-center justify-around">
                <div className="flex items-center justify-center gap-3">
                  <span className="text-lg font-semibold text-white">خدمت</span>
                  <span className="text-2xl font-bold text-white drop-shadow-lg">{displayCount}</span>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-lg font-semibold text-white">گذشته</span>
                  <div className="relative inline-block">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none z-10">
                      <div className="bg-white/20 rounded p-1">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    </div>
                    <select
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="pl-12 pr-4 py-2.5 rounded-lg border-2 border-white/30 focus:border-white focus:ring-2 focus:ring-white/20 outline-none text-white font-medium text-base bg-white/10 backdrop-blur-sm transition-all duration-200 appearance-none cursor-pointer hover:bg-white/20 shadow-sm"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23ffffff'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 0.5rem center',
                        backgroundSize: '1.5em 1.5em',
                        paddingRight: '2.5rem'
                      }}
                    >
                      <option value="24" className="bg-coca-cola-red text-white">24 ساعت</option>
                      <option value="48" className="bg-coca-cola-red text-white">48 ساعت</option>
                      <option value="72" className="bg-coca-cola-red text-white">72 ساعت</option>
                    </select>
                  </div>
                  <span className="text-lg font-semibold text-white">حوادث</span>
                </div>
              </div>
            </div>
          </div>

              {/* Incident Type Cards Row */}
          <div className="grid grid-cols-7 gap-3">
            {incidentTypes.slice(0, 7).map((incident, index) => {
              const style = stickyNoteStyles[index];
              const isSelected = selectedCardIndex === index;
              const shouldShow = selectedCardIndex === null || selectedCardIndex === index;
              
              return (
                <div
                  key={index}
                  onClick={() => setSelectedCardIndex(isSelected ? null : index)}
                  className={`${style.bg} ${style.rotation} rounded-sm shadow-lg p-1 py-6 transform transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:z-10 relative border-2 cursor-pointer ${
                    isSelected ? 'border-coca-cola-red border-opacity-80 shadow-2xl scale-105' : 'border-gray-300/30'
                  } ${
                    shouldShow ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                  }`}
                  style={{
                    boxShadow: isSelected 
                      ? '0 8px 12px -2px rgba(244, 0, 9, 0.3), 0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-700 mb-2">{incident.title}</p>
                    <p className="text-2xl font-bold text-gray-800">{incident.count}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Total Card */}
          <div className="bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg shadow-2xl p-2 transform transition-all duration-300 border-2 border-gray-600">
            {selectedCardIndex !== null ? (
              <div className="grid grid-cols-2 gap-2">
                {statusLabels.map((label, idx) => {
                  // Map statusLabels index to status array index
                  // statusLabels indices 0-8 correspond to status indices 15-23
                  const statusIndex = idx + 15;
                  const value = incidentTypes[selectedCardIndex].status[statusIndex];
                  
                  return (
                    <div key={idx} className="bg-white/10 rounded p-2 flex justify-between items-center">
                      <p className="text-white text-lg font-bold">{value.toLocaleString('fa-IR')}</p>
                      <p className="text-white text-sm font-medium flex-1 text-right">{label}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {statusLabels.map((label, idx) => {
                  // Map statusLabels index to status array index
                  // statusLabels indices 0-8 correspond to status indices 15-23
                  const statusIndex = idx + 15;
                  // Sum the value across all incident types
                  const sumValue = incidentTypes.reduce((sum, incident) => sum + incident.status[statusIndex], 0);
                  
                  return (
                    <div key={idx} className="bg-white/10 rounded p-2 flex justify-between items-center">
                      <p className="text-white text-lg font-bold">{sumValue.toLocaleString('fa-IR')}</p>
                      <p className="text-white text-sm font-medium flex-1 text-right">{label}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
            </div>
          
          {/* Incident Type Roller Coaster Swiper - Sticky to Bottom */}
          <div className="bg-gradient-to-r from-coca-cola-red via-[#d60008] to-coca-cola-red rounded-t-lg shadow-xl p-1 px-2 transform transition-all duration-300 border-t-2 border-x-2 border-white/20 overflow-hidden">
            <div className="relative">
              <div className="flex animate-scroll items-center">
                {/* Duplicate content for seamless loop */}
                {[...randomIncidents, ...randomIncidents].map((incident, idx) => (
                  <div key={idx} className="flex gap-2 justify-center items-center mx-3 min-w-[400px] text-center rounded px-3 py-1">
                    <p className="text-white text-xs font-medium whitespace-nowrap">{incident}</p>
                  </div>
                ))}
                {/* Last update time in the scrolling content */}
                <div className="flex gap-2 justify-center items-center mx-3 min-w-[280px] text-center rounded px-3 py-1">
                  <p className="text-white text-xs font-medium">آخرین به‌روزرسانی</p>
                  <p className="text-white text-xs font-bold">
                    {lastUpdateTime.toLocaleString('fa-IR', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
                {/* Duplicate again for seamless loop */}
                {[...randomIncidents, ...randomIncidents].map((incident, idx) => (
                  <div key={`dup-${idx}`} className="flex gap-2 justify-center items-center mx-3 min-w-[400px] text-center rounded px-3 py-1">
                    <p className="text-white text-xs font-medium whitespace-nowrap">{incident}</p>
                  </div>
                ))}
                <div className="flex gap-2 justify-center items-center mx-3 rounded min-w-[280px] text-center px-3 py-1">
                  <p className="text-white text-xs font-medium">آخرین به‌روزرسانی</p>
                  <p className="text-white text-xs font-bold">
                    {lastUpdateTime.toLocaleString('fa-IR', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Right Section */}
      <section 
        className="w-1/2 p-4 space-y-0 overflow-y-auto border-l-2 border-coca-cola-red relative bg-gradient-to-bl from-white via-gray-50 to-white shadow-inner"
        style={{
          backgroundImage: chartView === 'cities' 
            ? 'url("https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80")'
            : chartView === 'ratio'
            ? 'url("https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80")'
            : 'url("https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&q=80")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-white/95 pointer-events-none"></div>
        <div className="relative z-10 w-full max-w-3xl mx-auto space-y-3">
          {/* Volunteer Count Card */}
          <div className="bg-blue-400 rounded-lg shadow-2xl p-3 transform transition-all duration-300">
            <h1 className="text-lg font-bold text-white text-center leading-relaxed mb-2">
              تعداد کل داوطلبین
            </h1>
            <p className="text-2xl font-bold text-white text-center">
              {volunteerDisplayCount.toLocaleString('fa-IR')}
            </p>
          </div>

          {/* Notepad Cards Grid - سازمان جوانان */}
          <div className='flex items-start gap-3'>
            <h2 className="text-lg font-bold text-coca-cola-red text-right flex-shrink-0 w-32">سازمان جوانان</h2>
            <div className="grid grid-cols-8 gap-1 flex-1">
              {[
                { label: 'در دست تکمیل', value: 1347687 },
                { label: 'غنچه های هلال', value: 12294 },
                { label: 'دانش آموزی', value: 282319 },
                { label: 'دانشجویی', value: 81130 },
                { label: 'طلاب', value: 5924 },
                { label: 'روستایی و عشایری', value: 12725 },
                { label: 'جوانان', value: 459671 },
                { label: 'ایثار', value: 13 },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xs shadow-md p-1.5 relative border-l-2 border-red-300 transform transition-all duration-300 hover:shadow-lg"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(transparent, transparent 20px, #e5e7eb 20px, #e5e7eb 21px)',
                    backgroundPosition: '0 0',
                    paddingTop: '4px',
                  }}
                >
                  <div className="flex flex-col gap-2 items-center">
                    <p className="text-xs font-bold text-gray-800 mr-2">{item.value.toLocaleString('fa-IR')}</p>
                    <p className="text-xs font-semibold text-gray-700 flex-1 text-right">{item.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notepad Cards Grid - سازمان داوطلبان */}
            <div className='flex items-start gap-3'>
              <h2 className="text-lg font-bold text-coca-cola-red text-right flex-shrink-0 w-32">سازمان داوطلبان</h2>
              <div className="grid grid-cols-8 gap-1 flex-1">
              {[
                { label: 'در دست تکمیل', value: 45256 },
                { label: 'غنچه های هلال', value: 18305 },
                { label: 'دانش آموزی', value: 5137 },
                { label: 'دانشجویی', value: 604 },
                { label: 'طلاب', value: 89234 },
                { label: 'روستایی و عشایری', value: 234567 },
                { label: 'جوانان', value: 45678 },
                { label: 'ایثار', value: 12345 },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xs shadow-md p-1.5 relative border-l-2 border-red-300 transform transition-all duration-300 hover:shadow-lg"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(transparent, transparent 20px, #e5e7eb 20px, #e5e7eb 21px)',
                    backgroundPosition: '0 0',
                    paddingTop: '4px',
                  }}
                >
                  <div className="flex flex-col gap-2 items-center">
                    <p className="text-xs font-bold text-gray-800 mr-2">{item.value.toLocaleString('fa-IR')}</p>
                    <p className="text-xs font-semibold text-gray-700 flex-1 text-right">{item.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notepad Cards Grid - سازمان امداد و نجات */}
            <div className='flex items-start gap-3'>
              <h2 className="text-lg font-bold text-coca-cola-red text-right flex-shrink-0 w-32">سازمان امداد و نجات</h2>
              <div className="grid grid-cols-8 gap-1 flex-1">
              {[
                { label: 'در دست تکمیل', value: 15678 },
                { label: 'غنچه های هلال', value: 8923 },
                { label: 'دانش آموزی', value: 12345 },
                { label: 'دانشجویی', value: 5678 },
                { label: 'طلاب', value: 2345 },
                { label: 'روستایی و عشایری', value: 3456 },
                { label: 'جوانان', value: 1234 },
                { label: 'ایثار', value: 45678 },
              ].map((item, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xs shadow-md p-1.5 relative border-l-2 border-red-300 transform transition-all duration-300 hover:shadow-lg"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(transparent, transparent 20px, #e5e7eb 20px, #e5e7eb 21px)',
                    backgroundPosition: '0 0',
                    paddingTop: '4px',
                  }}
                >
                  <div className="flex flex-col gap-2 items-center">
                    <p className="text-xs font-bold text-gray-800 mr-2">{item.value.toLocaleString('fa-IR')}</p>
                    <p className="text-xs font-semibold text-gray-700 flex-1 text-right">{item.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* City Chart */}
          <div className="relative">
            <div className="flex justify-start gap-2 mb-3">
              <button
                onClick={() => setChartView('cities')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                  chartView === 'cities' 
                    ? 'bg-coca-cola-red text-white shadow-lg' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                استان
              </button>
              <button
                onClick={() => setChartView('ratio')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                  chartView === 'ratio' 
                    ? 'bg-coca-cola-red text-white shadow-lg' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                جوانان
              </button>
              <button
                onClick={() => setChartView('ranks')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                  chartView === 'ranks' 
                    ? 'bg-coca-cola-red text-white shadow-lg' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                درجات
              </button>
            </div>
            <div className="bg-white rounded-lg shadow-2xl px-4">
            <h2 className="text-lg font-bold text-coca-cola-red text-center mb-4 pt-2">
              {chartView === 'cities' ? 'تعداد داوطلبین بر اساس استان' : 
               chartView === 'ratio' ? 'نسبت داوطلبین جوان به همه داوطلبین' : 
               'تعداد داوطلبین بر اساس درجات'}
            </h2>
            {chartView === 'cities' ? (
              <div className="overflow-x-auto">
              <div className="flex items-end justify-between gap-1 min-h-[220px] pb-6 border-b-2 border-gray-200">
                {(() => {
                  // City data with two sets - using maximum values
                  const cityData = [
                    { name: 'گیلان', value1: 61582, value2: 35186 },
                    { name: 'مازندران', value1: 99242, value2: 71029 },
                    { name: 'گلستان', value1: 62765, value2: 30972 },
                    { name: 'تهران', value1: 224760, value2: 175174 },
                    { name: 'سمنان', value1: 20559, value2: 13082 },
                    { name: 'زنجان', value1: 32888, value2: 20412 },
                    { name: 'قم', value1: 24063, value2: 12688 },
                    { name: 'البرز', value1: 64153, value2: 43402 },
                    { name: 'قزوین', value1: 30100, value2: 25337 },
                    { name: 'اصفهان', value1: 113554, value2: 54143 },
                    { name: 'کرمان', value1: 118268, value2: 71856 },
                    { name: 'یزد', value1: 47594, value2: 31655 },
                    { name: 'چهار محال و بختیاری', value1: 52724, value2: 27863 },
                    { name: 'آذربایجان شرقی', value1: 114902, value2: 34641 },
                    { name: 'آذربایجان غربی', value1: 47424, value2: 24196 },
                    { name: 'اردبیل', value1: 38855, value2: 20330 },
                    { name: 'سیستان و بلوچستان', value1: 54210, value2: 24669 },
                    { name: 'خراسان رضوی', value1: 142166, value2: 59384 },
                    { name: 'خراسان جنوبی', value1: 56069, value2: 22638 },
                    { name: 'خراسان شمالی', value1: 49818, value2: 32464 },
                    { name: 'خوزستان', value1: 79966, value2: 34391 },
                    { name: 'لرستان', value1: 61449, value2: 33141 },
                    { name: 'فارس', value1: 230978, value2: 117291 },
                    { name: 'کهگیلویه و بویر احمد', value1: 25725, value2: 14776 },
                    { name: 'هرمزگان', value1: 66055, value2: 29029 },
                    { name: 'بوشهر', value1: 36480, value2: 25976 },
                    { name: 'همدان', value1: 89337, value2: 25203 },
                    { name: 'کرمانشاه', value1: 70298, value2: 32548 },
                    { name: 'ایلام', value1: 27785, value2: 24682 },
                    { name: 'مرکزی', value1: 26112, value2: 12798 },
                    { name: 'کردستان', value1: 31089, value2: 28520 },
                    { name: 'مرکز مستقل کیش', value1: 405, value2: 547 },
                  ].map(city => ({
                    name: city.name,
                    value: Math.max(city.value1, city.value2)
                  }));
                  
                  const maxValue = Math.max(...cityData.map(c => c.value));
                  
                  return cityData.map((city, idx) => {
                    const height = (city.value / maxValue) * 100;
                    return (
                      <div key={idx} className="flex flex-col items-center flex-1 min-w-[50px]">
                        <div className="w-full flex flex-col items-center justify-end" style={{ height: '100px' }}>
                          <div 
                            className="w-full bg-gradient-to-t from-coca-cola-red to-[#ff1a1a] rounded-t transition-all duration-300 hover:opacity-80 cursor-pointer shadow-sm"
                            style={{ height: `${height}%`, minHeight: city.value > 0 ? '4px' : '0' }}
                            title={`${city.name}: ${city.value.toLocaleString('fa-IR')}`}
                          />
                        </div>
                        <p className="text-[10px] font-semibold text-gray-700 mt-2 text-center leading-tight rotate-[-45deg] origin-bottom-left whitespace-nowrap" style={{ transform: 'rotate(-45deg)', transformOrigin: 'bottom left' }}>
                          {city.name}
                        </p>
                        <p className="text-xs font-bold text-coca-cola-red mt-1">{city.value.toLocaleString('fa-IR')}</p>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
            ) : chartView === 'ratio' ? (
              <div className="overflow-x-auto">
                <div className="flex items-end justify-between gap-1 min-h-[220px] pb-6 border-b-2 border-gray-200">
                  {(() => {
                    // Get city totals from the cities chart data
                    const cityTotals = [
                      { name: 'گیلان', total: 61582 },
                      { name: 'مازندران', total: 99242 },
                      { name: 'گلستان', total: 62765 },
                      { name: 'تهران', total: 224760 },
                      { name: 'سمنان', total: 20559 },
                      { name: 'زنجان', total: 32888 },
                      { name: 'قم', total: 24063 },
                      { name: 'البرز', total: 64153 },
                      { name: 'قزوین', total: 30100 },
                      { name: 'اصفهان', total: 113554 },
                      { name: 'کرمان', total: 118268 },
                      { name: 'یزد', total: 47594 },
                      { name: 'چهار محال و بختیاری', total: 52724 },
                      { name: 'آذربایجان شرقی', total: 114902 },
                      { name: 'آذربایجان غربی', total: 47424 },
                      { name: 'اردبیل', total: 38855 },
                      { name: 'سیستان و بلوچستان', total: 54210 },
                      { name: 'خراسان رضوی', total: 142166 },
                      { name: 'خراسان جنوبی', total: 56069 },
                      { name: 'خراسان شمالی', total: 49818 },
                      { name: 'خوزستان', total: 79966 },
                      { name: 'لرستان', total: 61449 },
                      { name: 'فارس', total: 230978 },
                      { name: 'کهگیلویه و بویر احمد', total: 25725 },
                      { name: 'هرمزگان', total: 66055 },
                      { name: 'بوشهر', total: 36480 },
                      { name: 'همدان', total: 89337 },
                      { name: 'کرمانشاه', total: 70298 },
                      { name: 'ایلام', total: 27785 },
                      { name: 'مرکزی', total: 26112 },
                      { name: 'کردستان', total: 31089 },
                      { name: 'مرکز مستقل کیش', total: 547 },
                    ];
                    
                    // City data with random young volunteer ratios (percentage)
                    const cityData = [
                      { name: 'گیلان', ratio: 12.5 },
                      { name: 'مازندران', ratio: 15.3 },
                      { name: 'گلستان', ratio: 18.7 },
                      { name: 'تهران', ratio: 14.2 },
                      { name: 'سمنان', ratio: 11.8 },
                      { name: 'زنجان', ratio: 16.4 },
                      { name: 'قم', ratio: 9.6 },
                      { name: 'البرز', ratio: 13.9 },
                      { name: 'قزوین', ratio: 17.2 },
                      { name: 'اصفهان', ratio: 19.5 },
                      { name: 'کرمان', ratio: 20.1 },
                      { name: 'یزد', ratio: 14.8 },
                      { name: 'چهار محال و بختیاری', ratio: 16.7 },
                      { name: 'آذربایجان شرقی', ratio: 13.4 },
                      { name: 'آذربایجان غربی', ratio: 15.9 },
                      { name: 'اردبیل', ratio: 12.3 },
                      { name: 'سیستان و بلوچستان', ratio: 18.2 },
                      { name: 'خراسان رضوی', ratio: 17.6 },
                      { name: 'خراسان جنوبی', ratio: 14.5 },
                      { name: 'خراسان شمالی', ratio: 16.1 },
                      { name: 'خوزستان', ratio: 19.3 },
                      { name: 'لرستان', ratio: 15.7 },
                      { name: 'فارس', ratio: 21.2 },
                      { name: 'کهگیلویه و بویر احمد', ratio: 13.1 },
                      { name: 'هرمزگان', ratio: 17.8 },
                      { name: 'بوشهر', ratio: 14.6 },
                      { name: 'همدان', ratio: 16.9 },
                      { name: 'کرمانشاه', ratio: 15.4 },
                      { name: 'ایلام', ratio: 12.7 },
                      { name: 'مرکزی', ratio: 11.9 },
                      { name: 'کردستان', ratio: 18.4 },
                      { name: 'مرکز مستقل کیش', ratio: 22.5 },
                    ].map(city => {
                      const total = cityTotals.find(t => t.name === city.name)?.total || 0;
                      const youngCount = Math.round((total * city.ratio) / 100);
                      return { ...city, total, youngCount };
                    });
                    
                    const maxRatio = Math.max(...cityData.map(c => c.ratio));
                    
                    return cityData.map((city, idx) => {
                      const height = (city.ratio / maxRatio) * 100;
                      return (
                        <div key={idx} className="flex flex-col items-center flex-1 min-w-[50px]">
                          <div className="w-full flex flex-col items-center justify-end" style={{ height: '100px' }}>
                            <div 
                              className="w-full bg-gradient-to-t from-coca-cola-red to-[#ff1a1a] rounded-t transition-all duration-300 hover:opacity-80 cursor-pointer shadow-sm"
                              style={{ height: `${height}%`, minHeight: city.ratio > 0 ? '4px' : '0' }}
                              title={`${city.name}: ${city.ratio.toFixed(1)}%`}
                            />
                          </div>
                          <p className="text-[10px] font-semibold text-gray-700 mt-2 text-center leading-tight rotate-[-45deg] origin-bottom-left whitespace-nowrap" style={{ transform: 'rotate(-45deg)', transformOrigin: 'bottom left' }}>
                            {city.name}
                          </p>
                          <p className="text-xs font-bold text-coca-cola-red mt-1">{city.ratio.toFixed(1)}%</p>
                          <p className="text-[10px] font-semibold text-gray-600 mt-0.5">{city.youngCount.toLocaleString('fa-IR')}</p>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <div className="flex items-end justify-between gap-1 min-h-[220px] pb-6 border-b-2 border-gray-200">
                  {(() => {
                    const ranksData = [
                      { name: 'امدادگر سوم مرد', value: 18013 },
                      { name: 'امدادگر سوم زن', value: 12543 },
                      { name: 'امدادگر دوم مرد', value: 4000 },
                      { name: 'امدادگر دوم زن', value: 3702 },
                      { name: 'امدادگر اول مرد', value: 8590 },
                      { name: 'امدادگر اول زن', value: 5285 },
                      { name: 'نجاتگر سوم مرد', value: 6526 },
                      { name: 'نجاتگر سوم زن', value: 3104 },
                      { name: 'نجاتگر دوم مرد', value: 4425 },
                      { name: 'نجاتگر دوم زن', value: 1656 },
                      { name: 'نجاتگر اول مرد', value: 5538 },
                      { name: 'نجاتگر اول زن', value: 1595 },
                      { name: 'ایثار مرد', value: 546 },
                      { name: 'ایثار زن', value: 58 },
                      { name: 'داوطلب تخصصی مرد', value: 4894 },
                      { name: 'داوطلب تخصصی زن', value: 243 },
                    ];
                    
                    const maxValue = Math.max(...ranksData.map(r => r.value));
                    
                    return ranksData.map((rank, idx) => {
                      const height = (rank.value / maxValue) * 100;
                      return (
                        <div key={idx} className="flex flex-col items-center flex-1 min-w-[50px]">
                          <div className="w-full flex flex-col items-center justify-end" style={{ height: '100px' }}>
                            <div 
                              className="w-full bg-gradient-to-t from-coca-cola-red to-[#ff1a1a] rounded-t transition-all duration-300 hover:opacity-80 cursor-pointer shadow-sm"
                              style={{ height: `${height}%`, minHeight: rank.value > 0 ? '4px' : '0' }}
                              title={`${rank.name}: ${rank.value.toLocaleString('fa-IR')}`}
                            />
                          </div>
                          <p className="text-[10px] font-semibold text-gray-700 mt-2 text-center leading-tight rotate-[-45deg] origin-bottom-left whitespace-nowrap" style={{ transform: 'rotate(-45deg)', transformOrigin: 'bottom left' }}>
                            {rank.name}
                          </p>
                          <p className="text-xs font-bold text-coca-cola-red mt-1">{rank.value.toLocaleString('fa-IR')}</p>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

