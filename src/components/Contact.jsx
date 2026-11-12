import React, { useState } from 'react';
import { Mail, Send, Check, Copy, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';
import { Github, Linkedin, Twitter } from './Icons';
import { portfolioData } from '../data/portfolioData';

export default function Contact() {
  const { contact } = portfolioData;
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleCopy = () => {
    navigator.clipboard.writeText(contact.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      setForm({ name: '', email: '', message: '' });
      setTimeout(() => setSent(false), 5000);
    }, 800);
  };

  return (
    <section id="contact" className="py-24 px-6 relative">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Section Label */}
        <div className="flex items-center gap-2 text-sm text-zinc-500 font-medium">
          <div className="w-8 h-px bg-gradient-to-r from-violet-500 to-transparent" />
          Get In Touch
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Contact Info */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Let's collaborate.
              </h2>
              <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
                Open for full-time software engineering roles, high-impact internships, and architectural consulting.
              </p>
            </div>

            {/* Email card */}
            <div className="rounded-2xl glass glass-hover p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold">Email</div>
                  <a href={`mailto:${contact.email}`} className="text-sm text-zinc-200 hover:text-white transition-colors">
                    {contact.email}
                  </a>
                </div>
              </div>

              <button
                onClick={handleCopy}
                className="p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] text-zinc-400 hover:text-white transition-colors border border-white/[0.05] cursor-pointer"
                title="Copy Email"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Social pills */}
            <div className="flex gap-2">
              <a
                href={contact.socials.github.url}
                target="_blank"
                rel="noreferrer"
                className="flex-1 rounded-xl glass glass-hover p-3 flex items-center justify-center gap-2 text-xs text-zinc-300 hover:text-white"
              >
                <Github className="w-4 h-4" />
                <span>GitHub</span>
              </a>
              <a
                href={contact.socials.linkedin.url}
                target="_blank"
                rel="noreferrer"
                className="flex-1 rounded-xl glass glass-hover p-3 flex items-center justify-center gap-2 text-xs text-zinc-300 hover:text-white"
              >
                <Linkedin className="w-4 h-4" />
                <span>LinkedIn</span>
              </a>
              <a
                href={contact.socials.twitter.url}
                target="_blank"
                rel="noreferrer"
                className="flex-1 rounded-xl glass glass-hover p-3 flex items-center justify-center gap-2 text-xs text-zinc-300 hover:text-white"
              >
                <Twitter className="w-4 h-4" />
                <span>Twitter</span>
              </a>
            </div>

            {/* Quick status */}
            <div className="rounded-2xl glass p-4 text-xs text-zinc-400 space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-violet-400" />
                <span>{contact.location}</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{contact.responseTime}</span>
              </div>
            </div>
          </div>

          {/* Right: Clean Glass Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl glass p-6 sm:p-8 space-y-4">
              <h3 className="text-lg font-semibold text-white">Send a Message</h3>

              {sent && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Message delivered! I will reply as soon as possible.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] text-zinc-400 uppercase tracking-wider mb-1.5">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g. Jane Doe"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-zinc-400 uppercase tracking-wider mb-1.5">
                      Your Email
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="jane@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-zinc-400 uppercase tracking-wider mb-1.5">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell me about your project, team, or opportunity..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium text-xs shadow-lg shadow-violet-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{loading ? 'Sending...' : 'Send Message'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
