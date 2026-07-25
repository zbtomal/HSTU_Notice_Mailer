import React, { useState } from 'react';
import { Calendar, Download, ExternalLink, Tag, ChevronDown, ChevronUp, FileText } from 'lucide-react';

export default function NoticeCard({ notice }) {
  const [expanded, setExpanded] = useState(false);

  const categoryName = notice.category?.name || 'Office & Section';
  const hasDownload = Boolean(notice.download_link);
  const descriptionText = notice.description || '';
  const isLongDescription = descriptionText.length > 220;

  // Format date display
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recent';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <article className="group relative flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 backdrop-blur-md transition-all duration-300 hover:border-teal-500/30 hover:bg-slate-900/80 hover:shadow-glow">
      
      {/* Top Meta info */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-300 border border-teal-500/20">
            <Tag className="w-3 h-3 text-teal-400" />
            {categoryName}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            {formatDate(notice.notice_date_parsed || notice.notice_date)}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-heading text-base sm:text-lg font-bold text-slate-100 group-hover:text-teal-300 transition-colors leading-snug">
          <a 
            href={notice.notice_link || '#'} 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:underline flex items-start gap-1.5"
          >
            <span>{notice.title}</span>
            <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-teal-400 shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
        </h3>

        {/* Description */}
        {descriptionText && (
          <div className="mt-3 text-sm text-slate-300/90 leading-relaxed">
            <p className={expanded ? '' : 'line-clamp-3'}>
              {descriptionText}
            </p>

            {isLongDescription && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-teal-400 hover:text-teal-300 transition-colors focus:outline-none"
              >
                {expanded ? (
                  <>Show less <ChevronUp className="w-3 h-3" /></>
                ) : (
                  <>Read full summary <ChevronDown className="w-3 h-3" /></>
                )}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="mt-5 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
        <a
          href={notice.notice_link || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-teal-300 transition-colors"
        >
          <FileText className="w-3.5 h-3.5 text-teal-400" />
          <span>View Source Notice</span>
        </a>

        {hasDownload && (
          <a
            href={notice.download_link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20 hover:bg-amber-500/20 hover:border-amber-500/40 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Attachment</span>
          </a>
        )}
      </div>

    </article>
  );
}
