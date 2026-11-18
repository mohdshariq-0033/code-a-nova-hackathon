import React from 'react';

export default function Home({ setAuthMode, setCurrentTab }) {
  return (
    <div className="text-center py-20 space-y-6">
      <span className="bg-indigo-900 text-indigo-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-indigo-700">
        Full Stack Hackathon Portal
      </span>
      <h1 className="text-5xl font-extrabold tracking-tight">
        Build, Deploy & <span className="text-indigo-400">Win Code-a-Nova</span>
      </h1>
      <p className="text-slate-400 max-w-2xl mx-auto text-lg">
        Join the intermediate MERN stack hackathon. Register your team, manage projects, and showcase your skills!
      </p>
      <div className="flex justify-center gap-4 pt-4">
        <button onClick={() => { setAuthMode('signup'); setCurrentTab('auth'); }} className="bg-indigo-600 px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/30">
          Register Now
        </button>
        <button onClick={() => { setAuthMode('login'); setCurrentTab('auth'); }} className="bg-slate-800 border border-slate-700 px-8 py-3 rounded-xl font-bold hover:bg-slate-700 transition">
          Participant Login
        </button>
      </div>
    </div>
  );
}