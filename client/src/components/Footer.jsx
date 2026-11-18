import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-slate-800 border-t border-slate-700 text-slate-400 text-center py-6 mt-16 text-sm">
      <p>© {new Date().getFullYear()} <span className="text-indigo-400 font-bold">CODE-A-NOVA</span>. All rights reserved.</p>
      <p className="text-xs text-slate-500 mt-1">Intermediate MERN Stack Hackathon Portal.</p>
    </footer>
  );
}