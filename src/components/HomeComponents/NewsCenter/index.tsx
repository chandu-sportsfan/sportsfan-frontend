"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, Share2, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
// FIX: Using relative path to reach the root types folder
import { NewsArticle } from '../../../../types/news';

type CricketApiArticle = {
  id?: string | number;
  title?: string;
  description?: string[];
  summary?: string;
  badge?: string;
  image?: string;
  cdn_url?: string;
  createdAt?: number | string;
};

// Strip HTML tags from text
const stripHtmlTags = (html: string) => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').trim();
};

// Format timestamp to readable date
const formatDate = (timestamp?: number) => {
  if (!timestamp) return 'May 11, 2026';
  const date = new Date(timestamp);
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

export default function NewsCenter() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [startIndex, setStartIndex] = useState(0);

  const visibleCount = 2;

  const nextSlide = () => {
    if (articles.length <= visibleCount) return;
    setStartIndex((current) => (current + 1) % articles.length);
  };

  const prevSlide = () => {
    if (articles.length <= visibleCount) return;
    setStartIndex((current) => (current - 1 + articles.length) % articles.length);
  };

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Fetch News Center
        const newsRes = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/news-center`
        );
        const newsData = await newsRes.json();
        const newsArticles = (newsData?.articles || []) as NewsArticle[];

        // Try to fetch Cricket Articles from local proxy
        let cricketArticles: CricketApiArticle[] = [];
        try {
          const cricketRes = await fetch('/api/cricket-articles');
          if (cricketRes.ok) {
            const cricketData = await cricketRes.json();
            // Handle different possible response structures
            cricketArticles = cricketData?.articles || cricketData?.data || (Array.isArray(cricketData) ? cricketData : []);
            console.log("Cricket articles fetched:", cricketArticles.length);
          }
        } catch (error) {
          console.warn("Cricket articles fetch failed", error);
        }

        // Transform cricket articles to match NewsArticle structure
        const transformedCricket: NewsArticle[] = (Array.isArray(cricketArticles) ? cricketArticles : [])
          .map((article: CricketApiArticle) => ({
            rank: 0,
            title: article.title || '',
            summary: article.description?.[0] || article.summary || '',
            source: 'SportsFan360',
            url: `/MainModules/CricketArticles/${article.id}`,
            tag: article.badge || 'Cricket',
            cdn_url: article.image || article.cdn_url || '',
            createdAt:
              typeof article.createdAt === 'number'
                ? article.createdAt
                : article.createdAt
                  ? Date.parse(String(article.createdAt))
                  : Date.now()
          }));

        // Merge both arrays
        const mergedArticles = [...newsArticles, ...transformedCricket];

        // Sort by date (latest first)
        mergedArticles.sort((a: NewsArticle, b: NewsArticle) => {
          const dateA = (a.createdAt || 0) as number;
          const dateB = (b.createdAt || 0) as number;
          return dateB - dateA;
        });

        // Reassign ranks based on sorted order
        const rankedArticles = mergedArticles.map((article, index) => ({
          ...article,
          rank: index + 1
        }));

        setArticles(rankedArticles);
      } catch (error) {
        console.error("Error loading news", error);
      }
    };
    fetchNews();
  }, []);

  if (articles.length === 0) return null;

  const visibleArticles = Array.from({ length: Math.min(visibleCount, articles.length) }, (_, offset) => {
    const index = (startIndex + offset) % articles.length;
    return articles[index];
  });

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
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Previous news articles"
          className="absolute left-2 z-10 p-2 bg-black/50 text-white rounded-full border border-gray-600 hover:bg-black transition-all"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Cards Container - Shows 2 at a time on md+ screens */}
        <div className="flex gap-6 overflow-hidden w-full px-8">
          {visibleArticles.map((article) => (
            <div key={article.rank} className="flex-1 min-w-[300px] flex flex-col justify-between border-l-2 border-orange-500 pl-4 py-2">
              <div>
                <div className="flex justify-between items-start mb-3 gap-2">
                  <div className="flex items-start gap-3">
                    <img 
                      src={article.source === 'SportsFan360' && article.cdn_url ? article.cdn_url : '/images/News_center_Default.png'}
                      alt={article.title}
                      className="w-20 h-20 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.src = '/images/News_center_Default.png';
                      }}
                    />
                    <span className="px-2 py-1 text-[10px] font-bold text-orange-500 border border-orange-500 rounded uppercase tracking-wider h-fit">
                      {article.tag}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">{formatDate(article.createdAt)}</span>
                </div>
                <h3 className="text-lg font-bold text-white leading-tight mb-3 line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                  {stripHtmlTags(article.summary)}
                </p>
              </div>
              
              <div>
                <p className="text-xs text-gray-500 mb-4">{article.source} • {formatDate(article.createdAt)}</p>
                <div className="flex items-center justify-between border-t border-gray-800 pt-3">
                  <div className="flex gap-4">
                    <button className="flex items-center gap-1 text-pink-500 hover:text-pink-400 text-sm">
                      <Heart size={16} /> 128
                    </button>
                    <button className="flex items-center gap-1 text-gray-400 hover:text-white text-sm">
                      <Share2 size={16} /> Share
                    </button>
                  </div>
                  {article.source === 'SportsFan360' || article.url.includes('/MainModules/CricketArticles/') ? (
                    <Link href={article.url} className="flex items-center gap-1 text-pink-500 hover:text-pink-400 text-sm font-semibold">
                      Read More <ArrowRight size={14} />
                    </Link>
                  ) : (
                    <a href={article.url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-pink-500 hover:text-pink-400 text-sm font-semibold">
                      Read More <ArrowRight size={14} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next news articles"
          className="absolute right-2 z-10 p-2 bg-black/50 text-white rounded-full border border-gray-600 hover:bg-black transition-all"
        >
          <ChevronRight size={20} />
        </button>
        
        {/* Pagination Dots */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            <span className={`w-4 h-1 rounded-full ${startIndex === 0 ? 'bg-pink-500' : 'bg-gray-600'}`}></span>
            <span className={`w-4 h-1 rounded-full ${startIndex === 1 ? 'bg-pink-500' : 'bg-gray-600'}`}></span>
            <span className={`w-4 h-1 rounded-full ${startIndex === 2 ? 'bg-pink-500' : 'bg-gray-600'}`}></span>
            <span className={`w-4 h-1 rounded-full ${startIndex >= 3 ? 'bg-pink-500' : 'bg-gray-600'}`}></span>
        </div>
      </div>
    </div>
  );
}