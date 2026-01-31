"use client";

import Link from "next/link";
import { Layout, Share2, BarChart3, Users, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#171021] text-white selection:bg-primary/30">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-20 flex items-center border-b border-white/5 bg-[#171021]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto w-full px-6 flex justify-between items-center">
          <div className="flex items-center gap-3 group">
            <div className="p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Layout className="text-primary" size={24} />
            </div>
            <span className="text-xl font-extrabold tracking-tight">
              Nexus Media
            </span>
          </div>
          <div className="flex items-center gap-8">
            <Link
              href="/login"
              className="text-sm font-semibold text-text-secondary-dark hover:text-white transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="h-10 px-5 rounded-full bg-primary hover:bg-primary-hover text-white text-sm font-bold flex items-center shadow-lg shadow-primary/20 transition-all active:scale-95"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto px-6 pt-40 pb-20 w-full relative">
        {/* Background Gradients */}
        <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-40 left-0 w-[300px] h-[300px] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Hero Section */}
        <section className="grid md:grid-cols-2 gap-16 items-center mb-32 relative z-10">
          <div className="animate-in fade-in slide-in-from-left-8 duration-1000">
            <h1 className="text-6xl md:text-7xl font-extrabold leading-[1.1] mb-6 tracking-tight">
              Manage Your Social Media <br />
              <span className="bg-gradient-to-r from-primary to-[#A070FF] bg-clip-text text-transparent">
                Like a Pro
              </span>
            </h1>
            <p className="text-xl text-text-secondary-dark mb-10 max-w-[540px] leading-relaxed">
              The ultimate platform to schedule, analyze, and grow your social
              presence across all major platforms.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/register"
                className="h-14 px-8 rounded-2xl bg-primary hover:bg-primary-hover text-white text-lg font-bold flex items-center gap-2 shadow-xl shadow-primary/30 transition-all active:scale-95"
              >
                Create Account <ArrowRight size={20} />
              </Link>
              <Link
                href="/features"
                className="h-14 px-8 rounded-2xl bg-white/5 hover:bg-white/10 text-white text-lg font-bold flex items-center border border-white/10 transition-all"
              >
                View Features
              </Link>
            </div>
          </div>

          <div className="relative animate-in fade-in zoom-in-95 duration-1000 delay-200">
            <div className="w-full rounded-3xl overflow-hidden glass shadow-2xl relative z-10 group">
              <div className="bg-white/5 h-10 flex items-center px-4 gap-1.5 border-b border-white/10">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/30" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/30" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/30" />
              </div>
              <div className="p-8 aspect-video">
                <div className="h-6 w-1/3 bg-white/10 rounded-lg mb-8" />
                <div className="grid grid-cols-2 gap-6">
                  <div className="h-32 bg-white/5 rounded-2xl border border-white/5 group-hover:border-primary/20 transition-colors" />
                  <div className="h-32 bg-white/5 rounded-2xl border border-white/5 group-hover:border-primary/20 transition-colors" />
                </div>
              </div>
            </div>
            {/* Decorative element behind preview */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-purple-500/30 rounded-[2rem] blur-2xl -z-10" />
          </div>
        </section>

        {/* Features Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {[
            {
              icon: Share2,
              title: "Multi-Platform",
              desc: "Post to YouTube, Instagram, Facebook, X, and TikTok from one place.",
            },
            {
              icon: BarChart3,
              title: "Analytics",
              desc: "Deep insights into your performance and audience growth.",
            },
            {
              icon: Users,
              title: "Engagement",
              desc: "Manage comments and interactions seamlessly.",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="p-10 rounded-3xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 hover:-translate-y-2 transition-all duration-300 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="text-primary" size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
              <p className="text-text-secondary-dark leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </section>
      </main>

      <footer className="py-20 border-t border-white/5 relative bg-[#171021]">
        <div className="max-w-7xl mx-auto px-6 text-center text-text-secondary-dark text-sm">
          <p>&copy; 2026 Nexus Media. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
