"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Bell, Search, Heart, Share2, ArrowRight, Calendar, CheckCircle2 } from 'lucide-react';
// FIX: Using relative path from app/news-center/page.tsx to types/news.ts
import { NewsArticle } from '../../types/news'; 

export default function DetailedNewsCenter() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [date, setDate] = useState<string>("May 11, 2026");

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/news-center`
        );
        const data = await res.json();
        if (data && data.articles) setArticles(data.articles);
      } catch (error) {
        console.error("Error loading news", error);
      }
    };
    fetchNews();
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8 font-sans">
      {/* Header */}
      <Link href="/" className="flex items-center gap-2 text-pink-500 mb-6 hover:text-pink-400 w-fit">
        <ArrowLeft size={20} /> Back to Home
      </Link>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">News Center</h1>
          <p className="text-gray-400">Your one-stop destination for top stories, match previews & records from around the cricket world.</p>
          <p className="text-sm mt-2 text-gray-500">By <span className="text-pink-500">SportsFan360</span></p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-700 rounded-lg text-sm hover:bg-gray-800">
            <Share2 size={16} /> Share
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-pink-500 hover:bg-pink-600 rounded-lg text-sm font-semibold">
            Follow News Center <Bell size={16} />
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content: List */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Search & Sort Bar */}
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="text" 
                placeholder="Search news, teams, players, topics..." 
                className="w-full bg-[#111] border border-gray-800 rounded-lg py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-pink-500"
              />
            </div>
            <div className="w-48 relative hidden md:block">
               {/* Simplified Sort Dropdown for UI accuracy */}
               <select className="w-full bg-[#111] border border-gray-800 rounded-lg py-3 px-4 appearance-none text-sm focus:outline-none">
                  <option>Sort by: Latest First</option>
               </select>
            </div>
          </div>

          {/* Cards List */}
          {articles.map((article, index) => (
            <div key={index} className="bg-[#111] border border-gray-800 rounded-xl p-6 flex flex-col md:flex-row gap-6">
               <div className="flex items-start gap-4 md:w-[100px] shrink-0">
                  <span className="text-5xl font-bold text-orange-500">0{article.rank}</span>
               </div>
               
               <div className="flex-1">
                 <div className="flex justify-between items-center mb-2">
                    <span className="px-2 py-1 text-[10px] font-bold text-orange-500 border border-orange-500 rounded uppercase tracking-wider">
                      {article.tag}
                    </span>
                    <span className="text-xs text-gray-500">{date}</span>
                 </div>
                 <h2 className="text-xl font-bold mb-2">{article.title}</h2>
                 <p className="text-sm text-gray-400 mb-4">{article.summary}</p>
                 <p className="text-xs text-gray-500 mb-4">{article.source} • {date}</p>
                 
                 <div className="flex items-center justify-between border-t border-gray-800 pt-4">
                  <div className="flex gap-6">
                    <button className="flex items-center gap-1 text-pink-500 hover:text-pink-400 text-sm">
                      <Heart size={16} fill="currentColor" /> 128
                    </button>
                    <button className="flex items-center gap-1 text-gray-400 hover:text-white text-sm">
                      <Share2 size={16} /> Share
                    </button>
                  </div>
                  <a href={article.url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-pink-500 hover:text-pink-400 text-sm font-semibold">
                    Read More <ArrowRight size={16} />
                  </a>
                 </div>
               </div>
            </div>
          ))}
        </div>

        {/* Sidebar Filters */}
        <div className="w-full lg:w-80 flex flex-col gap-6">
          {/* Archive */}
          <div className="bg-[#111] border border-gray-800 rounded-xl p-5">
             <h3 className="text-sm font-bold text-gray-400 mb-4 flex items-center gap-2">
               <Calendar size={16} /> Archive (Date Wise)
             </h3>
             <ul className="space-y-3">
               <li className="flex justify-between text-sm items-center bg-pink-500/10 text-pink-500 p-2 rounded">
                 <span className="flex items-center gap-2"><Calendar size={14}/> May 11, 2026</span>
                 <span className="bg-pink-500 text-white text-xs px-2 py-0.5 rounded-full">5</span>
               </li>
               <li className="flex justify-between text-sm items-center text-gray-400 p-2 hover:bg-gray-800 rounded cursor-pointer">
                 <span className="flex items-center gap-2"><Calendar size={14}/> May 10, 2026</span>
                 <span className="bg-gray-800 text-gray-400 text-xs px-2 py-0.5 rounded-full">12</span>
               </li>
             </ul>
             <button className="w-full mt-4 py-2 border border-gray-700 text-sm text-gray-400 rounded-lg hover:bg-gray-800">
               View Older Archives ↓
             </button>
          </div>

          {/* Sort By Radio */}
          <div className="bg-[#111] border border-gray-800 rounded-xl p-5">
            <h3 className="text-sm font-bold text-white mb-4">Sort By</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 text-sm text-gray-300 cursor-pointer">
                <input type="radio" name="sort" className="accent-pink-500 w-4 h-4" defaultChecked /> Latest First
              </label>
              <label className="flex items-center gap-3 text-sm text-gray-500 cursor-pointer">
                <input type="radio" name="sort" className="accent-pink-500 w-4 h-4" /> Oldest First
              </label>
              <label className="flex items-center gap-3 text-sm text-gray-500 cursor-pointer">
                <input type="radio" name="sort" className="accent-pink-500 w-4 h-4" /> Most Liked
              </label>
            </div>
          </div>

          {/* Filter By Category */}
          <div className="bg-[#111] border border-gray-800 rounded-xl p-5">
            <h3 className="text-sm font-bold text-white mb-4">Filter By Category</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 text-sm text-pink-500 cursor-pointer">
                <input type="checkbox" className="accent-pink-500 w-4 h-4 rounded" defaultChecked /> 
                <span className="flex items-center gap-2"><CheckCircle2 size={16}/> All Categories</span>
              </label>
              <label className="flex items-center gap-3 text-sm text-gray-400 cursor-pointer">
                <input type="checkbox" className="accent-pink-500 w-4 h-4 rounded" /> Narrative
              </label>
              <label className="flex items-center gap-3 text-sm text-gray-400 cursor-pointer">
                <input type="checkbox" className="accent-pink-500 w-4 h-4 rounded" /> Record
              </label>
              <label className="flex items-center gap-3 text-sm text-gray-400 cursor-pointer">
                <input type="checkbox" className="accent-pink-500 w-4 h-4 rounded" /> Elimination
              </label>
            </div>
            <button className="w-full mt-6 py-2 border border-pink-500/50 text-pink-500 text-sm rounded-lg hover:bg-pink-500/10 transition-colors">
               ←→ Reset Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}