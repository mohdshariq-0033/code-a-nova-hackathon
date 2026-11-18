import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import RegisterForm from './components/RegisterForm';
import Footer from './components/Footer';

// Helper function to safely parse server JSON response
const safeFetchJson = async (url, options = {}) => {
  try {
    const res = await fetch(url, options);
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      throw new Error(`Server Response Error (${res.status}): Backend URL or Route is incorrect.`);
    }
    return { ok: res.ok, status: res.status, data };
  } catch (err) {
    throw err;
  }
};

// Initial state object for clean form reset
const initialFormState = {
  mobileNumber: '',
  collegeName: 'Hi-Tech Institute of Technology',
  course: 'BCA',
  branch: 'CSE',
  yearOfStudy: '2nd',
  domainTrack: 'Web Dev',
  projectName: '',
  pptLink: '',
  prototypeLink: '',
  demoVideoLink: '',
  teamSize: 1,
  teamMembers: []
};

export default function App() {
  const [currentTab, setCurrentTab] = useState('home');
  const [authMode, setAuthMode] = useState('login');

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [loadingSession, setLoadingSession] = useState(true);

  // Form state initialized with fresh empty defaults
  const [hackathonForm, setHackathonForm] = useState(initialFormState);

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationDetails, setRegistrationDetails] = useState(null);

  const BACKEND_URL = 'http://localhost:5000/api';

  // Automatically clear message smoothly after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleSetUser = (userData) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setRegistrationDetails(null);
      setRegistrationSuccess(false);
      setHackathonForm(initialFormState);
    }
  };

  // Automatically reset states and form whenever logged-in user changes
  useEffect(() => {
    setRegistrationDetails(null);
    setRegistrationSuccess(false);
    setHackathonForm(initialFormState);

    if (user) {
      fetchRegistrationDetails();
    }
  }, [user?.email, user?._id]);

  // Restore session on page load
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoadingSession(false);
        return;
      }

      try {
        const { ok, data } = await safeFetchJson(`${BACKEND_URL}/hackathon/my-registration`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (ok && (data.registration || data.entry)) {
          setRegistrationDetails(data.registration || data.entry);
          setRegistrationSuccess(true);
        } else {
          setRegistrationDetails(null);
          setRegistrationSuccess(false);
        }
      } catch (err) {
        console.error("Session check note:", err.message);
      } finally {
        setLoadingSession(false);
      }
    };

    restoreSession();
  }, []);

  // Fetch registration details when switching to dashboard tab
  useEffect(() => {
    if (currentTab === 'dashboard' && user) {
      fetchRegistrationDetails();
    }
  }, [currentTab]);

  const fetchRegistrationDetails = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const { ok, data } = await safeFetchJson(`${BACKEND_URL}/hackathon/my-registration`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (ok && (data.registration || data.entry)) {
        setRegistrationDetails(data.registration || data.entry);
        setRegistrationSuccess(true);
      } else {
        setRegistrationDetails(null);
        setRegistrationSuccess(false);
      }
    } catch (err) {
      console.log("No registration data found for current user:", err.message);
      setRegistrationDetails(null);
      setRegistrationSuccess(false);
    }
  };

  // Delete/Reset existing registration entry
  const handleResetRegistration = async () => {
    if (!window.confirm("Are you sure you want to reset your registration?")) return;
    
    const token = localStorage.getItem('token');
    try {
      const { ok, data } = await safeFetchJson(`${BACKEND_URL}/hackathon/delete-my-registration`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (ok) {
        setRegistrationSuccess(false);
        setRegistrationDetails(null);
        setHackathonForm(initialFormState);
        setMessage("Registration successfully reset!");
      } else {
        alert(data.message || 'Failed to delete registration');
      }
    } catch (err) {
      alert("Delete Registration Error: " + err.message);
    }
  };

  // Submit hackathon registration details
  const handleHackathonSubmit = async (e) => {
    e.preventDefault();
    if (!hackathonForm.mobileNumber || !hackathonForm.projectName) {
      setMessage('Please fill in your mobile number and project name.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setMessage('Session expired or not logged in. Please login again.');
      setCurrentTab('auth');
      setAuthMode('login');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const { ok, data } = await safeFetchJson(`${BACKEND_URL}/hackathon/register`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          email: user?.email, 
          fullName: user?.fullName || 'Hacker',
          ...hackathonForm 
        })
      });

      if (!ok) throw new Error(data.message || 'Registration failed');

      setRegistrationSuccess(true);
      setRegistrationDetails(hackathonForm);
      setHackathonForm(initialFormState);
      setCurrentTab('dashboard');
    } catch (err) {
      setMessage(err.message || 'Failed to submit registration.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingSession) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center font-sans">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="text-slate-400 text-sm">Restoring session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans flex flex-col justify-between relative">
      
      {/* GLOBAL FLOATING TOAST NOTIFICATION (Always centered at the top of the viewport) */}
      {message && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4 pointer-events-none">
          <div className="pointer-events-auto bg-slate-900/95 border border-indigo-500/60 text-indigo-100 px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-md flex items-center justify-between gap-3 text-sm font-medium animate-bounce-short">
            <div className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></span>
              <span>{message}</span>
            </div>
            <button 
              onClick={() => setMessage('')} 
              className="text-slate-400 hover:text-white transition font-bold text-xs p-1 cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div>
        <Navbar 
          currentTab={currentTab} 
          setCurrentTab={setCurrentTab} 
          user={user} 
          setUser={handleSetUser} 
          authMode={authMode} 
          setAuthMode={setAuthMode} 
        />

        <main className="max-w-6xl mx-auto p-6 transition-all duration-300">
          {currentTab === 'home' && (
            <Home setAuthMode={setAuthMode} setCurrentTab={setCurrentTab} />
          )}

          {currentTab === 'auth' && (
            <Auth 
              authMode={authMode} 
              setAuthMode={setAuthMode}
              setUser={handleSetUser}
              setCurrentTab={setCurrentTab}
              setMessage={setMessage}
              BACKEND_URL={BACKEND_URL}
            />
          )}

          {currentTab === 'dashboard' && (
            <Dashboard 
              user={user} 
              message="" 
              registrationSuccess={registrationSuccess} 
              registrationDetails={registrationDetails} 
              hackathonForm={hackathonForm} 
              handleResetRegistration={handleResetRegistration} 
              setCurrentTab={setCurrentTab} 
              setRegistrationDetails={setRegistrationDetails}
              setRegistrationSuccess={setRegistrationSuccess}
              BACKEND_URL={BACKEND_URL}
            />
          )}

          {currentTab === 'register' && (
            <RegisterForm 
              hackathonForm={hackathonForm} 
              setHackathonForm={setHackathonForm} 
              message="" 
              loading={loading} 
              handleHackathonSubmit={handleHackathonSubmit} 
            />
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
}