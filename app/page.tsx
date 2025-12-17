"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [selectedTime, setSelectedTime] = useState("24");
  const [displayCount, setDisplayCount] = useState(0);
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(
    null
  );
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());
  const [chartView, setChartView] = useState<"cities" | "ratio" | "ranks">(
    "cities"
  );
  const [volunteerDisplayCount, setVolunteerDisplayCount] = useState(0);
  const [volunteerTargetCount, setVolunteerTargetCount] = useState(3431992);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  // Random incidents for swiper
  const randomIncidents = [
    "حادثه رانندگی در مسیر مشهد بجنورد، آبگرفتی در روستای مرحنجان",
    "آتش سوزی در جنگل های شمال کشور، عملیات امداد و نجات در حال انجام",
    "سیل در استان خوزستان، تخلیه مناطق پرخطر در دستور کار قرار گرفت",
    "زمین لرزه در شهرستان بم، تیم های امدادی به منطقه اعزام شدند",
  ];

  // Event counts based on time period
  const eventCounts: { [key: string]: number } = {
    "24": 176, // Sum of all incident types for 24h
    "48": 257, // Sum of all incident types for 48h (1+5+154+57+2+8+3)
    "72": 340, // Sum of all incident types for 72h (1+5+215+62+1+5+11+7)
  };

  const eventCount = eventCounts[selectedTime] || 0;

  // Column labels for status data with icons
  const statusLabels = [
    {
      label: "نجات فنی",
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
    },
    {
      label: "مفقودی جستجو شده توسط آنست",
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>',
    },
    {
      label: "فوتی جستجو شده توسط آنست",
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',
    },
    {
      label: "کل فوتی در صحنه",
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M2 12h20"/><circle cx="12" cy="12" r="4"/></svg>',
    },
    {
      label: "کل افراد نجات یافته توسط جمعیت",
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="m22 8-4 4-2-2"/></svg>',
    },
    {
      label: "کل مصدوم سرپایی توسط جمعیت",
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    },
    {
      label: "کل مصدوم انتقالی توسط جمعیت",
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="m16 8 4 4-4 4"/><path d="M20 12H8"/></svg>',
    },
    {
      label: "کل مصدومان حادثه",
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3"/><path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4"/><circle cx="20" cy="10" r="2"/></svg>',
    },
    {
      label: "کل افراد امداد رسانی شده",
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>',
    },
    {
      label: "کل افراد حادثه دیده",
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    },
    {
      label: "خانوار",
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
    },
    {
      label: "تعداد حوادث",
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>',
    },
  ];

  // Incident type data with titles, counts, and detailed status (24 hours data)
  const incidentTypes24h = [
    {
      title: "آوار",
      count: 1,
      // All zeros except count
      status: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
      ],
    },
    {
      title: "تجمعات انبوه",
      count: 4,
      // All zeros except count
      status: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
      ],
    },
    {
      title: "ترافیکی",
      count: 101,
      // Status: [تخلیه آب, بهداشتی, زیستی, غذایی, انتقال, خانوار اسکان, افراد اسکان, خودرو, نفر, فوتی رهاسازی, نجات فنی, مفقودی, فوتی جستجو, مجموع فوتی, فوتی انتقال, فوتی صحنه, نجات یافته, سرپایی, انتقالی, مصدومان, امداد, حادثه دیده, خانوار, تعداد حوادث]
      status: [
        0, 0, 0, 0, 0, 0, 0, 5, 13, 0, 0, 0, 0, 0, 0, 10, 0, 10, 11, 64, 221, 0,
        352, 101,
      ],
    },
    {
      title: "جوی",
      count: 46,
      // Status data from chart
      status: [
        153, 5, 513, 285, 5, 11, 304, 123, 288, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,
        1452, 1463, 311, 46,
      ],
    },
    {
      title: "صنعتی و کارگاهی",
      count: 1,
      // Status: [all zeros except مصدوم انتقالی=1, مصدومان=1, حادثه دیده=1, تعداد حوادث=1]
      status: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1,
      ],
    },
    {
      title: "فوریت های پزشکی",
      count: 4,
      // Status: [all zeros except نجات یافته=1, سرپایی=3, مصدومان=4, حادثه دیده=4, تعداد حوادث=4]
      status: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 3, 4, 0, 4, 0, 4, 4,
      ],
    },
    {
      title: "کوهستان",
      count: 3,
      // Status: [all zeros except مفقودی=1, حادثه دیده=3, تعداد حوادث=3]
      status: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 3,
      ],
    },
  ];

  // Incident type data with titles, counts, and detailed status (48 hours data)
  const incidentTypes48h = [
    {
      title: "آوار",
      count: 1,
      // All zeros except count
      status: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
      ],
    },
    {
      title: "تجمعات انبوه",
      count: 5,
      // All zeros except count
      status: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5,
      ],
    },
    {
      title: "ترافیکی",
      count: 154,
      // Status data for 48h: [تخلیه آب, بهداشتی, زیستی, غذایی, انتقال, خانوار اسکان, افراد اسکان, خودرو, نفر, فوتی رهاسازی, نجات فنی, مفقودی, فوتی جستجو, مجموع فوتی, فوتی انتقال, فوتی صحنه, نجات یافته, سرپایی, انتقالی, مصدومان, امداد, حادثه دیده, خانوار, تعداد حوادث]
      status: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 9, 22, 0, 0, 20, 0, 20, 0, 19, 89, 339, 0,
        593, 0, 154,
      ],
    },
    {
      title: "جوی",
      count: 57,
      // Status data for 48h
      status: [
        159, 5, 838, 739, 11, 5, 717, 353, 1010, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 2597, 2611, 432, 57,
      ],
    },
    {
      title: "صنعتی و کارگاهی",
      count: 2,
      // Status: [all zeros except مصدوم انتقالی=2, مصدومان=2, حادثه دیده=2, تعداد حوادث=2]
      status: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 2, 0, 2,
      ],
    },
    {
      title: "فوریت های پزشکی",
      count: 8,
      // Status: [all zeros except سرپایی=1, انتقالی=6, مصدومان=7, حادثه دیده=8, تعداد حوادث=8]
      status: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 6, 7, 0, 8, 0, 8,
      ],
    },
    {
      title: "کوهستان",
      count: 3,
      // Status: [all zeros except فوتی جستجو=1, حادثه دیده=3, تعداد حوادث=3]
      status: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 3,
      ],
    },
  ];

  // Incident type data with titles, counts, and detailed status (72 hours data)
  const incidentTypes72h = [
    {
      title: "آوار",
      count: 1,
      // All zeros except count
      status: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
      ],
    },
    {
      title: "تجمعات انبوه",
      count: 5,
      // All zeros except count
      status: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5,
      ],
    },
    {
      title: "ترافیکی",
      count: 215,
      // Status data for 72h
      status: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 0, 27, 30, 0, 30, 0, 25, 124, 462, 0,
        763, 0, 215,
      ],
    },
    {
      title: "جوی",
      count: 62,
      // Status data for 72h
      status: [
        5, 848, 739, 5, 11, 717, 0, 571, 1598, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1,
        3239, 3253, 663, 62,
      ],
    },
    {
      title: "زمین لرزه",
      count: 1,
      // All zeros except count
      status: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
      ],
    },
    {
      title: "صنعتی و کارگاهی",
      count: 5,
      // Status data for 72h
      status: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 4, 5, 0, 6, 0, 5,
      ],
    },
    {
      title: "فوریت های پزشکی",
      count: 11,
      // Status data for 72h
      status: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 8, 10, 0, 11, 0,
        11,
      ],
    },
    {
      title: "کوهستان",
      count: 7,
      // Status data for 72h
      status: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 4, 3, 0, 8, 0, 7,
      ],
    },
  ];

  // Get incident types based on selected time
  const incidentTypes =
    selectedTime === "72"
      ? incidentTypes72h
      : selectedTime === "48"
      ? incidentTypes48h
      : incidentTypes24h;

  // SVG Logo mapping for each incident type
  const incidentLogos: { [key: string]: string } = {
    آوار: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4M9 9v0M9 12v0M9 15v0M9 18v0"/></svg>`,
    "تجمعات انبوه": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    ترافیکی: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 17H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-1"/><path d="M12 15v5"/><path d="M8 20h8"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>`,
    جوی: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 13v8M8 13v8M12 15v8M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"/></svg>`,
    "صنعتی و کارگاهی": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3h18v18H3zM3 9h18M9 3v18"/></svg>`,
    "فوریت های پزشکی": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
    کوهستان: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3l4 8 5-5 5 15H2L8 3z"/></svg>`,
    "زمین لرزه": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>`,
  };

  // Calculate total (sum of all or just selected card)
  const totalCount =
    selectedCardIndex !== null
      ? incidentTypes[selectedCardIndex].count
      : incidentTypes.reduce((sum, incident) => sum + incident.count, 0);

  // Sticky note colors and rotations (8 colors for 8 incident types in 72h)
  const stickyNoteStyles = [
    { bg: "bg-yellow-200", rotation: "-rotate-1" },
    { bg: "bg-pink-200", rotation: "rotate-1" },
    { bg: "bg-blue-200", rotation: "-rotate-2" },
    { bg: "bg-green-200", rotation: "rotate-1" },
    { bg: "bg-purple-200", rotation: "-rotate-1" },
    { bg: "bg-orange-200", rotation: "rotate-2" },
    { bg: "bg-yellow-300", rotation: "-rotate-1" },
    { bg: "bg-cyan-200", rotation: "rotate-1" },
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
      const nextValue = Math.min(
        Math.floor(increment * currentStep),
        eventCount
      );
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
        const nextValue = Math.min(
          Math.floor(increment * currentStep),
          volunteerTargetCount
        );
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
        const animatedDigit = Math.min(
          Math.floor((lastDigit / steps) * currentStep),
          lastDigit
        );
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
      setVolunteerTargetCount((prev) => prev + 1);
      setLastUpdateTime(new Date());
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-coca-cola-dark flex flex-col lg:flex-row">
      {/* Left Section - Hero Card */}
      <section className="w-full lg:w-1/2 flex flex-col relative bg-gradient-to-br from-coca-cola-red via-[#d60008] to-coca-cola-red shadow-inner min-h-screen lg:min-h-0">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"></div>
        <div className="relative z-10 w-full flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="max-w-xl mx-auto px-2 sm:px-0 space-y-4">
              {/* Title Card */}
              <div className="bg-white rounded-lg shadow-2xl p-3 sm:p-6 transform transition-all duration-300 relative overflow-hidden">
                <div className="flex items-center justify-center gap-3">
                  {/* Red Moon Icon */}
                  <svg
                    fill="#e21313ff"
                    width="30px"
                    height="30px"
                    viewBox="0 0 24 24"
                    id="moon-alt"
                    data-name="Flat Color"
                    xmlns="http://www.w3.org/2000/svg"
                    transform="matrix(-1, 0, 0, 1, 0, 0)"
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0" />

                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />

                    <g id="SVGRepo_iconCarrier">
                      <path
                        id="primary"
                        d="M12,2h-.46a1,1,0,0,0-.44,1.86A5.94,5.94,0,0,1,14,9,6,6,0,0,1,3.93,13.4a1,1,0,0,0-1.65,1A10,10,0,1,0,12,2Z"
                        fill="#e21313ff"
                      />
                    </g>
                  </svg>
                  <h1 className="text-sm font-bold text-coca-cola-red text-center leading-relaxed">
                    داشبورد رصد و پایش نیروی داوطلبی و خدمات ارائه شده توسط
                    جمعیت هلال احمر
                  </h1>
                  {/* Red Moon Icon */}
                  {/* <svg
                    fill="#e21313ff"
                    width="30px"
                    height="30px"
                    viewBox="0 0 24 24"
                    id="moon-alt"
                    data-name="Flat Color"
                    xmlns="http://www.w3.org/2000/svg"
                    transform="matrix(-1, 0, 0, 1, 0, 0)"
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0" />

                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />

                    <g id="SVGRepo_iconCarrier">
                      <path
                        id="primary"
                        d="M12,2h-.46a1,1,0,0,0-.44,1.86A5.94,5.94,0,0,1,14,9,6,6,0,0,1,3.93,13.4a1,1,0,0,0-1.65,1A10,10,0,1,0,12,2Z"
                        fill="#e21313ff"
                      />
                    </g>
                  </svg> */}
                </div>
              </div>

              {/* Service Count Card */}
              <div className="bg-gradient-to-r from-coca-cola-red via-[#e6000a] to-coca-cola-red rounded-lg shadow-2xl p-2 transform transition-all duration-300 border-2 border-white/20 overflow-visible relative z-40">
                <div className="flex flex-col sm:flex-row items-center justify-around gap-2 sm:gap-0">
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-md font-semibold text-white">
                      خدمت
                    </span>
                    <span className="text-2xl font-bold text-white drop-shadow-md">
                      {displayCount}
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    <span className="text-md font-semibold text-white">
                      گذشته
                    </span>
                    <div className="relative inline-block">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none z-10">
                        <div className="bg-white/20 rounded p-1">
                          <svg
                            className="w-5 h-5 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="relative z-550 ml-2">
                        <button
                          onClick={() => setShowDatePicker(!showDatePicker)}
                          className="pl-10 pr-2 py-1.5 rounded-md border-2 border-white/30 focus:border-white focus:ring-2 focus:ring-white/20 outline-none text-white font-medium text-base bg-white/10 backdrop-blur-sm transition-all duration-200 cursor-pointer hover:bg-white/20 shadow-sm flex items-center gap-1"
                        >
                          <span>
                            {selectedTime === "24"
                              ? "24 ساعت"
                              : selectedTime === "48"
                              ? "48 ساعت"
                              : selectedTime === "72"
                              ? "72 ساعت"
                              : "بازه سفارشی"}
                          </span>
                          <svg
                            className={`w-4 h-4 transition-transform ${
                              showDatePicker ? "rotate-180" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>
                        {/* Integrated Dropdown with Calendar */}
                        {showDatePicker && (
                          <div className="absolute top-full mt-1 -left-[60%] bg-gradient-to-br from-coca-cola-red to-rose-700 rounded-xl shadow-2xl z-[9999] min-w-[300px] border-2 border-white/20">
                            {/* Quick Options */}
                            <div className="p-2 border-b border-white/20 z-300">
                              <div className="grid grid-cols-3 gap-2">
                                {[
                                  { value: "24", label: "24 ساعت" },
                                  { value: "48", label: "48 ساعت" },
                                  { value: "72", label: "72 ساعت" },
                                ].map((option) => (
                                  <button
                                    key={option.value}
                                    onClick={() => {
                                      setSelectedTime(option.value);
                                      setShowDatePicker(false);
                                    }}
                                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                                      selectedTime === option.value
                                        ? "bg-white text-coca-cola-red shadow-lg"
                                        : "bg-white/20 text-white hover:bg-white/30"
                                    }`}
                                  >
                                    {option.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                            {/* Custom Date Section */}
                            <div className="p-3">
                              <h3 className="text-white text-sm font-bold mb-3 text-center">
                                انتخاب بازه زمانی
                              </h3>
                              <div className="space-y-3">
                                <div className="bg-white/10 rounded-lg p-2">
                                  <label className="block text-white/80 text-xs mb-1 text-right">
                                    از تاریخ
                                  </label>
                                  <input
                                    type="date"
                                    value={customStartDate}
                                    onChange={(e) =>
                                      setCustomStartDate(e.target.value)
                                    }
                                    className="w-full px-3 py-2 bg-white/90 border-0 rounded-lg text-gray-800 text-sm focus:ring-2 focus:ring-white"
                                    style={{ colorScheme: "light" }}
                                  />
                                </div>
                                <div className="bg-white/10 rounded-lg p-2">
                                  <label className="block text-white/80 text-xs mb-1 text-right">
                                    تا تاریخ
                                  </label>
                                  <input
                                    type="date"
                                    value={customEndDate}
                                    onChange={(e) =>
                                      setCustomEndDate(e.target.value)
                                    }
                                    className="w-full px-3 py-2 bg-white/90 border-0 rounded-lg text-gray-800 text-sm focus:ring-2 focus:ring-white"
                                    style={{ colorScheme: "light" }}
                                  />
                                </div>
                                <button
                                  onClick={() => {
                                    if (customStartDate && customEndDate) {
                                      setSelectedTime("custom");
                                      setShowDatePicker(false);
                                    }
                                  }}
                                  className="w-full py-2.5 bg-white text-coca-cola-red rounded-lg font-bold hover:bg-white/90 transition-colors shadow-lg"
                                >
                                  اعمال بازه سفارشی
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="text-md font-semibold text-white">
                      حوادث
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Incident Type Cards Row */}
            <div className="max-w-2xl mx-auto px-2 sm:px-0 relative">
              {/* {selectedCardIndex !== null && (
              <div 
                className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
                style={{
                  opacity: 0.3,
                  width: '50px',
                  height: '50px',
                  color: 'white',
                  top: '5%',
                  left: `${selectedCardIndex === 6 ? '81' : selectedCardIndex * 15 + 10}%`,
                  animation: 'fadeIn 0.2s ease-in',
                }}
                dangerouslySetInnerHTML={{
                  __html: incidentLogos[incidentTypes[selectedCardIndex]?.title] || ''
                }}
              />
            )} */}
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2 sm:gap-3 relative z-10">
                {incidentTypes.slice(0, 7).map((incident, index) => {
                  const style = stickyNoteStyles[index];
                  const isSelected = selectedCardIndex === index;
                  const hasSelection = selectedCardIndex !== null;

                  return (
                    <div
                      key={index}
                      onClick={() =>
                        setSelectedCardIndex(isSelected ? null : index)
                      }
                      className={`${style.bg} ${
                        style.rotation
                      } rounded-sm shadow-lg p-1 pt-3 pb-2 transform transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:z-10 relative border-2 cursor-pointer overflow-visible ${
                        isSelected
                          ? "border-coca-cola-red border-opacity-80 shadow-2xl scale-105 opacity-100"
                          : hasSelection
                          ? "border-gray-300/30 opacity-60"
                          : "border-gray-300/30 opacity-100"
                      }`}
                      style={{
                        boxShadow: isSelected
                          ? "0 8px 12px -2px rgba(244, 0, 9, 0.3), 0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                          : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.05)",
                      }}
                    >
                      {/* Red Pin when selected */}
                      {isSelected && (
                        <div className="absolute -top-2 -right-2 transform -translate-x-1/2 z-20 rotate-[0.4rad]">
                          <svg
                            width="14"
                            height="22"
                            viewBox="0 0 24 32"
                            className="drop-shadow-lg"
                          >
                            {/* Pin needle */}
                            <line
                              x1="12"
                              y1="14"
                              x2="12"
                              y2="32"
                              stroke="#9CA3AF"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                            {/* Red ball head with gradient */}
                            <defs>
                              <radialGradient
                                id={`pinGradient-${index}`}
                                cx="30%"
                                cy="30%"
                                r="70%"
                              >
                                <stop offset="0%" stopColor="#ff6b6b" />
                                <stop offset="50%" stopColor="#dc2626" />
                                <stop offset="100%" stopColor="#991b1b" />
                              </radialGradient>
                            </defs>
                            <circle
                              cx="12"
                              cy="10"
                              r="10"
                              fill={`url(#pinGradient-${index})`}
                            />
                            {/* Shine highlight */}
                            <ellipse
                              cx="8"
                              cy="7"
                              rx="3"
                              ry="2"
                              fill="white"
                              opacity="0.4"
                            />
                          </svg>
                        </div>
                      )}
                      <div className="flex flex-col items-center text-center relative z-10">
                        <div
                          className="w-6 h-6 mb-2 text-gray-600"
                          dangerouslySetInnerHTML={{
                            __html: incidentLogos[incident.title] || "",
                          }}
                        />
                        <p className="text-sm font-semibold text-gray-700 mb-2">
                          {incident.title}
                        </p>
                        <p className="text-2xl font-bold text-gray-800">
                          {incident.count}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Total Card */}
            <div className="max-w-2xl mx-auto px-2 sm:px-0">
              <div className="bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg shadow-2xl p-2 transform transition-all duration-300 border-2 border-gray-600">
                {selectedCardIndex !== null ? (
                  <div className="grid grid-cols-2 gap-2">
                    {statusLabels.map((item, idx) => {
                      // Map statusLabels index to status array index
                      // statusLabels indices 0-2 correspond to status indices 10-12, indices 3-11 correspond to status indices 15-23
                      const statusIndex = idx < 3 ? idx + 10 : idx + 12;
                      const value =
                        incidentTypes[selectedCardIndex].status[statusIndex];

                      return (
                        <div
                          key={idx}
                          className="bg-white/10 rounded p-2 flex justify-between items-center gap-2"
                        >
                          <p className="text-white text-lg font-bold">
                            {value.toLocaleString("fa-IR")}
                          </p>
                          <div className="flex items-center gap-2 flex-1 justify-end">
                            <p className="text-white text-sm font-medium text-right">
                              {item.label}
                            </p>
                            <div
                              className="w-4 h-4 text-white/70 flex-shrink-0"
                              dangerouslySetInnerHTML={{ __html: item.icon }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {statusLabels.map((item, idx) => {
                      // Map statusLabels index to status array index
                      // statusLabels indices 0-2 correspond to status indices 10-12, indices 3-11 correspond to status indices 15-23
                      const statusIndex = idx < 3 ? idx + 10 : idx + 12;
                      // Sum the value across all incident types
                      const sumValue = incidentTypes.reduce(
                        (sum, incident) => sum + incident.status[statusIndex],
                        0
                      );

                      return (
                        <div
                          key={idx}
                          className="bg-white/10 rounded p-2 flex justify-between items-center gap-2"
                        >
                          <p className="text-white text-lg font-bold">
                            {sumValue.toLocaleString("fa-IR")}
                          </p>
                          <div className="flex items-center gap-2 flex-1 justify-end">
                            <p className="text-white text-sm font-medium text-right">
                              {item.label}
                            </p>
                            <div
                              className="w-4 h-4 text-white/70 flex-shrink-0"
                              dangerouslySetInnerHTML={{ __html: item.icon }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Incident Type Roller Coaster Swiper - Sticky to Bottom */}
          <div className="relative">
            {/* Last update time - absolute positioned on top */}
            <div className="absolute bg-white opacity-90 rounded-full -top-7 left-[1%] translate z-10 px-2 py-1 flex gap-2 items-center">
              <p className="text-coca-cola-red text-[10px]">
                آخرین به‌روزرسانی
              </p>
              <p className="text-coca-cola-red text-[10px]">
                {lastUpdateTime.toLocaleString("fa-IR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </p>
            </div>
            <div className="bg-gradient-to-r from-coca-cola-red via-[#d60008] to-coca-cola-red rounded-t-lg shadow-xl p-1 px-2 transform transition-all duration-300 border-t-2 border-x-2 border-white/20 overflow-hidden">
              <div className="relative">
                <div className="flex animate-scroll items-center">
                  {/* Duplicate content for seamless loop */}
                  {[...randomIncidents, ...randomIncidents].map(
                    (incident, idx) => (
                      <div
                        key={idx}
                        className="flex gap-2 justify-center items-center mx-3 min-w-[400px] text-center rounded px-3 py-1"
                      >
                        <p className="text-white text-sm font-medium whitespace-nowrap">
                          {incident}
                        </p>
                      </div>
                    )
                  )}
                  {/* Duplicate again for seamless loop */}
                  {[...randomIncidents, ...randomIncidents].map(
                    (incident, idx) => (
                      <div
                        key={`dup-${idx}`}
                        className="flex gap-2 justify-center items-center mx-3 min-w-[400px] text-center rounded px-3 py-1"
                      >
                        <p className="text-white text-sm font-medium whitespace-nowrap">
                          {incident}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Right Section */}
      <section className="w-full lg:w-1/2 p-2 sm:p-4 space-y-0 overflow-y-auto border-t-2 lg:border-t-0 lg:border-l-2 border-coca-cola-red relative min-h-screen lg:min-h-0">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 pointer-events-none">
          {/* Decorative shapes */}
          <div className="absolute top-10 right-10 w-72 h-72 bg-gradient-to-br from-blue-200/40 to-purple-200/40 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-to-br from-pink-200/30 to-orange-200/30 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-br from-emerald-200/30 to-teal-200/30 rounded-full blur-3xl"></div>
          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
          {/* Floating dots */}
          <div className="absolute top-20 left-20 w-3 h-3 bg-blue-400/50 rounded-full animate-pulse"></div>
          <div
            className="absolute top-40 right-32 w-2 h-2 bg-purple-400/50 rounded-full animate-pulse"
            style={{ animationDelay: "0.5s" }}
          ></div>
          <div
            className="absolute bottom-32 left-40 w-4 h-4 bg-pink-400/40 rounded-full animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute bottom-60 right-20 w-2 h-2 bg-emerald-400/50 rounded-full animate-pulse"
            style={{ animationDelay: "1.5s" }}
          ></div>
        </div>
        <div className="relative z-10 w-full max-w-3xl mx-auto space-y-3">
          {/* 2x2 Grid - Volunteer Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            {/* سازمان جوانان */}
            <div className="bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 rounded-2xl shadow-xl p-3 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl relative overflow-hidden">
              {/* <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div> */}
              <h2 className="text-sm font-bold text-white text-center mb-2 flex items-center justify-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
                سازمان جوانان
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1">
                {[
                  { label: "غنچه های هلال", value: 12294 },
                  { label: "دانش آموزی", value: 282319 },
                  { label: "دانشجویی", value: 81130 },
                  { label: "طلاب", value: 5924 },
                  { label: "روستایی و عشایری", value: 12725 },
                  { label: "جوانان", value: 459671 },
                  { label: "ایثار", value: 13 },
                  { label: "در حال تکمیل", value: 1347687 },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="bg-white/20 backdrop-blur-sm rounded-lg px-1.5 py-3 hover:bg-white/30 transition-all cursor-default"
                  >
                    <p className="text-xs font-bold text-white text-center">
                      {item.value.toLocaleString("fa-IR")}
                    </p>
                    <p className="text-[9px] text-white/80 text-center leading-tight">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Volunteer Count Card */}
            <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-700 rounded-2xl shadow-xl p-4 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <svg
                    className="w-6 h-6 text-white/80"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <h1 className="text-base font-bold text-white/90">
                    تعداد کل داوطلبین
                  </h1>
                </div>
                <p className="text-3xl font-black text-white text-center drop-shadow-lg mb-3">
                  {volunteerDisplayCount.toLocaleString("fa-IR")}
                </p>
                {/* Organization Totals */}
                <div className="grid grid-cols-3 gap-1.5">
                  <div className="bg-emerald-500/30 backdrop-blur-sm rounded-lg px-2 py-2 text-center">
                    <p className="text-sm font-bold text-white">
                      {(2201763).toLocaleString("fa-IR")}
                    </p>
                    <p className="text-[8px] text-white/80">سازمان جوانان</p>
                  </div>
                  <div className="bg-amber-500/30 backdrop-blur-sm rounded-lg px-2 py-2 text-center">
                    <p className="text-sm font-bold text-white">
                      {(1210227).toLocaleString("fa-IR")}
                    </p>
                    <p className="text-[8px] text-white/80">سازمان داوطلبان</p>
                  </div>
                  <div className="bg-rose-500/30 backdrop-blur-sm rounded-lg px-2 py-2 text-center">
                    <p className="text-sm font-bold text-white">
                      {(80718).toLocaleString("fa-IR")}
                    </p>
                    <p className="text-[8px] text-white/80">
                      سازمان امداد و نجات
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* سازمان داوطلبان */}
            <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-red-600 rounded-2xl shadow-xl p-3 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl relative overflow-hidden">
              {/* <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div> */}
              <h2 className="text-sm font-bold text-white text-center mb-2 flex items-center justify-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                سازمان داوطلبان
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1">
                {[
                  { label: "حمایت", value: 35357 },
                  { label: "هدایت", value: 71831 },
                  { label: "مشارکت", value: 249129 },
                  { label: "مهارت", value: 55577 },
                  { label: "در حال تکمیل", value: 798333 },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="bg-white/20 backdrop-blur-sm rounded-lg px-1.5 py-3 hover:bg-white/30 transition-all cursor-default"
                  >
                    <p className="text-xs font-bold text-white text-center">
                      {item.value.toLocaleString("fa-IR")}
                    </p>
                    <p className="text-[9px] text-white/80 text-center leading-tight">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* سازمان امداد و نجات */}
            <div className="bg-gradient-to-br from-rose-500 via-pink-600 to-purple-700 rounded-2xl shadow-xl p-3 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl relative overflow-hidden">
              {/* <div className="absolute top-0 left-0 w-16 h-16 bg-white/10 rounded-full -translate-y-1/2 -translate-x-1/2"></div> */}
              <h2 className="text-sm font-bold text-white text-center mb-2 flex items-center justify-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                سازمان امداد و نجات
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1">
                {[
                  { label: "امدادگر سوم", value: 30556 },
                  { label: "امدادگر دوم", value: 7702 },
                  { label: "امدادگر اول", value: 13875 },
                  { label: "نجاتگر سوم", value: 9630 },
                  { label: "نجاتگر دوم", value: 6081 },
                  { label: "نجاتگر اول", value: 7133 },
                  { label: "ایثار", value: 604 },
                  { label: "داوطلب تخصصی", value: 5137 },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="bg-white/20 backdrop-blur-sm rounded-lg px-1.5 py-3 hover:bg-white/30 transition-all cursor-default"
                  >
                    <p className="text-xs font-bold text-white text-center">
                      {item.value.toLocaleString("fa-IR")}
                    </p>
                    <p className="text-[9px] text-white/80 text-center leading-tight">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* City Chart */}
          <div className="relative">
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-3">
              <button
                onClick={() => setChartView("cities")}
                className={`px-5 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-2 ${
                  chartView === "cities"
                    ? "bg-gradient-to-r from-coca-cola-red to-rose-600 text-white shadow-lg shadow-red-200 scale-105"
                    : "bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white hover:shadow-md border border-gray-200"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                داوطلبان استان
              </button>
              <button
                onClick={() => setChartView("ratio")}
                className={`px-5 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-2 ${
                  chartView === "ratio"
                    ? "bg-gradient-to-r from-coca-cola-red to-rose-600 text-white shadow-lg shadow-red-200 scale-105"
                    : "bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white hover:shadow-md border border-gray-200"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
                جوانان استان
              </button>
              <button
                onClick={() => setChartView("ranks")}
                className={`px-5 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-2 ${
                  chartView === "ranks"
                    ? "bg-gradient-to-r from-coca-cola-red to-rose-600 text-white shadow-lg shadow-red-200 scale-105"
                    : "bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white hover:shadow-md border border-gray-200"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                درجات امدادگران
              </button>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl px-2 border border-white/50 relative overflow-hidden">
              {/* Background pattern */}
              <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                  backgroundImage:
                    chartView === "cities"
                      ? `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23dc2626' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M0 40L40 0H20L0 20M40 40V20L20 40'/%3E%3C/g%3E%3C/svg%3E")`
                      : chartView === "ratio"
                      ? `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23dc2626' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")`
                      : `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23dc2626' fill-opacity='1' fill-rule='evenodd'%3E%3Cpath d='M12 0v24M0 12h24' stroke='%23dc2626' stroke-width='1'/%3E%3C/g%3E%3C/svg%3E")`,
                }}
              ></div>
              {/* Decorative corner shapes */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-coca-cola-red/5 to-transparent rounded-bl-full"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-coca-cola-red/5 to-transparent rounded-tr-full"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-coca-cola-red via-rose-500 to-pink-500"></div>
              <h2 className="text-lg font-bold bg-gradient-to-r from-coca-cola-red to-rose-600 bg-clip-text text-transparent text-center mb-4 pt-4 flex items-center justify-center gap-2 relative z-10">
                <span className="w-8 h-0.5 bg-gradient-to-r from-transparent to-coca-cola-red rounded-full"></span>
                {chartView === "cities"
                  ? "تعداد جمعیت داوطلبین به تفکیک استان"
                  : chartView === "ratio"
                  ? "تعداد جمعیت جوانان به تفکیک استان"
                  : "تعداد امدادگران به تفکیک جنسیت و درجات "}
                <span className="w-8 h-0.5 bg-gradient-to-l from-transparent to-coca-cola-red rounded-full"></span>
              </h2>
              {chartView === "cities" ? (
                <div className="overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
                  <div className="flex items-end justify-between gap-1 min-h-[220px] pb-6 border-b-2 border-gray-200 min-w-[800px] lg:min-w-0">
                    {(() => {
                      // City volunteer data
                      const cityData = [
                        { name: "گیلان", value: 35186 },
                        { name: "مازندران", value: 71029 },
                        { name: "گلستان", value: 30972 },
                        { name: "تهران", value: 175174 },
                        { name: "سمنان", value: 13082 },
                        { name: "زنجان", value: 20412 },
                        { name: "قم", value: 12688 },
                        { name: "البرز", value: 43402 },
                        { name: "قزوین", value: 25337 },
                        { name: "اصفهان", value: 54143 },
                        { name: "کرمان", value: 71856 },
                        { name: "یزد", value: 31655 },
                        { name: "چهارمحال و بختیاری", value: 27863 },
                        { name: "آذربایجان شرقی", value: 34641 },
                        { name: "آذربایجان غربی", value: 24196 },
                        { name: "اردبیل", value: 20330 },
                        { name: "سیستان و بلوچستان", value: 24669 },
                        { name: "خراسان رضوی", value: 59384 },
                        { name: "خراسان جنوبی", value: 22638 },
                        { name: "خراسان شمالی", value: 32464 },
                        { name: "خوزستان", value: 34391 },
                        { name: "لرستان", value: 33141 },
                        { name: "فارس", value: 117291 },
                        { name: "کهگیلویه و بویر احمد", value: 14776 },
                        { name: "هرمزگان", value: 29029 },
                        { name: "بوشهر", value: 25976 },
                        { name: "همدان", value: 25203 },
                        { name: "کرمانشاه", value: 32548 },
                        { name: "ایلام", value: 24682 },
                        { name: "مرکزی", value: 12798 },
                        { name: "کردستان", value: 28520 },
                        { name: "مرکز مستقل کیش", value: 547 },
                      ];

                      const maxValue = Math.max(
                        ...cityData.map((c) => c.value)
                      );

                      return cityData.map((city, idx) => {
                        const height = (city.value / maxValue) * 100;
                        const colors = [
                          // "from-rose-500 to-red-600",
                          // "from-orange-500 to-amber-600",
                          // "from-emerald-500 to-teal-600",
                          // "from-blue-500 to-indigo-600",
                          // "from-purple-500 to-violet-600",
                          // "from-pink-500 to-rose-600",
                          "from-coca-cola-red to-coca-cola-red",
                        ];
                        const colorClass = colors[idx % colors.length];
                        return (
                          <div
                            key={idx}
                            className="flex flex-col items-center flex-1 min-w-[17.5px] group"
                          >
                            <div
                              className="w-full mb-2 flex flex-col items-center justify-end"
                              style={{ height: "100px" }}
                            >
                              <div
                                className={`w-full bg-gradient-to-t ${colorClass} rounded-t-full transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg cursor-pointer relative overflow-visible`}
                                style={{
                                  height: `${height}%`,
                                  minHeight: city.value > 0 ? "4px" : "0",
                                }}
                                title={`${
                                  city.name
                                }: ${city.value.toLocaleString("fa-IR")}`}
                              >
                                <div className="absolute inset-0 bg-gradient-to-t from-white/0 to-white/20"></div>
                                <p
                                  className="absolute w-full z-10 bottom-1 left-0 text-xs text-black whitespace-nowrap "
                                  style={{
                                    transform: "rotate(-90deg)",
                                  }}
                                >
                                  {city.value.toLocaleString("fa-IR")}
                                </p>
                              </div>
                            </div>
                            <p
                              className="text-[10px] mb-20 w-full text-star font-semibold text-gray-600 whitespace-nowrap group-hover:text-gray-900 transition-colors"
                              style={{
                                transform: "rotate(-90deg)",
                                direction: "rtl",
                              }}
                            >
                              {city.name}
                            </p>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              ) : chartView === "ratio" ? (
                <div className="overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
                  <div className="flex items-end justify-between gap-1 min-h-[220px] pb-6 border-b-2 border-gray-200 min-w-[800px] lg:min-w-0">
                    {(() => {
                      // Youth volunteer data by city
                      const cityData = [
                        { name: "گیلان", value: 61582 },
                        { name: "مازندران", value: 99242 },
                        { name: "گلستان", value: 62765 },
                        { name: "تهران", value: 224760 },
                        { name: "سمنان", value: 20559 },
                        { name: "زنجان", value: 32888 },
                        { name: "قم", value: 24063 },
                        { name: "البرز", value: 64153 },
                        { name: "قزوین", value: 30100 },
                        { name: "اصفهان", value: 113554 },
                        { name: "کرمان", value: 118268 },
                        { name: "یزد", value: 47594 },
                        { name: "چهارمحال و بختیاری", value: 52724 },
                        { name: "آذربایجان شرقی", value: 114902 },
                        { name: "آذربایجان غربی", value: 47424 },
                        { name: "اردبیل", value: 38855 },
                        { name: "سیستان و بلوچستان", value: 54210 },
                        { name: "خراسان رضوی", value: 142166 },
                        { name: "خراسان جنوبی", value: 56069 },
                        { name: "خراسان شمالی", value: 49818 },
                        { name: "خوزستان", value: 79966 },
                        { name: "لرستان", value: 61449 },
                        { name: "فارس", value: 230978 },
                        { name: "کهگیلویه و بویر احمد", value: 25725 },
                        { name: "هرمزگان", value: 66055 },
                        { name: "بوشهر", value: 36480 },
                        { name: "همدان", value: 89337 },
                        { name: "کرمانشاه", value: 70298 },
                        { name: "ایلام", value: 27785 },
                        { name: "مرکزی", value: 26112 },
                        { name: "کردستان", value: 31089 },
                        { name: "مرکز مستقل کیش", value: 405 },
                      ];

                      const maxValue = Math.max(
                        ...cityData.map((c) => c.value)
                      );

                      return cityData.map((city, idx) => {
                        const height = (city.value / maxValue) * 100;
                        const colors = ["from-coca-cola-red to-coca-cola-red"];
                        const colorClass = colors[idx % colors.length];
                        return (
                          <div
                            key={idx}
                            className="flex flex-col items-center flex-1 min-w-[17.5px] group"
                          >
                            <div
                              className="w-full mb-2 flex flex-col items-center justify-end"
                              style={{ height: "100px" }}
                            >
                              <div
                                className={`w-full bg-gradient-to-t ${colorClass} rounded-t-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg cursor-pointer relative overflow-visible`}
                                style={{
                                  height: `${height}%`,
                                  minHeight: city.value > 0 ? "4px" : "0",
                                }}
                                title={`${
                                  city.name
                                }: ${city.value.toLocaleString("fa-IR")}`}
                              >
                                <div className="absolute inset-0 bg-gradient-to-t from-white/0 to-white/20"></div>
                                <p
                                  className="absolute w-full z-10 bottom-1 left-0 text-xs text-black whitespace-nowrap"
                                  style={{
                                    transform: "rotate(-90deg)",
                                  }}
                                >
                                  {city.value.toLocaleString("fa-IR")}
                                </p>
                              </div>
                            </div>
                            <p
                              className="text-[10px] mb-20 w-full text-star font-semibold text-gray-600 whitespace-nowrap group-hover:text-gray-900 transition-colors"
                              style={{
                                transform: "rotate(-90deg)",
                                direction: "rtl",
                              }}
                            >
                              {city.name}
                            </p>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
                  <div className="flex items-end justify-between gap-1 min-h-[220px] pb-6 border-b-2 border-gray-200 min-w-[500px] lg:min-w-0">
                    {(() => {
                      const ranksData = [
                        { name: "امدادگر سوم مرد", value: 18013 },
                        { name: "امدادگر سوم زن", value: 12543 },
                        { name: "امدادگر دوم مرد", value: 4000 },
                        { name: "امدادگر دوم زن", value: 3702 },
                        { name: "امدادگر اول مرد", value: 8590 },
                        { name: "امدادگر اول زن", value: 5285 },
                        { name: "نجاتگر سوم مرد", value: 6526 },
                        { name: "نجاتگر سوم زن", value: 3104 },
                        { name: "نجاتگر دوم مرد", value: 4425 },
                        { name: "نجاتگر دوم زن", value: 1656 },
                        { name: "نجاتگر اول مرد", value: 5538 },
                        { name: "نجاتگر اول زن", value: 1595 },
                        { name: "ایثار مرد", value: 546 },
                        { name: "ایثار زن", value: 58 },
                        { name: "داوطلب تخصصی مرد", value: 4894 },
                        { name: "داوطلب تخصصی زن", value: 243 },
                      ];

                      const maxValue = Math.max(
                        ...ranksData.map((r) => r.value)
                      );

                      return ranksData.map((rank, idx) => {
                        const height = (rank.value / maxValue) * 100;
                        const colors = ["from-coca-cola-red to-coca-cola-red"];
                        const colorClass = colors[idx % colors.length];
                        return (
                          <div
                            key={idx}
                            className="flex flex-col items-center flex-1 min-w-[10px] group"
                          >
                            <div
                              className="w-full mb-4 flex flex-col items-center justify-end"
                              style={{ height: "100px" }}
                            >
                              <div
                                className={`w-full bg-gradient-to-t ${colorClass} rounded-t-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg cursor-pointer relative overflow-visible`}
                                style={{
                                  height: `${height}%`,
                                  minHeight: rank.value > 0 ? "4px" : "0",
                                }}
                                title={`${
                                  rank.name
                                }: ${rank.value.toLocaleString("fa-IR")}`}
                              >
                                <div className="absolute inset-0 bg-gradient-to-t from-white/0 to-white/20"></div>
                                <p
                                  className="absolute w-full z-10 bottom-4 left-0 text-xs text-black whitespace-nowrap"
                                  style={{
                                    transform: "rotate(-90deg)",
                                  }}
                                >
                                  {rank.value.toLocaleString("fa-IR")}
                                </p>
                              </div>
                            </div>
                            <p
                              className="text-[10px] mb-20 w-full text-star font-semibold text-gray-600 whitespace-nowrap group-hover:text-gray-900 transition-colors"
                              style={{
                                transform: "rotate(-90deg)",
                                direction: "rtl",
                              }}
                            >
                              {rank.name}
                            </p>
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
