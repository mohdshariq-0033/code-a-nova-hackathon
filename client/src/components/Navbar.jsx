import React, { useState } from 'react';

export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  user, 
  setUser, 
  authMode, 
  setAuthMode 
}) {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const confirmLogout = () => {
    setUser(null);
    setShowLogoutModal(false);
    setMobileMenuOpen(false);
    setCurrentTab('home');
  };

  return (
    <>
      <nav className="bg-slate-800/80 backdrop-blur-md border-b border-slate-700 sticky top-0 z-40 px-6 py-4 transition-all">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          
          {/* Logo / Brand Name */}
          <div 
            onClick={() => { setCurrentTab('home'); setMobileMenuOpen(false); }} 
            className="flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition">
              C
            </div>
            <span className="text-xl font-bold tracking-tight text-white group-hover:text-indigo-400 transition">
              Code-A-Nova
            </span>
          </div>

          {/* Desktop Navigation Links & User Info */}
          <div className="hidden md:flex items-center space-x-6">
            <button 
              onClick={() => setCurrentTab('home')} 
              className={`text-sm font-semibold transition cursor-pointer ${currentTab === 'home' ? 'text-indigo-400' : 'text-slate-300 hover:text-white'}`}
            >
              Home
            </button>

            {user ? (
              <>
                <button 
                  onClick={() => setCurrentTab('dashboard')} 
                  className={`text-sm font-semibold transition cursor-pointer ${currentTab === 'dashboard' ? 'text-indigo-400' : 'text-slate-300 hover:text-white'}`}
                >
                  Dashboard
                </button>

                {/* User Info Display */}
                <div className="flex items-center gap-3 pl-2 border-l border-slate-700">
                  <div className="text-right">
                    <p className="text-xs font-bold text-white">{user.fullName || 'User'}</p>
                    <p className="text-[10px] text-slate-400">{user.email}</p>
                  </div>
                  
                  {/* Logout Button */}
                  <button 
                    onClick={() => setShowLogoutModal(true)}
                    className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 cursor-pointer shadow-sm hover:shadow-rose-500/10"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => { setAuthMode('login'); setCurrentTab('auth'); }}
                  className={`text-sm font-semibold px-3 py-2 transition cursor-pointer ${
                    currentTab === 'auth' && authMode === 'login' 
                      ? 'text-indigo-400 font-bold' 
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Login
                </button>

                <button 
                  onClick={() => { setAuthMode('signup'); setCurrentTab('auth'); }}
                  className={`text-sm font-semibold px-4 py-2 rounded-xl transition cursor-pointer ${
                    currentTab === 'auth' && authMode === 'signup'
                      ? 'bg-indigo-700 text-white shadow-md shadow-indigo-600/30'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20'
                  }`}
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-300 hover:text-white p-2 rounded-lg bg-slate-900/50 border border-slate-700 focus:outline-none cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-slate-700 flex flex-col space-y-3 pb-2 animate-fadeIn">
            
            {user && (
              <div className="px-3 py-2 bg-slate-900/60 rounded-xl border border-slate-700/50 mb-1">
                <p className="text-xs font-bold text-white">{user.fullName}</p>
                <p className="text-[10px] text-slate-400 break-all">{user.email}</p>
              </div>
            )}

            <button 
              onClick={() => { setCurrentTab('home'); setMobileMenuOpen(false); }} 
              className={`text-left px-3 py-2 rounded-xl text-sm font-semibold transition ${currentTab === 'home' ? 'text-indigo-400 bg-indigo-600/10' : 'text-slate-300 hover:text-white'}`}
            >
              Home
            </button>

            {user ? (
              <>
                <button 
                  onClick={() => { setCurrentTab('dashboard'); setMobileMenuOpen(false); }} 
                  className={`text-left px-3 py-2 rounded-xl text-sm font-semibold transition ${currentTab === 'dashboard' ? 'text-indigo-400 bg-indigo-600/10' : 'text-slate-300 hover:text-white'}`}
                >
                  Dashboard
                </button>

                <button 
                  onClick={() => { setMobileMenuOpen(false); setShowLogoutModal(true); }}
                  className="w-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs px-4 py-2.5 rounded-xl font-bold transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button 
                  onClick={() => { setAuthMode('login'); setCurrentTab('auth'); setMobileMenuOpen(false); }}
                  className={`text-center text-sm font-semibold px-3 py-2.5 rounded-xl border border-slate-700 transition cursor-pointer ${
                    currentTab === 'auth' && authMode === 'login' 
                      ? 'text-indigo-400 font-bold bg-indigo-600/10 border-indigo-500' 
                      : 'text-slate-300'
                  }`}
                >
                  Login
                </button>

                <button 
                  onClick={() => { setAuthMode('signup'); setCurrentTab('auth'); setMobileMenuOpen(false); }}
                  className={`text-center text-sm font-semibold px-4 py-2.5 rounded-xl transition cursor-pointer ${
                    currentTab === 'auth' && authMode === 'signup'
                      ? 'bg-indigo-700 text-white shadow-md'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md'
                  }`}
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Modern Confirmation Modal Backdrop */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl p-6 max-w-sm w-full shadow-2xl space-y-5 transform transition-all scale-100">
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Confirm Logout</h3>
                <p className="text-xs text-slate-400 leading-relaxed mt-0.5">
                  Are you sure you want to sign out of your session?
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button 
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white py-2.5 rounded-xl font-semibold text-xs border border-slate-700 transition cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={confirmLogout}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-rose-600/30 transition cursor-pointer"
              >
                Yes, Logout
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}