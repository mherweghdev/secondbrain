import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-slate-900 via-zinc-900 to-black p-6 selection:bg-indigo-500/30">
      <div className="w-full max-w-md">
        <div className="bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-10 rounded-[2rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] relative overflow-hidden group transition-all duration-500 hover:border-white/20">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] group-hover:bg-indigo-500/20 transition-all duration-1000" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px] group-hover:bg-purple-500/20 transition-all duration-1000" />
          <div className="relative z-10">{children}</div>
        </div>
      </div>
    </div>
  );
}
