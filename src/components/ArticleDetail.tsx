import React, { useState, useEffect } from 'react';
import { Article, Comment } from '../types/blog';
import {
  ArrowLeft,
  Bookmark,
  Share2,
  Heart,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Check,
  MessageSquare,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface ArticleDetailProps {
  article: Article;
  onBack: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (e: React.MouseEvent, articleId: string) => void;
  allArticles: Article[];
  onSelectArticle: (article: Article) => void;
  onOpenGenerator: () => void;
}

export const ArticleDetail: React.FC<ArticleDetailProps> = ({
  article,
  onBack,
  isBookmarked,
  onToggleBookmark,
  allArticles,
  onSelectArticle,
  onOpenGenerator,
}) => {
  const [claps, setClaps] = useState(article.initialClaps);
  const [hasClapped, setHasClapped] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  // Comments state
  const [comments, setComments] = useState<Comment[]>(article.comments);
  const [newCommentName, setNewCommentName] = useState('');
  const [newCommentRole, setNewCommentRole] = useState('');
  const [newCommentContent, setNewCommentContent] = useState('');

  // Scroll progress listener
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
        setReadingProgress(progress);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Audio simulation timer
  useEffect(() => {
    let interval: any;
    if (isPlayingAudio) {
      interval = setInterval(() => {
        setAudioProgress((prev) => {
          if (prev >= 100) {
            setIsPlayingAudio(false);
            return 0;
          }
          return prev + 1.5;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlayingAudio]);

  const handleClap = () => {
    setClaps((prev) => prev + 1);
    setHasClapped(true);
  };

  const handleCopyLink = () => {
    const cleanUrl = `https://startup-sphere-seo.vercel.app/articles/${article.slug}`;
    navigator.clipboard?.writeText(cleanUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentContent.trim()) return;

    const initials = (newCommentName.trim() || 'AN')
      .split(' ')
      .map((w) => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

    const newComment: Comment = {
      id: `comment-${comments.length + 1}`,
      authorName: newCommentName.trim() || 'Anonymous Founder',
      authorRole: newCommentRole.trim() || 'Startup Sphere Reader',
      authorAvatar: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" rx="50" fill="%2344403c"/><text x="50%" y="54%" font-family="system-ui, sans-serif" font-weight="700" font-size="36" fill="%23ffffff" dominant-baseline="middle" text-anchor="middle">${initials}</text></svg>`,
      createdAt: 'Just now',
      content: newCommentContent.trim(),
      likes: 1,
    };

    setComments([newComment, ...comments]);
    setNewCommentContent('');
    setNewCommentName('');
    setNewCommentRole('');
  };

  const relatedArticles = allArticles
    .filter((a) => a.id !== article.id)
    .filter((a) => a.category === article.category || Math.random() > 0.5)
    .slice(0, 3);

  const getFontSizeClass = () => {
    if (fontSize === 'large') return 'text-lg leading-relaxed';
    if (fontSize === 'xlarge') return 'text-xl leading-loose';
    return 'text-base leading-relaxed';
  };

  return (
    <div className="pb-24">
      {/* Reading Progress Bar */}
      <div
        className="fixed top-16 left-0 h-[3px] bg-stone-900 z-50 transition-all duration-150"
        style={{ width: `${readingProgress}%` }}
      />

      {/* Top Navigation Bar */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-4 flex items-center justify-between text-sm text-stone-600">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 hover:text-stone-950 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to all articles
        </button>

        <div className="flex items-center gap-2">
          {/* Font size toggle */}
          <div className="flex items-center gap-1 border border-stone-200 rounded-lg p-0.5 bg-white text-xs">
            <button
              onClick={() => setFontSize('normal')}
              className={`px-2 py-1 rounded ${fontSize === 'normal' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:text-stone-950'}`}
              title="Standard font size"
            >
              A
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`px-2 py-1 rounded font-medium ${fontSize === 'large' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:text-stone-950'}`}
              title="Larger font size"
            >
              A+
            </button>
          </div>

          <button
            onClick={(e) => onToggleBookmark(e, article.id)}
            className="p-2 border border-stone-200 rounded-lg hover:border-stone-400 bg-white text-stone-700 transition-colors"
            title={isBookmarked ? 'Bookmarked' : 'Bookmark story'}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
          </button>

          <button
            onClick={handleCopyLink}
            className="p-2 border border-stone-200 rounded-lg hover:border-stone-400 bg-white text-stone-700 transition-colors flex items-center gap-1 text-xs"
            title="Share article"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Article Container */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 mt-6">
        
        {/* Header Metadata (Zero-Pill Discipline) */}
        <div className="flex items-center gap-2 text-xs font-semibold text-stone-500 mb-4 uppercase tracking-wider">
          <span className="text-amber-800">{article.category}</span>
          <span aria-hidden="true">·</span>
          <span>{article.readTime}</span>
          <span aria-hidden="true">·</span>
          <span>{article.publishedDate}</span>
        </div>

        {/* Article Title */}
        <h1
          className="font-editorial text-3xl sm:text-5xl font-bold text-stone-950 leading-[1.18] mb-6"
          style={{ textWrap: 'balance' }}
        >
          {article.title}
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-stone-600 leading-relaxed mb-8">
          {article.subtitle}
        </p>

        {/* Author Byline & Audio Listen Player */}
        <div className="py-4 border-y border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <img
              src={article.author.avatar}
              alt={article.author.name}
              className="w-11 h-11 rounded-full object-cover border border-stone-200"
            />
            <div>
              <p className="text-sm font-semibold text-stone-900">{article.author.name}</p>
              <p className="text-xs text-stone-500">{article.author.role}</p>
            </div>
          </div>

          {/* Audio Listen Simulation Bar */}
          <div className="flex items-center gap-3 bg-stone-100 px-3.5 py-2 rounded-lg border border-stone-200 text-xs">
            <button
              onClick={() => setIsPlayingAudio(!isPlayingAudio)}
              className="p-1.5 rounded-full bg-stone-900 text-white hover:bg-stone-800 transition-colors"
              title={isPlayingAudio ? 'Pause audio summary' : 'Listen to audio narrative'}
            >
              {isPlayingAudio ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
            </button>
            <div className="flex flex-col">
              <span className="font-semibold text-stone-900 flex items-center gap-1">
                <Volume2 className="w-3.5 h-3.5 text-stone-600" /> Listen to Article Brief
              </span>
              <div className="w-32 bg-stone-300 h-1 rounded-full overflow-hidden mt-1">
                <div
                  className="bg-stone-900 h-full transition-all duration-300"
                  style={{ width: `${audioProgress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Hero Cover Image */}
        <div className="mb-10 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200">
          <img
            src={article.coverImage}
            alt={article.title}
            referrerPolicy="no-referrer"
            className="w-full aspect-[16/9] object-cover"
            onError={(e) => {
              const target = e.currentTarget;
              target.onerror = null;
              target.src = '/images/hero_founder_workspace.jpg';
            }}
          />
          {article.coverCaption && (
            <p className="p-3 text-xs text-stone-500 bg-stone-50 border-t border-stone-200 italic font-editorial">
              {article.coverCaption}
            </p>
          )}
        </div>

        {/* Executive Summary Card */}
        <div className="p-6 bg-stone-100/70 border border-stone-200 rounded-xl mb-10 text-stone-800">
          <h2 className="text-xs font-mono uppercase tracking-widest text-stone-500 mb-2 font-semibold">Executive Brief</h2>
          <p className="text-sm sm:text-base leading-relaxed text-stone-800">
            {article.summary}
          </p>
        </div>

        {/* Table of Contents */}
        <div className="mb-10 p-5 bg-white border border-stone-200 rounded-xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 block mb-3">
            In This Analysis:
          </span>
          <ul className="space-y-2 text-sm">
            {article.sections.map((section, idx) => (
              <li key={idx}>
                <a
                  href={`#section-${idx}`}
                  className="text-stone-700 hover:text-stone-950 hover:underline flex items-center gap-2"
                >
                  <span className="font-mono text-xs text-stone-400">0{idx + 1}.</span>
                  <span>{section.heading.replace(/^0\d+\.\s*/, '')}</span>
                </a>
              </li>
            ))}
            <li>
              <a href="#comments-section" className="text-stone-700 hover:text-stone-950 hover:underline flex items-center gap-2">
                <span className="font-mono text-xs text-stone-400">0{article.sections.length + 1}.</span>
                <span>Founder Discussion ({comments.length})</span>
              </a>
            </li>
          </ul>
        </div>

        {/* Article Body Sections */}
        <div className={`space-y-12 text-stone-800 ${getFontSizeClass()}`}>
          {article.sections.map((sec, idx) => (
            <section key={idx} id={`section-${idx}`} className="scroll-mt-24">
              <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-stone-950 mb-5 pb-2 border-b border-stone-200">
                {sec.heading}
              </h2>

              {/* Prose paragraphs with drop cap on first section */}
              <div className="space-y-5 whitespace-pre-line text-stone-800 leading-relaxed">
                {sec.content}
              </div>

              {/* Pull quote if available */}
              {sec.quote && (
                <div className="my-8 py-6 border-y border-stone-300 text-center px-4 sm:px-8">
                  <p className="font-editorial text-xl sm:text-2xl italic font-normal text-stone-900 leading-snug mb-3">
                    “{sec.quote.text}”
                  </p>
                  <cite className="text-xs uppercase tracking-widest text-stone-500 font-sans not-italic">
                    — {sec.quote.citation}
                  </cite>
                </div>
              )}

              {/* Metrics table if available */}
              {sec.metricsTable && (
                <div className="my-8 overflow-hidden rounded-xl border border-stone-200 bg-white shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-stone-50 border-b border-stone-200 text-xs font-semibold text-stone-700 uppercase tracking-wider">
                        <tr>
                          {sec.metricsTable.headers.map((h, hIdx) => (
                            <th key={hIdx} className="py-3 px-4">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {sec.metricsTable.rows.map((row, rIdx) => (
                          <tr key={rIdx} className="hover:bg-stone-50/50 transition-colors">
                            {row.map((cell, cIdx) => (
                              <td
                                key={cIdx}
                                className={`py-3 px-4 ${cIdx === 0 ? 'font-medium text-stone-900' : 'text-stone-700 font-mono-num'}`}
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {sec.metricsTable.caption && (
                    <div className="p-3 bg-stone-50 border-t border-stone-200 text-xs text-stone-500 italic">
                      {sec.metricsTable.caption}
                    </div>
                  )}
                </div>
              )}

              {/* Strategic Takeaway callout */}
              {sec.keyTakeaway && (
                <div className="my-8 p-5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-amber-950">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-900 block mb-1">
                    Key Strategic Takeaway
                  </span>
                  <p className="text-sm sm:text-base font-normal leading-relaxed text-stone-900">
                    {sec.keyTakeaway}
                  </p>
                </div>
              )}
            </section>
          ))}
        </div>

        {/* Claps & Share Bar */}
        <div className="mt-14 pt-8 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleClap}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all ${
                hasClapped
                  ? 'bg-red-50 border-red-300 text-red-600 shadow-xs'
                  : 'bg-white border-stone-300 text-stone-700 hover:border-stone-400'
              }`}
            >
              <Heart className={`w-4 h-4 ${hasClapped ? 'fill-red-600' : ''}`} />
              <span className="text-xs font-semibold font-mono-num">{claps} Applause</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="px-4 py-2.5 rounded-full border border-stone-300 hover:border-stone-400 bg-white text-stone-700 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              {copiedLink ? 'Link Copied' : 'Share Article'}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenGenerator}
              className="px-4 py-2 text-xs font-semibold tracking-wide text-white bg-stone-900 rounded-lg hover:bg-stone-800 transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Sparkles className="w-3 h-3 text-amber-300" />
              Generate Business Idea
            </button>
          </div>
        </div>

        {/* Author Bio Box */}
        <div className="mt-12 p-6 bg-white border border-stone-200 rounded-2xl flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <img
            src={article.author.avatar}
            alt={article.author.name}
            className="w-16 h-16 rounded-full object-cover border border-stone-200 shrink-0"
          />
          <div className="text-center sm:text-left">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">Written by</span>
            <h3 className="text-lg font-bold text-stone-950 mt-0.5">{article.author.name}</h3>
            <p className="text-xs text-stone-500 mb-2">{article.author.role}</p>
            <p className="text-sm text-stone-600 leading-relaxed">{article.author.bio}</p>
          </div>
        </div>

        {/* Interactive Comments Discussion */}
        <div id="comments-section" className="mt-16 pt-10 border-t border-stone-200">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-editorial text-2xl font-bold text-stone-950 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-stone-700" />
              Founder Discussion ({comments.length})
            </h3>
            <span className="text-xs text-stone-500">Moderated peer dialogue</span>
          </div>

          {/* Add Comment Form */}
          <form onSubmit={handleAddComment} className="p-5 bg-white border border-stone-200 rounded-xl mb-8 shadow-xs">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500 mb-3">Add Your Analysis</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
              <input
                type="text"
                placeholder="Your Name (e.g. Liam Zhang)"
                value={newCommentName}
                onChange={(e) => setNewCommentName(e.target.value)}
                className="px-3.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900"
                required
              />
              <input
                type="text"
                placeholder="Role / Venture (e.g. Co-founder @ Seedling)"
                value={newCommentRole}
                onChange={(e) => setNewCommentRole(e.target.value)}
                className="px-3.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900"
              />
            </div>
            <textarea
              rows={3}
              placeholder="Share your perspective, operational counterpoint, or experience..."
              value={newCommentContent}
              onChange={(e) => setNewCommentContent(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 mb-3"
              required
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 rounded-lg hover:bg-stone-800 transition-colors"
              >
                Post Analysis
              </button>
            </div>
          </form>

          {/* Existing Comments List */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-sm text-stone-500 italic">No comments yet. Be the first founder to contribute an observation.</p>
            ) : (
              comments.map((cmt) => (
                <div key={cmt.id} className="p-4 bg-stone-50 border border-stone-200/70 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={cmt.authorAvatar}
                        alt={cmt.authorName}
                        className="w-7 h-7 rounded-full object-cover border border-stone-200"
                      />
                      <div>
                        <span className="text-xs font-bold text-stone-900">{cmt.authorName}</span>
                        <span className="text-xs text-stone-500 ml-2">· {cmt.authorRole}</span>
                      </div>
                    </div>
                    <span className="text-xs text-stone-400">{cmt.createdAt}</span>
                  </div>
                  <p className="text-sm text-stone-700 leading-relaxed pl-9">{cmt.content}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Related Deep Dives */}
        <div className="mt-20 pt-12 border-t border-stone-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-editorial text-2xl font-bold text-stone-950">Related Intelligence</h3>
            <button
              onClick={onBack}
              className="text-xs font-semibold text-stone-700 hover:text-stone-950 flex items-center gap-1"
            >
              View all 10 articles <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((rel) => (
              <div
                key={rel.id}
                onClick={() => {
                  onSelectArticle(rel);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="group cursor-pointer bg-white p-4 rounded-xl border border-stone-200 hover:border-stone-400 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-[16/10] rounded-lg overflow-hidden mb-3 bg-stone-100">
                    <img
                      src={rel.coverImage}
                      alt={rel.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.onerror = null;
                        target.src = '/images/hero_founder_workspace.jpg';
                      }}
                    />
                  </div>
                  <span className="text-xs font-medium text-stone-500 block mb-1">{rel.category}</span>
                  <h4 className="font-editorial text-base font-bold text-stone-950 line-clamp-2 leading-snug group-hover:text-stone-800">
                    {rel.title}
                  </h4>
                </div>
                <div className="mt-3 pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                  <span>{rel.readTime}</span>
                  <span className="font-semibold text-stone-900 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                    Read <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </article>
    </div>
  );
};
