import React from "react";

interface StoryProps {
  t: (key: string) => string;
}

export default function Story({ t }: StoryProps) {
  return (
    <section id="story" className="py-20 bg-white border-y border-orange-100/50">
      <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
        <span className="text-[#F48B7D] text-xs font-bold uppercase tracking-widest block">
          {t('storyTag')}
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold font-serif text-[#2D2D2D]">
          {t('storyTitle')}
        </h2>
        <p className="text-lg sm:text-xl leading-relaxed text-gray-600 italic font-serif max-w-3xl mx-auto">
          "{t('storyBody1')}"
        </p>
        <div className="w-12 h-1 bg-rose-200 mx-auto rounded-full"></div>
        <p className="text-sm sm:text-base leading-relaxed text-gray-500 max-w-2xl mx-auto">
          {t('storyBody2')}
        </p>
      </div>
    </section>
  );
}
