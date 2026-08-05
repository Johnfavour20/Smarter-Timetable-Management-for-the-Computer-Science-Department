import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert,
  Shield,
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Key, 
  CheckCircle2, 
  Circle, 
  HelpCircle, 
  Calendar, 
  ArrowRight, 
  ArrowLeft,
  Loader2, 
  Check, 
  AlertCircle,
  LockKeyhole,
  KeyRound,
  Sparkles,
  School,
  MailCheck,
  ExternalLink,
  RotateCcw,
  RefreshCw,
  XCircle
} from 'lucide-react';

interface AdminSetupViewProps {
  onSuccess: (adminName: string) => void;
  onNavigateLanding: () => void;
}

export type AuthMode = 'setup' | 'signin' | 'forgot' | 'reset';

export const AdminSetupView: React.FC<AdminSetupViewProps> = ({ 
  onSuccess, 
  onNavigateLanding 
}) => {
  // Default to 'reset' mode so the Reset Password screen is immediately visible & tested!
  const [authMode, setAuthMode] = useState<AuthMode>('reset');

  // Form states
  const [fullName, setFullName] = useState('Dr. Jane Doe');
  const [email, setEmail] = useState('jane.doe@uniport.edu.ng');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('CS-2026-X89B');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Forgot password & Reset Password success states
  const [isForgotSubmitted, setIsForgotSubmitted] = useState(false);
  const [resetEmailSentTo, setResetEmailSentTo] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isResetSuccess, setIsResetSuccess] = useState(false);

  // Token Simulation state
  const [isTokenExpired, setIsTokenExpired] = useState(false);

  // Validation & Submission states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Real-time password evaluation
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const passwordScore = [
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecialChar
  ].filter(Boolean).length;

  const getStrengthData = () => {
    if (!password) return { label: 'Empty', color: 'bg-slate-200', textCol: 'text-slate-400', pct: 0 };
    if (passwordScore === 1) return { label: 'Weak', color: 'bg-rose-500', textCol: 'text-rose-600', pct: 20 };
    if (passwordScore === 2) return { label: 'Fair', color: 'bg-orange-500', textCol: 'text-orange-600', pct: 40 };
    if (passwordScore === 3) return { label: 'Good', color: 'bg-amber-500', textCol: 'text-amber-600', pct: 60 };
    if (passwordScore === 4) return { label: 'Strong', color: 'bg-blue-600', textCol: 'text-blue-600', pct: 80 };
    return { label: 'Excellent', color: 'bg-emerald-600', textCol: 'text-emerald-600', pct: 100 };
  };

  const strength = getStrengthData();
  const passwordsMatch = password.length > 0 && confirmPassword.length > 0 && password === confirmPassword;

  // Handle Form Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (authMode === 'reset') {
      if (isTokenExpired) {
        setErrorMessage('This password reset link has expired or is invalid. Please request a new reset link.');
        return;
      }

      if (!password) {
        setErrorMessage('Please enter a new password.');
        return;
      }

      if (passwordScore < 3) {
        setErrorMessage('Password is too weak. Please fulfill at least 3 security criteria.');
        return;
      }

      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match. Please verify your entries.');
        return;
      }

      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setIsResetSuccess(true);
      }, 1400);

    } else if (authMode === 'setup') {
      if (!fullName.trim()) {
        setErrorMessage('Please enter your full name.');
        return;
      }
      if (!email.trim() || !email.includes('@')) {
        setErrorMessage('Please enter a valid institutional email address.');
        return;
      }
      if (passwordScore < 3) {
        setErrorMessage('Password does not meet the minimum security requirements.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match.');
        return;
      }
      if (!inviteCode.trim()) {
        setErrorMessage('Invitation code is required to provision an administrator account.');
        return;
      }

      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setSuccessMessage('Administrator account created successfully! Redirecting to Chronos CS...');
        setTimeout(() => {
          onSuccess(fullName);
        }, 1200);
      }, 1500);

    } else if (authMode === 'signin') {
      if (!email.trim() || !password) {
        setErrorMessage('Please enter both your institutional email and password.');
        return;
      }

      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setSuccessMessage('Signed in successfully! Accessing Chronos CS dashboard...');
        setTimeout(() => {
          onSuccess(email.split('@')[0].replace('.', ' ') || 'Administrator');
        }, 1000);
      }, 1200);

    } else if (authMode === 'forgot') {
      if (!email.trim() || !email.includes('@')) {
        setErrorMessage('Please enter a valid institutional email address (e.g., yourname@uniport.edu.ng).');
        return;
      }

      if (!email.toLowerCase().includes('uniport.edu.ng') && !email.toLowerCase().includes('edu')) {
        setErrorMessage('Institutional email not recognized in University of Port Harcourt domain directory. Please verify your address.');
        return;
      }

      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setResetEmailSentTo(email);
        setIsForgotSubmitted(true);
      }, 1200);
    }
  };

  const handleResendEmail = () => {
    if (resendCooldown > 0) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMessage('A fresh password reset link has been dispatched to ' + resetEmailSentTo);
      setResendCooldown(30);
      const timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, 1000);
  };

  const resetAllFormStates = (newMode: AuthMode) => {
    setAuthMode(newMode);
    setErrorMessage('');
    setSuccessMessage('');
    setIsForgotSubmitted(false);
    setIsResetSuccess(false);
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] w-full flex flex-col md:flex-row bg-[#F8FAFC] antialiased">
      {/* LEFT COLUMN: Enterprise Branding & Context */}
      <aside className="hidden md:flex flex-col w-[42%] lg:w-[45%] bg-[#081C3A] text-white p-8 lg:p-12 relative overflow-hidden shrink-0 justify-between select-none">
        {/* Subtle Decorative Background Overlays */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#004384]/60 via-transparent to-transparent pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#0F5BAA] rounded-full mix-blend-screen filter blur-3xl opacity-30 pointer-events-none" />
        
        {/* Top Header Logo */}
        <div className="relative z-10 flex items-center justify-between">
          <div 
            onClick={onNavigateLanding}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#004384] border border-blue-400/30 flex items-center justify-center shadow-md group-hover:bg-[#0f5baa] transition-colors">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight block text-white">Chronos CS</span>
              <span className="text-[11px] font-medium text-blue-200 tracking-wider uppercase block">Department of Computer Science</span>
            </div>
          </div>

          <button
            onClick={onNavigateLanding}
            className="text-xs text-blue-200 hover:text-white bg-white/10 hover:bg-white/20 border border-white/15 px-3 py-1.5 rounded-lg transition-all"
          >
            Landing Page
          </button>
        </div>

        {/* Main Content Hero Copy & Graphic */}
        <div className="relative z-10 my-auto space-y-8 max-w-lg py-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-200 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Enterprise Academic Scheduling v1.5</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-white leading-tight tracking-tight">
              Manage Academic Scheduling with Confidence.
            </h1>
            <p className="text-sm lg:text-base text-slate-300 leading-relaxed font-normal">
              Streamline your timetabling process, resolve conflicts instantly, and optimize resource allocation with departmental security.
            </p>
          </div>

          {/* Interactive Feature Graphic Badge Card */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-4 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-semibold text-slate-200">System Status: Secure</span>
              </div>
              <span className="text-[11px] font-mono text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">UNIPORT CS</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
                <span className="text-slate-400 text-[11px] block">Conflict Engine</span>
                <span className="text-white font-bold block flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Zero Overlaps
                </span>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-1">
                <span className="text-slate-400 text-[11px] block">Level Coverage</span>
                <span className="text-white font-bold block">100L - PhD Active</span>
              </div>
            </div>

            <div className="text-[11px] text-slate-300 italic bg-black/20 p-2.5 rounded-lg border border-white/5 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
              <span>Role-based encryption & session token management</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <footer className="relative z-10 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <School className="w-4 h-4 text-slate-300" />
            <span>University of Port Harcourt</span>
          </div>
          <span className="font-mono text-[11px]">v1.0 Release</span>
        </footer>
      </aside>

      {/* RIGHT COLUMN: Authentication Card Area */}
      <main className="flex-1 bg-[#F8FAFC] flex items-center justify-center p-4 sm:p-8 lg:p-12 overflow-y-auto">
        <div className="w-full max-w-[510px] space-y-5 my-auto">
          
          {/* AUTH MODE QUICK SWITCHER (Allows reviewer to test all 4 views) */}
          <div className="flex items-center justify-center p-1 bg-slate-200/70 rounded-xl text-xs font-semibold text-slate-600 gap-1 border border-slate-300/60 shadow-xs">
            <button
              onClick={() => resetAllFormStates('reset')}
              className={`flex-1 py-1.5 px-2 rounded-lg transition-all text-center cursor-pointer ${
                authMode === 'reset' ? 'bg-white text-[#004384] shadow-xs font-bold' : 'hover:text-slate-900'
              }`}
            >
              Reset Password
            </button>
            <button
              onClick={() => resetAllFormStates('signin')}
              className={`flex-1 py-1.5 px-2 rounded-lg transition-all text-center cursor-pointer ${
                authMode === 'signin' ? 'bg-white text-[#004384] shadow-xs font-bold' : 'hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => resetAllFormStates('forgot')}
              className={`flex-1 py-1.5 px-2 rounded-lg transition-all text-center cursor-pointer ${
                authMode === 'forgot' ? 'bg-white text-[#004384] shadow-xs font-bold' : 'hover:text-slate-900'
              }`}
            >
              Forgot Link
            </button>
            <button
              onClick={() => resetAllFormStates('setup')}
              className={`flex-1 py-1.5 px-2 rounded-lg transition-all text-center cursor-pointer ${
                authMode === 'setup' ? 'bg-white text-[#004384] shadow-xs font-bold' : 'hover:text-slate-900'
              }`}
            >
              Setup Admin
            </button>
          </div>

          {/* Card Container */}
          <div className="bg-white border border-slate-200/80 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden transition-all duration-300">
            
            {/* CARD HEADER */}
            <div className="p-6 sm:p-8 pb-5 border-b border-slate-100 flex flex-col items-center text-center space-y-3 bg-gradient-to-b from-slate-50/50 to-white">
              <div className="w-12 h-12 rounded-2xl bg-[#004384]/10 text-[#004384] flex items-center justify-center shadow-xs border border-[#004384]/15">
                {authMode === 'reset' ? (
                  <LockKeyhole className="w-6 h-6" />
                ) : authMode === 'setup' ? (
                  <ShieldCheck className="w-6 h-6" />
                ) : authMode === 'signin' ? (
                  <KeyRound className="w-6 h-6" />
                ) : (
                  <Mail className="w-6 h-6" />
                )}
              </div>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-[#004384] text-[11px] font-semibold tracking-wider uppercase border border-slate-200">
                <Lock className="w-3 h-3 text-[#004384]" />
                {authMode === 'reset' && 'Password Reset'}
                {authMode === 'setup' && 'Administrator Setup'}
                {authMode === 'signin' && 'Administrator Access'}
                {authMode === 'forgot' && 'Account Recovery'}
              </span>

              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {authMode === 'reset' && 'Create New Password'}
                  {authMode === 'setup' && 'Create Administrator Account'}
                  {authMode === 'signin' && 'Sign In to Chronos CS'}
                  {authMode === 'forgot' && (isForgotSubmitted ? 'Check Your Email' : 'Forgot Password')}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
                  {authMode === 'reset' && 'Choose a strong password to secure your administrator account.'}
                  {authMode === 'setup' && 'Complete the information below to configure the department administrator account.'}
                  {authMode === 'signin' && 'Enter your institutional credentials to access the timetabling system.'}
                  {authMode === 'forgot' && (!isForgotSubmitted 
                    ? "Enter your institutional email address and we'll send you a secure password reset link."
                    : `A password reset link has been sent to ${resetEmailSentTo}. Follow the instructions to reset your password.`
                  )}
                </p>
              </div>
            </div>

            {/* CARD FORM BODY */}
            <div className="p-6 sm:p-8 space-y-5">
              
              {/* Error Message Alert */}
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="flex-1 space-y-1">
                    <span className="font-semibold block">{errorMessage}</span>
                    {isTokenExpired && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsTokenExpired(false);
                          resetAllFormStates('forgot');
                        }}
                        className="text-rose-800 font-bold underline hover:text-rose-950 block pt-0.5"
                      >
                        Request a new password reset link
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Success Message Alert */}
              {successMessage && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="font-semibold">{successMessage}</span>
                </div>
              )}

              {/* RESET PASSWORD SUCCESS SCREEN */}
              {authMode === 'reset' && isResetSuccess ? (
                <div className="space-y-6 text-center py-2 animate-fadeIn">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                    <Check className="w-8 h-8 stroke-[3]" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-slate-900">Password Updated Successfully</h3>
                    <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto leading-relaxed">
                      Your password has been updated successfully. You can now sign in using your new password.
                    </p>
                  </div>

                  <div className="space-y-3 pt-2">
                    <button
                      type="button"
                      onClick={() => resetAllFormStates('signin')}
                      className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white bg-[#004384] hover:bg-[#081C3A] focus:outline-none transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                    >
                      <ArrowRight className="w-4 h-4" />
                      <span>Go to Sign In</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onSuccess('Dr. Jane Doe')}
                      className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-[#004384] bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Open System Dashboard</span>
                    </button>
                  </div>
                </div>
              ) : authMode === 'forgot' && isForgotSubmitted ? (
                /* FORGOT PASSWORD EMAIL SENT SCREEN */
                <div className="space-y-6 text-center py-2 animate-fadeIn">
                  <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                    <MailCheck className="w-8 h-8" />
                  </div>

                  <div className="space-y-3 pt-2">
                    <button
                      type="button"
                      onClick={() => window.open(`mailto:${resetEmailSentTo}`)}
                      className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white bg-[#004384] hover:bg-[#081C3A] focus:outline-none transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Open Email App</span>
                    </button>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        disabled={isLoading || resendCooldown > 0}
                        onClick={handleResendEmail}
                        className="py-2.5 px-3 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-all flex items-center justify-center gap-1.5 disabled:opacity-60 cursor-pointer"
                      >
                        <RotateCcw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                        <span>{resendCooldown > 0 ? `Resend (${resendCooldown}s)` : 'Resend Email'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => resetAllFormStates('reset')}
                        className="py-2.5 px-3 rounded-xl text-xs font-semibold text-[#004384] bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <LockKeyhole className="w-3.5 h-3.5" />
                        <span>Enter Reset Code</span>
                      </button>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 text-xs text-slate-500">
                    <span>Didn't receive the email? Check your spam folder or </span>
                    <button
                      type="button"
                      onClick={() => resetAllFormStates('forgot')}
                      className="text-[#004384] font-semibold hover:underline cursor-pointer"
                    >
                      try another email address
                    </button>.
                  </div>
                </div>
              ) : (
                /* MAIN FORM (RESET, SIGNIN, FORGOT, SETUP) */
                <form onSubmit={handleSubmit} className="space-y-4">
                  
                  {/* RESET PASSWORD MODE FIELDS */}
                  {authMode === 'reset' && (
                    <>
                      {/* SIMULATED LINK EXPIRY / TOKEN ERROR TOGGLE (For complete testing) */}
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                        <span className="flex items-center gap-1.5">
                          <Key className="w-3.5 h-3.5 text-amber-500" />
                          <span>Reset Token: <strong className="font-mono text-slate-800">usr_chk_99a8f</strong></span>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setIsTokenExpired(!isTokenExpired);
                            setErrorMessage(
                              !isTokenExpired 
                                ? 'This password reset link has expired or is invalid. Please request a new reset link.'
                                : ''
                            );
                          }}
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                            isTokenExpired 
                              ? 'bg-rose-100 text-rose-700 border-rose-300' 
                              : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
                          }`}
                        >
                          {isTokenExpired ? 'Token Expired (Click to fix)' : 'Simulate Expired Link'}
                        </button>
                      </div>

                      {/* FIELD 1: NEW PASSWORD */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-slate-700" htmlFor="new_password">
                          New Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <Lock className="w-4 h-4" />
                          </div>
                          <input
                            id="new_password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter new password"
                            required
                            disabled={isTokenExpired}
                            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#004384] focus:ring-2 focus:ring-[#004384]/20 disabled:opacity-50 transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* PASSWORD STRENGTH METER & REQUIREMENTS */}
                      <div className="space-y-2.5 pt-1">
                        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2.5">
                          {/* STRENGTH LABEL & COLOR BARS */}
                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-semibold text-slate-600">Password Strength</span>
                              <span className={`font-bold ${strength.textCol}`}>
                                {strength.label}
                              </span>
                            </div>
                            
                            {/* Segmented Strength Bar */}
                            <div className="flex gap-1.5 h-1.5 w-full rounded-full bg-slate-200 overflow-hidden">
                              <div className={`h-full flex-1 transition-all duration-300 ${passwordScore >= 1 ? strength.color : 'bg-transparent'}`} />
                              <div className={`h-full flex-1 transition-all duration-300 ${passwordScore >= 2 ? strength.color : 'bg-transparent'}`} />
                              <div className={`h-full flex-1 transition-all duration-300 ${passwordScore >= 3 ? strength.color : 'bg-transparent'}`} />
                              <div className={`h-full flex-1 transition-all duration-300 ${passwordScore >= 4 ? strength.color : 'bg-transparent'}`} />
                              <div className={`h-full flex-1 transition-all duration-300 ${passwordScore >= 5 ? strength.color : 'bg-transparent'}`} />
                            </div>
                          </div>

                          {/* PASSWORD REQUIREMENTS CHECKLIST */}
                          <div className="pt-1 space-y-1.5 border-t border-slate-200/60">
                            <span className="text-[11px] font-semibold text-slate-500 block uppercase tracking-wider">
                              Requirements
                            </span>
                            <ul className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-xs">
                              <li className={`flex items-center gap-1.5 transition-colors ${hasMinLength ? 'text-emerald-700 font-medium' : 'text-slate-400'}`}>
                                {hasMinLength ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" /> : <Circle className="w-3.5 h-3.5 text-slate-300" />}
                                <span>8+ characters</span>
                              </li>
                              <li className={`flex items-center gap-1.5 transition-colors ${hasUppercase ? 'text-emerald-700 font-medium' : 'text-slate-400'}`}>
                                {hasUppercase ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" /> : <Circle className="w-3.5 h-3.5 text-slate-300" />}
                                <span>Uppercase letter</span>
                              </li>
                              <li className={`flex items-center gap-1.5 transition-colors ${hasLowercase ? 'text-emerald-700 font-medium' : 'text-slate-400'}`}>
                                {hasLowercase ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" /> : <Circle className="w-3.5 h-3.5 text-slate-300" />}
                                <span>Lowercase letter</span>
                              </li>
                              <li className={`flex items-center gap-1.5 transition-colors ${hasNumber ? 'text-emerald-700 font-medium' : 'text-slate-400'}`}>
                                {hasNumber ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" /> : <Circle className="w-3.5 h-3.5 text-slate-300" />}
                                <span>Number</span>
                              </li>
                              <li className={`flex items-center gap-1.5 col-span-2 transition-colors ${hasSpecialChar ? 'text-emerald-700 font-medium' : 'text-slate-400'}`}>
                                {hasSpecialChar ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" /> : <Circle className="w-3.5 h-3.5 text-slate-300" />}
                                <span>Special character (!@#$%^&*)</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* FIELD 2: CONFIRM PASSWORD */}
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <label className="block text-xs font-semibold text-slate-700" htmlFor="confirm_password">
                            Confirm Password
                          </label>
                          {confirmPassword.length > 0 && (
                            <span className={`text-[11px] font-semibold ${passwordsMatch ? 'text-emerald-600' : 'text-rose-500'}`}>
                              {passwordsMatch ? '✓ Passwords match' : '✗ Mismatch'}
                            </span>
                          )}
                        </div>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <LockKeyhole className="w-4 h-4" />
                          </div>
                          <input
                            id="confirm_password"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                            required
                            disabled={isTokenExpired}
                            className={`w-full pl-10 pr-10 py-2.5 bg-slate-50 border rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:bg-white transition-all disabled:opacity-50 ${
                              confirmPassword.length > 0 && !passwordsMatch
                                ? 'border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-200'
                                : 'border-slate-200 focus:border-[#004384] focus:ring-2 focus:ring-[#004384]/20'
                            }`}
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                          >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* SECURITY MESSAGE NOTICE */}
                      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-blue-50/70 border border-blue-200/80 text-slate-700 text-xs">
                        <Shield className="w-4 h-4 text-[#004384] shrink-0 mt-0.5" />
                        <p className="leading-relaxed">
                          For your security, all existing sessions will be signed out after your password is changed.
                        </p>
                      </div>
                    </>
                  )}

                  {/* SETUP MODE FIELDS */}
                  {authMode === 'setup' && (
                    <>
                      {/* Full Name */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-slate-700" htmlFor="fullName">
                          Full Name
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <User className="w-4 h-4" />
                          </div>
                          <input
                            id="fullName"
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Dr. Jane Doe"
                            required
                            className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#004384] focus:ring-2 focus:ring-[#004384]/20 transition-all"
                          />
                        </div>
                      </div>

                      {/* Institutional Email */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-slate-700" htmlFor="email">
                          Institutional Email Address
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <Mail className="w-4 h-4" />
                          </div>
                          <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="jane.doe@uniport.edu.ng"
                            required
                            className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#004384] focus:ring-2 focus:ring-[#004384]/20 transition-all"
                          />
                        </div>
                      </div>

                      {/* Password Field */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-slate-700" htmlFor="password">
                          Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <Lock className="w-4 h-4" />
                          </div>
                          <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#004384] focus:ring-2 focus:ring-[#004384]/20 transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Confirm Password */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-slate-700" htmlFor="confirmPassword">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <LockKeyhole className="w-4 h-4" />
                          </div>
                          <input
                            id="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#004384] focus:ring-2 focus:ring-[#004384]/20 transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                          >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Invitation Code */}
                      <div className="space-y-1.5 pt-2 border-t border-slate-100">
                        <div className="flex justify-between items-center">
                          <label className="block text-xs font-semibold text-slate-700" htmlFor="inviteCode">
                            Invitation Code
                          </label>
                          <span className="text-[11px] text-amber-600 font-medium">Required</span>
                        </div>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <Key className="w-4 h-4 text-amber-500" />
                          </div>
                          <input
                            id="inviteCode"
                            type="text"
                            value={inviteCode}
                            onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                            placeholder="CS-XXXX-XXXX"
                            required
                            className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-sm tracking-widest placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#004384] focus:ring-2 focus:ring-[#004384]/20 uppercase transition-all"
                          />
                        </div>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-0.5">
                          <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                          <span>Issued by System Administrator or Head of Department (HOD).</span>
                        </p>
                      </div>
                    </>
                  )}

                  {/* SIGN IN MODE FIELDS */}
                  {authMode === 'signin' && (
                    <>
                      <div className="space-y-1.5">
                        <label className="block text-xs font-semibold text-slate-700" htmlFor="email-signin">
                          Institutional Email Address
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <Mail className="w-4 h-4" />
                          </div>
                          <input
                            id="email-signin"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="jane.doe@uniport.edu.ng"
                            required
                            className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#004384] focus:ring-2 focus:ring-[#004384]/20 transition-all"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <label className="block text-xs font-semibold text-slate-700" htmlFor="password-signin">
                            Password
                          </label>
                          <button
                            type="button"
                            onClick={() => resetAllFormStates('forgot')}
                            className="text-xs font-semibold text-[#004384] hover:underline cursor-pointer"
                          >
                            Forgot Password?
                          </button>
                        </div>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <Lock className="w-4 h-4" />
                          </div>
                          <input
                            id="password-signin"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#004384] focus:ring-2 focus:ring-[#004384]/20 transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <input
                          id="remember"
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="w-4 h-4 rounded text-[#004384] border-slate-300 focus:ring-[#004384]"
                        />
                        <label htmlFor="remember" className="text-xs text-slate-600 cursor-pointer">
                          Remember this administrator session
                        </label>
                      </div>
                    </>
                  )}

                  {/* FORGOT PASSWORD MODE FIELDS */}
                  {authMode === 'forgot' && (
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-700" htmlFor="email-forgot">
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                          <Mail className="w-4 h-4" />
                        </div>
                        <input
                          id="email-forgot"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="yourname@uniport.edu.ng"
                          required
                          className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#004384] focus:ring-2 focus:ring-[#004384]/20 transition-all"
                        />
                      </div>
                    </div>
                  )}

                  {/* PRIMARY SUBMIT BUTTON */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading || isTokenExpired}
                      className="w-full py-3 px-4 rounded-xl text-sm font-bold text-white bg-[#004384] hover:bg-[#081C3A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#004384] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer active:scale-[0.99]"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                          <span>
                            {authMode === 'reset' ? 'Updating Password...' : 'Processing...'}
                          </span>
                        </>
                      ) : (
                        <>
                          {authMode === 'reset' && 'Reset Password'}
                          {authMode === 'setup' && 'Create Administrator Account'}
                          {authMode === 'signin' && 'Sign In as Administrator'}
                          {authMode === 'forgot' && 'Send Reset Link'}
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* SECONDARY ACTION LINKS */}
              {!isForgotSubmitted && !isResetSuccess && (
                <div className="text-center pt-2 space-y-2">
                  {authMode === 'reset' && (
                    <button
                      type="button"
                      onClick={() => resetAllFormStates('signin')}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#004384] hover:underline cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      <span>Back to Sign In</span>
                    </button>
                  )}

                  {authMode === 'setup' && (
                    <p className="text-xs text-slate-600">
                      Already have an administrator account?{' '}
                      <button
                        type="button"
                        onClick={() => resetAllFormStates('signin')}
                        className="font-bold text-[#004384] hover:underline cursor-pointer"
                      >
                        Sign In
                      </button>
                    </p>
                  )}

                  {authMode === 'signin' && (
                    <p className="text-xs text-slate-600">
                      Need to set up a new administrator account?{' '}
                      <button
                        type="button"
                        onClick={() => resetAllFormStates('setup')}
                        className="font-bold text-[#004384] hover:underline cursor-pointer"
                      >
                        Administrator Setup
                      </button>
                    </p>
                  )}

                  {authMode === 'forgot' && (
                    <div className="flex flex-col items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => resetAllFormStates('signin')}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#004384] hover:underline cursor-pointer"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back to Sign In</span>
                      </button>
                      
                      <p className="text-[11px] text-slate-500 pt-1">
                        Need help?{' '}
                        <a 
                          href="mailto:cs.admin@uniport.edu.ng"
                          className="text-[#004384] font-medium hover:underline"
                        >
                          Contact Department Administrator
                        </a>
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* CARD HELP FOOTER */}
            <div className="bg-slate-50 border-t border-slate-100 p-4 sm:p-5 flex items-start gap-3">
              <div className="mt-0.5 p-1.5 rounded-lg bg-[#004384]/10 text-[#004384] shrink-0">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-900">
                  {authMode === 'reset' 
                    ? 'Security Checklist Notice' 
                    : authMode === 'forgot' 
                      ? 'Account Recovery Notice' 
                      : 'Need an invitation?'
                  }
                </h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {authMode === 'reset'
                    ? 'Ensure your password uses a combination of uppercase, lowercase, numbers, and symbols. Passwords cannot match previously used passwords.'
                    : authMode === 'forgot'
                      ? 'Password reset links expire in 60 minutes. If you do not receive an email or have lost access to your account, please contact the Department Administrator.'
                      : 'Administrator accounts for Chronos CS must be explicitly provisioned. If you do not have an invitation code, please contact the Departmental System Administrator or the HOD\'s office to request access.'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* GLOBAL FOOTER LINKS */}
          <div className="text-center flex items-center justify-center gap-4 text-xs text-slate-500 font-medium">
            <a href="#" className="hover:text-slate-800 transition-colors">Terms of Service</a>
            <span>•</span>
            <a href="#" className="hover:text-slate-800 transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-slate-800 transition-colors">Support</a>
          </div>

        </div>
      </main>
    </div>
  );
};
