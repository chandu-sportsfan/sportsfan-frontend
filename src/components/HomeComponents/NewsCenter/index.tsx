"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, Share2, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
// FIX: Using relative path to reach the root types folder
import { NewsArticle } from '../../../../types/news';

export default function NewsCenter() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [date, setDate] = useState<string>("May 11, 2026");

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/news-center`
        );
        const data = await res.json();
        if (data && data.articles) {
          setArticles(data.articles);
        }
      } catch (error) {
        console.error("Error loading news", error);
      }
    };
    fetchNews();
  }, []);

  if (articles.length === 0) return null;

  return (
    <div className="w-full flex flex-col gap-4 py-4 rounded-xl">
      {/* Header Area */}
      <div className="flex justify-between items-center px-2">
        <div>
          <h2 className="text-2xl font-bold text-white">News Center</h2>
          <p className="text-sm text-gray-400">Top stories, match previews & records from around the cricket world.</p>
        </div>
        <Link href="/news-center" className="flex items-center gap-2 px-4 py-2 border border-orange-500 text-orange-500 rounded-full hover:bg-orange-500 hover:text-white transition-all text-sm">
          View All <ArrowRight size={16} />
        </Link>
      </div>

      {/* Carousel Area */}
      <div className="relative flex items-center group w-full bg-[#111111] p-6 rounded-2xl border border-gray-800">
        <button className="absolute left-2 z-10 p-2 bg-black/50 text-white rounded-full border border-gray-600 hover:bg-black transition-all">
          <ChevronLeft size={20} />
        </button>

        {/* Cards Container - Shows 2 at a time on md+ screens */}
        <div className="flex gap-6 overflow-hidden w-full px-8">
          {articles.slice(0, 2).map((article) => (
            <div key={article.rank} className="flex-1 min-w-[300px] flex flex-col justify-between border-l-2 border-orange-500 pl-4 py-2">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl font-bold text-orange-500">0{article.rank}</span>
                    <span className="px-2 py-1 text-[10px] font-bold text-orange-500 border border-orange-500 rounded uppercase tracking-wider">
                      {article.tag}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">{date}</span>
                </div>
                <h3 className="text-lg font-bold text-white leading-tight mb-3 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-sm text-gray-400 line-clamp-4 mb-4">
                  {article.summary}
                </p>
              </div>
              
              <div>
                <p className="text-xs text-gray-500 mb-4">{article.source} • {date}</p>
                <div className="flex items-center justify-between border-t border-gray-800 pt-3">
                  <div className="flex gap-4">
                    <button className="flex items-center gap-1 text-pink-500 hover:text-pink-400 text-sm">
                      <Heart size={16} /> 128
                    </button>
                    <button className="flex items-center gap-1 text-gray-400 hover:text-white text-sm">
                      <Share2 size={16} /> Share
                    </button>
                  </div>
                  <a href={article.url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-pink-500 hover:text-pink-400 text-sm font-semibold">
                    Read More <ArrowRight size={14} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="absolute right-2 z-10 p-2 bg-black/50 text-white rounded-full border border-gray-600 hover:bg-black transition-all">
          <ChevronRight size={20} />
        </button>
        
        {/* Pagination Dots */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            <span className="w-4 h-1 bg-pink-500 rounded-full"></span>
            <span className="w-4 h-1 bg-gray-600 rounded-full"></span>
            <span className="w-4 h-1 bg-gray-600 rounded-full"></span>
            <span className="w-4 h-1 bg-gray-600 rounded-full"></span>
        </div>
      </div>
    </div>
  );
}