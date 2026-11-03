import React, { useState } from 'react';
import { 
  Mail, 
  Send, 
  Check, 
  Copy, 
  MapPin, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { Github, Linkedin } from './Icons';
import { portfolioData } from '../data/portfolioData';

export default function Contact() {
  const { contact } = portfolioData;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(contact.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    // Basic email format check
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    // Simulate sending message
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 6000);
    }, 1000);
  };

  return (
    <section id="contact" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold uppercase tracking-wider border border-indigo-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Get In Touch</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Let's Build Something Great Together
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            I am currently open to new software engineering opportunities, internships, and open-source collaborations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Direct Links & Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-white">
                Contact Information
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Feel free to reach out via the contact form, send an email directly, or connect through LinkedIn and GitHub.
              </p>
            </div>

            {/* Direct Email Card with One-Click Copy */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition-colors flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="overflow-hidden">
                  <span className="text-[11px] font-semibold text-slate-400 block uppercase">
                    Direct Email
                  </span>
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-xs sm:text-sm font-semibold text-white hover:text-indigo-400 transition-colors truncate block"
                  >
                    {contact.email}
                  </a>
                </div>
              </div>
              <button
                onClick={handleCopyEmail}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all shrink-0 cursor-pointer"
                title="Copy email to clipboard"
              >
                {copiedEmail ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Social Buttons: GitHub & LinkedIn */}
            <div className="grid grid-cols-2 gap-3">
              <a
                href={contact.socials.github.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 hover:bg-slate-900 transition-all flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 group-hover:bg-slate-700 group-hover:text-white transition-colors shrink-0">
                  <Github className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 font-medium block">
                    GitHub
                  </span>
                  <span className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                    @{contact.socials.github.username}
                  </span>
                </div>
              </a>

              <a
                href={contact.socials.linkedin.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 hover:bg-slate-900 transition-all flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#0077B5]/10 border border-[#0077B5]/20 flex items-center justify-center text-[#0077B5] group-hover:bg-[#0077B5] group-hover:text-white transition-colors shrink-0">
                  <Linkedin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 font-medium block">
                    LinkedIn
                  </span>
                  <span className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {contact.socials.linkedin.username}
                  </span>
                </div>
              </a>
            </div>

            {/* Availability & Location Info */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>{contact.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>{contact.timezone}</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{contact.responseTime}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl relative">
              <h3 className="text-xl font-bold text-white mb-2">
                Send a Direct Message
              </h3>
              <p className="text-xs text-slate-400 mb-6">
                Have a question, opportunity, or project idea? Fill out the form below.
              </p>

              {/* Success Notification Alert */}
              {submitted && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
                  <div>
                    <strong className="font-semibold">Message delivered!</strong> Thank you for reaching out. I'll get back to you shortly.
                  </div>
                </div>
              )}

              {/* Error Alert */}
              {errorMsg && (
                <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Your Name <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Jane Doe"
                      required
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Your Email <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="jane@example.com"
                      required
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Subject / Topic
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g. Software Engineering Opportunity / Collaboration"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Your Message <span className="text-rose-400">*</span>
                  </label>
                  <textarea
                    rows={5}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell me about your team, project, or role..."
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
