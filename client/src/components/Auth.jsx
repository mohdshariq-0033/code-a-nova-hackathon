import React, { useState } from 'react';

export default function Auth({ 
  authMode, 
  setAuthMode, 
  setUser, 
  setCurrentTab, 
  setMessage, 
  BACKEND_URL = 'http://localhost:5000/api' 
}) {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [signupFullName, setSignupFullName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // States
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [resetStep, setResetStep] = useState('none'); // 'none' | 'request' | 'verify-otp' | 'change-password'
  
  const [loading, setLoading] = useState(false);

  const handleSwitchAuthMode = (mode) => {
    setMessage('');
    setIsOtpStep(false);
    setResetStep('none');
    setAuthMode(mode);
  };

  const saveTokenAndUser = (data, defaultEmail, defaultFullName = 'User') => {
    const token = data.token || data.accessToken || data.access_token;
    if (token) localStorage.setItem('token', token);
    const userData = data.user || { fullName: data.fullName || defaultFullName, email: data.email || defaultEmail };
    setUser(userData);
  };

  // Login Handler
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!loginEmail || !loginPassword) {
      setMessage('Please enter your email and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });
      const data = await res.json();
      if (!res.ok) {
        setLoading(false);
        setMessage(data.message || 'Incorrect password or email.');
        return;
      }
      saveTokenAndUser(data, loginEmail);
      setCurrentTab('dashboard');
    } catch (err) {
      setLoading(false);
      setMessage('Server connection failed.');
    } finally {
      setLoading(false);
    }
  };

  // Signup Handler
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!signupFullName || !signupEmail || !signupPassword || !confirmPassword) {
      setMessage('Please fill in all required fields.');
      return;
    }
    if (signupPassword !== confirmPassword) {
      setMessage('Password and Confirm Password do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName: signupFullName, email: signupEmail, password: signupPassword })
      });
      const data = await res.json();
      if (!res.ok) {
        setLoading(false);
        setMessage(data.message || 'Signup failed.');
        return;
      }
      setIsOtpStep(true);
      setMessage('OTP sent to your email successfully!');
    } catch (err) {
      setLoading(false);
      setMessage('Server connection failed.');
    } finally {
      setLoading(false);
    }
  };

  // Signup OTP Verification
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setMessage('Please enter a valid 6-digit OTP.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: signupEmail, otp })
      });
      const data = await res.json();
      if (!res.ok) {
        setLoading(false);
        setMessage(data.message || 'Invalid or expired OTP.');
        return;
      }
      saveTokenAndUser(data, signupEmail, signupFullName);
      setCurrentTab('dashboard');
      setMessage('Account verified successfully!');
    } catch (err) {
      setLoading(false);
      setMessage('Failed to verify OTP.');
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Request Forgot Password OTP
  const handleForgotRequest = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!loginEmail) {
      setMessage('Please enter your registered email address.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/auth/forgot-password-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail })
      });
      const data = await res.json();
      if (!res.ok) {
        setLoading(false);
        setMessage(data.message || 'Email not found.');
        return;
      }
      setResetStep('verify-otp');
      setMessage('OTP sent to your email. Please verify.');
    } catch (err) {
      setLoading(false);
      setMessage('Failed to send reset request.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify Forgot Password OTP First
  const handleVerifyForgotOtp = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!otp || otp.length !== 6) {
      setMessage('Please enter a valid 6-digit OTP.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/auth/verify-forgot-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, otp })
      });
      const data = await res.json();
      if (!res.ok) {
        setLoading(false);
        setMessage(data.message || 'Invalid or expired OTP.');
        return;
      }
      // OTP Verified -> Move to Password Change Option
      setResetStep('change-password');
      setMessage('OTP verified successfully! Now enter your new password.');
    } catch (err) {
      setLoading(false);
      setMessage('OTP verification failed.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Change/Reset Password with Confirmation
  const handleFinalPasswordReset = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!newPassword || !confirmNewPassword) {
      setMessage('Please fill in all fields.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setMessage('New Password and Confirm Password do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, otp, newPassword, confirmNewPassword })
      });
      const data = await res.json();
      if (!res.ok) {
        setLoading(false);
        setMessage(data.message || 'Password update failed.');
        return;
      }

      setResetStep('none');
      setAuthMode('login');
      setOtp('');
      setNewPassword('');
      setConfirmNewPassword('');
      setMessage('Password updated successfully! Please login.');
    } catch (err) {
      setLoading(false);
      setMessage('Password reset failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-slate-800 border border-slate-700 rounded-2xl p-8 mt-10 shadow-2xl min-h-[460px] flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-bold mb-6 text-center text-white">
          {resetStep === 'request' ? 'Forgot Password' :
           resetStep === 'verify-otp' ? 'Verify OTP First' :
           resetStep === 'change-password' ? 'Set New Password' :
           isOtpStep ? 'Verify 6-Digit OTP' : 
           authMode === 'login' ? 'Welcome Back' : 'Create Account'}
        </h2>

        {/* 1. Forgot Password - Enter Email */}
        {resetStep === 'request' && (
          <form onSubmit={handleForgotRequest} className="space-y-4">
            <div>
              <label className="block text-xs uppercase font-bold text-slate-400 mb-1">Registered Email</label>
              <input 
                type="email" 
                value={loginEmail} 
                onChange={e => setLoginEmail(e.target.value)} 
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 outline-none text-white focus:border-indigo-500" 
                placeholder="name@example.com" 
                required 
              />
            </div>
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-indigo-600 py-3 rounded-lg font-bold hover:bg-indigo-700 transition text-white flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
              <span>Send OTP</span>
            </button>
            <button 
              type="button" 
              onClick={() => { setResetStep('none'); setMessage(''); }} 
              className="w-full text-slate-400 text-sm hover:text-white transition mt-2 cursor-pointer"
            >
              Back to Login
            </button>
          </form>
        )}

        {/* 2. Verify OTP First */}
        {resetStep === 'verify-otp' && (
          <form onSubmit={handleVerifyForgotOtp} className="space-y-4">
            <p className="text-sm text-slate-400 text-center">Enter the 6-digit OTP sent to <strong>{loginEmail}</strong></p>
            <div>
              <input 
                type="text" 
                maxLength={6} 
                value={otp} 
                onChange={e => setOtp(e.target.value)} 
                className="w-full text-center tracking-widest text-2xl bg-slate-900 border border-slate-700 rounded-lg p-3 outline-none font-mono text-white focus:border-indigo-500" 
                placeholder="123456" 
                required 
              />
            </div>
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-indigo-600 py-3 rounded-lg font-bold hover:bg-indigo-700 transition text-white flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
              <span>Verify OTP</span>
            </button>
            <button 
              type="button" 
              onClick={() => { setResetStep('request'); setMessage(''); }} 
              className="w-full text-slate-400 text-sm hover:text-white transition mt-2 cursor-pointer"
            >
              Resend OTP / Change Email
            </button>
          </form>
        )}

        {/* 3. Change Password After Successful OTP Verification */}
        {resetStep === 'change-password' && (
          <form onSubmit={handleFinalPasswordReset} className="space-y-4">
            <div>
              <label className="block text-xs uppercase font-bold text-slate-400 mb-1">New Password</label>
              <input 
                type="password" 
                value={newPassword} 
                onChange={e => setNewPassword(e.target.value)} 
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 outline-none text-white focus:border-indigo-500" 
                placeholder="••••••••" 
                required 
                minLength={6} 
              />
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-slate-400 mb-1">Confirm New Password</label>
              <input 
                type="password" 
                value={confirmNewPassword} 
                onChange={e => setConfirmNewPassword(e.target.value)} 
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 outline-none text-white focus:border-indigo-500" 
                placeholder="••••••••" 
                required 
                minLength={6} 
              />
            </div>
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-emerald-600 py-3 rounded-lg font-bold hover:bg-emerald-700 transition text-white flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
              <span>Update Password</span>
            </button>
          </form>
        )}

        {/* LOGIN FORM */}
        {resetStep === 'none' && !isOtpStep && authMode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase font-bold text-slate-400 mb-1">Email Address</label>
              <input 
                type="email" 
                value={loginEmail} 
                onChange={e => setLoginEmail(e.target.value)} 
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 outline-none text-white focus:border-indigo-500" 
                placeholder="name@example.com" 
                required 
              />
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-slate-400 mb-1">Password</label>
              <input 
                type="password" 
                value={loginPassword} 
                onChange={e => setLoginPassword(e.target.value)} 
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 outline-none text-white focus:border-indigo-500" 
                placeholder="••••••••" 
                required 
              />
            </div>

            <div className="text-right">
              <button 
                type="button" 
                onClick={() => { setMessage(''); setResetStep('request'); }} 
                className="text-xs text-indigo-400 hover:underline cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-indigo-600 py-3 rounded-lg font-bold hover:bg-indigo-700 transition text-white flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
              <span>Login</span>
            </button>

            <p className="text-center text-xs text-slate-400 mt-4">
              Don't have an account?{' '}
              <button 
                type="button"
                onClick={() => handleSwitchAuthMode('signup')}
                className="text-indigo-400 hover:underline font-semibold cursor-pointer"
              >
                Sign Up
              </button>
            </p>
          </form>
        )}

        {/* SIGNUP FORM */}
        {resetStep === 'none' && !isOtpStep && authMode === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="space-y-4">
            <div>
              <label className="block text-xs uppercase font-bold text-slate-400 mb-1">Full Name</label>
              <input 
                type="text" 
                value={signupFullName} 
                onChange={e => setSignupFullName(e.target.value)} 
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 outline-none text-white focus:border-indigo-500" 
                placeholder="Mohd Shariq" 
                required 
              />
            </div>
            <div>
              <label className="block text-xs uppercase font-bold text-slate-400 mb-1">Email Address</label>
              <input 
                type="email" 
                value={signupEmail} 
                onChange={e => setSignupEmail(e.target.value)} 
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 outline-none text-white focus:border-indigo-500" 
                placeholder="name@example.com" 
                required 
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-bold text-slate-400 mb-1">Password</label>
              <input 
                type="password" 
                value={signupPassword} 
                onChange={e => setSignupPassword(e.target.value)} 
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 outline-none text-white focus:border-indigo-500" 
                placeholder="••••••••" 
                required 
                minLength={6} 
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-bold text-slate-400 mb-1">Confirm Password</label>
              <input 
                type="password" 
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)} 
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 outline-none text-white focus:border-indigo-500"
                placeholder="••••••••" 
                required 
                minLength={6} 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-indigo-600 py-3 rounded-lg font-bold hover:bg-indigo-700 transition mt-2 text-white flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
              <span>Continue & Send OTP</span>
            </button>

            <p className="text-center text-xs text-slate-400 mt-4">
              Already have an account?{' '}
              <button 
                type="button"
                onClick={() => handleSwitchAuthMode('login')}
                className="text-indigo-400 hover:underline font-semibold cursor-pointer"
              >
                Login
              </button>
            </p>
          </form>
        )}

        {/* Signup OTP Verification */}
        {resetStep === 'none' && isOtpStep && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <p className="text-sm text-slate-400 text-center">Enter the 6-digit code sent to <strong>{signupEmail}</strong>.</p>
            <input 
              type="text" 
              maxLength={6} 
              value={otp} 
              onChange={e => setOtp(e.target.value)} 
              className="w-full text-center tracking-widest text-2xl bg-slate-900 border border-slate-700 rounded-lg p-3 outline-none font-mono text-white focus:border-indigo-500" 
              placeholder="123456" 
              required 
            />
            <button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-emerald-600 py-3 rounded-lg font-bold hover:bg-emerald-700 transition text-white flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
              <span>Verify & Proceed</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}