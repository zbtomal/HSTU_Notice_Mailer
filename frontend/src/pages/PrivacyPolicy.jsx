import React from 'react';
import { 
  ShieldCheck, 
  Mail, 
  Lock, 
  Bell, 
  CheckCircle2, 
  FileText, 
  Users, 
  ArrowLeft,
  KeyRound,
  Sliders,
  Zap,
  ShieldAlert,
  MailCheck,
  SlidersHorizontal,
  Globe,
  BarChart3
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto py-6 sm:py-10 px-4 sm:px-6">
      
      {/* Back Button */}
      <Link 
        to="/" 
        className="inline-flex items-center gap-2 text-xs font-semibold text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Notice Feed
      </Link>

      {/* Header */}
      <div className="text-center sm:text-left mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-700 dark:text-teal-400 text-xs font-semibold mb-3">
          <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400" /> Privacy & Data Protection
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-2xl">
          Last updated: July 2026. Learn how HSTU Notice Mailer collects, uses, and protects your information.
        </p>
      </div>

      {/* Content Grid / Sections */}
      <div className="space-y-8 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
        
        {/* Section 1 */}
        <section className="p-6 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 backdrop-blur-sm shadow-sm dark:shadow-xl">
          <div className="flex items-center gap-3 mb-4 text-slate-900 dark:text-white font-heading font-bold text-lg">
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
              <Mail className="w-5 h-5" />
            </div>
            <h2>1. Information We Collect</h2>
          </div>
          <p className="mb-4 text-slate-600 dark:text-slate-400">
            HSTU Notice Mailer is built with privacy-first principles. We only collect minimal information necessary to deliver real-time university notice alerts:
          </p>
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/50 flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-slate-900 dark:text-slate-200 block text-xs font-semibold uppercase tracking-wider mb-0.5">Email Address</strong>
                <span className="text-slate-600 dark:text-slate-400 text-xs">Used for account registration, 6-digit OTP verification, and delivering notice alerts to your inbox.</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/50 flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-slate-900 dark:text-slate-200 block text-xs font-semibold uppercase tracking-wider mb-0.5">Subscription Preferences</strong>
                <span className="text-slate-600 dark:text-slate-400 text-xs">Category selections (e.g., CSE, EEE, Agriculture, Office & Section) and email pause/resume state.</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/50 flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-slate-900 dark:text-slate-200 block text-xs font-semibold uppercase tracking-wider mb-0.5">Account Credentials</strong>
                <span className="text-slate-600 dark:text-slate-400 text-xs">Passwords stored securely using industry-standard bcrypt cryptographic hashing.</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section className="p-6 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 backdrop-blur-sm shadow-sm dark:shadow-xl">
          <div className="flex items-center gap-3 mb-4 text-slate-900 dark:text-white font-heading font-bold text-lg">
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
              <Bell className="w-5 h-5" />
            </div>
            <h2>2. How We Use Your Information</h2>
          </div>
          <p className="mb-4 text-slate-600 dark:text-slate-400">
            Your data is used strictly to power the core notification services of HSTU Notice Mailer:
          </p>
          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/50 flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5">
                <Zap className="w-4 h-4" />
              </div>
              <span className="text-slate-700 dark:text-slate-300">Instant email alerts sent as soon as new notices matching your subscribed categories are posted on the official HSTU site.</span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/50 flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <span className="text-slate-700 dark:text-slate-300">Account ownership verification using 6-digit One-Time Password (OTP) codes to prevent spam and fake registrations.</span>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section className="p-6 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 backdrop-blur-sm shadow-sm dark:shadow-xl">
          <div className="flex items-center gap-3 mb-4 text-slate-900 dark:text-white font-heading font-bold text-lg">
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
              <Lock className="w-5 h-5" />
            </div>
            <h2>3. Data Protection & Zero Spam Commitment</h2>
          </div>
          <p className="mb-4 text-slate-600 dark:text-slate-400">
            We value your trust and inbox cleanliness above all:
          </p>
          <div className="space-y-3">
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/50 flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-slate-900 dark:text-slate-200 block text-xs font-semibold uppercase tracking-wider mb-0.5">No Data Selling</strong>
                <span className="text-slate-600 dark:text-slate-400 text-xs">We never sell, rent, trade, or share your email address or personal info with any third party.</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/50 flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                <MailCheck className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-slate-900 dark:text-slate-200 block text-xs font-semibold uppercase tracking-wider mb-0.5">No Unwanted Emails</strong>
                <span className="text-slate-600 dark:text-slate-400 text-xs">You will only receive notice alerts for your subscribed categories and essential account security OTPs.</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/50 flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-slate-900 dark:text-slate-200 block text-xs font-semibold uppercase tracking-wider mb-0.5">Full Control</strong>
                <span className="text-slate-600 dark:text-slate-400 text-xs">Pause all email alerts or adjust category subscriptions anytime with a single click from your dashboard.</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section className="p-6 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800/80 backdrop-blur-sm shadow-sm dark:shadow-xl">
          <div className="flex items-center gap-3 mb-4 text-slate-900 dark:text-white font-heading font-bold text-lg">
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <h2>4. Third-Party Services & Analytics</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/50 flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-slate-900 dark:text-slate-200 block font-semibold mb-0.5">Official HSTU Portal</strong>
                <span className="text-slate-600 dark:text-slate-400">Notices are scraped directly from public HSTU website announcements (<a href="https://hstu.ac.bd" target="_blank" rel="noopener noreferrer" className="text-teal-600 dark:text-teal-400 hover:underline">hstu.ac.bd</a>).</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-700/50 flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 shrink-0 mt-0.5">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div>
                <strong className="text-slate-900 dark:text-slate-200 block font-semibold mb-0.5">Vercel Analytics</strong>
                <span className="text-slate-600 dark:text-slate-400">Anonymous page view & performance metrics used to optimize app speed without tracking personal user identities.</span>
              </div>
            </div>
          </div>
        </section>

        {/* Section 5 - Team & Development Credit */}
        <section className="p-6 rounded-2xl bg-gradient-to-r from-teal-50/70 via-white to-teal-50/40 dark:from-teal-950/40 dark:via-slate-900/60 dark:to-slate-900/50 border border-teal-500/20 shadow-sm dark:shadow-xl">
          <div className="flex items-center gap-3 mb-3 text-slate-900 dark:text-white font-heading font-bold text-lg">
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
              <Users className="w-5 h-5" />
            </div>
            <h2>5. Development & Contact</h2>
          </div>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            HSTU Notice Mailer was developed with ❤️ for the students, faculty, and staff of Hajee Mohammad Danesh Science & Technology University.
          </p>
          <div className="p-4 rounded-xl bg-white/80 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 shadow-xs">
            <h3 className="font-semibold text-slate-700 dark:text-slate-200 text-xs uppercase tracking-wider mb-2">Project Development Team</h3>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-3.5 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-500/10 text-teal-800 dark:text-teal-300 font-semibold border border-teal-200 dark:border-teal-500/20 shadow-xs flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 dark:bg-teal-400"></span> Jannatul Ferdaous
              </span>
              <span className="px-3.5 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-500/10 text-teal-800 dark:text-teal-300 font-semibold border border-teal-200 dark:border-teal-500/20 shadow-xs flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 dark:bg-teal-400"></span> Ashikur Rahman
              </span>
              <span className="px-3.5 py-1.5 rounded-lg bg-teal-50 dark:bg-teal-500/10 text-teal-800 dark:text-teal-300 font-semibold border border-teal-200 dark:border-teal-500/20 shadow-xs flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 dark:bg-teal-400"></span> Zikrul Bari Tomal
              </span>
            </div>
          </div>
        </section>

      </div>

      {/* Footer link back */}
      <div className="mt-10 text-center">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-teal-500 text-slate-950 font-bold text-sm hover:bg-teal-400 transition-all shadow-glow"
        >
          Return to Notice Board
        </Link>
      </div>

    </div>
  );
}
