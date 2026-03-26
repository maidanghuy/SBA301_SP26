import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Monitor, Lock, Mail, User as UserIcon, AlertCircle, ArrowRight, Phone, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import authService from '../../api/authService';
import { parseBackendErrors } from '../../utils/parseBackendErrors';
import { registerSchema, RegisterFormValues } from '../../schemas/auth/register.schema';
import { sendOtpSchema } from '../../schemas/auth/otp.schema';

const Register: React.FC = () => {
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [otp, setOtp] = useState('');
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    getValues,
    setError,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const handleSendOtp = async () => {
    const email = getValues('email');
    const validation = sendOtpSchema.safeParse({ email });
    
    if (!validation.success) {
      setError('email', { type: 'manual', message: validation.error.issues[0].message });
      return;
    }

    setServerError(null);
    setIsLoading(true);
    try {
      await authService.sendOtp(email);
      setIsOtpSent(true);
      setSuccessMessage('OTP has been sent to your email');
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message;
      if (typeof msg === 'string' && msg.includes('{')) {
        const backendErrors = parseBackendErrors(msg);
        Object.entries(backendErrors).forEach(([field, m]) => {
          setError(field as any, { type: 'manual', message: m });
        });
      } else {
        setServerError(msg || 'Failed to send OTP');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 4) {
      setServerError('Please enter a valid OTP');
      return;
    }

    setServerError(null);
    setIsLoading(true);
    try {
      await authService.verifyOtp(getValues('email'), otp);
      setIsOtpVerified(true);
      setSuccessMessage('OTP verified successfully. Please complete your registration.');
    } catch (err: any) {
      setServerError(err.response?.data?.error?.message || err.message || 'Invalid or expired OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: RegisterFormValues) => {
    if (!isOtpVerified) {
      setServerError('Please verify your email with OTP first');
      return;
    }

    setServerError(null);
    setIsLoading(true);

    try {
      await registerUser(data);
      navigate('/');
    } catch (err: any) {
      const msg = err.response?.data?.error?.message || err.message;
      if (typeof msg === 'string' && msg.includes('{')) {
        const backendErrors = parseBackendErrors(msg);
        Object.entries(backendErrors).forEach(([field, m]) => {
          setError(field as any, { type: 'manual', message: m });
        });
      } else {
        setServerError(msg || 'Registration failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-6 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white border border-neutral-200 p-8 shadow-sm rounded-[4px]">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-neutral-900 p-3 rounded-[4px] mb-4">
              <Monitor size={32} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tighter uppercase">Create Account</h1>
            <p className="text-neutral-500 text-sm mt-1">Join the CompTech management network</p>
          </div>

          <AnimatePresence mode="wait">
            {serverError && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm flex items-start gap-3 rounded-[4px]"
              >
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <span>{serverError}</span>
              </motion.div>
            )}

            {successMessage && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm flex items-start gap-3 rounded-[4px]"
              >
                <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field - Always visible but disabled after verification */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2">
                Email Address
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                  <input
                    {...register('email')}
                    type="email"
                    disabled={isOtpSent}
                    className={`w-full pl-10 pr-4 py-3 bg-neutral-50 border ${errors.email ? 'border-red-500' : 'border-neutral-200'} rounded-[4px] focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all text-sm disabled:opacity-60`}
                    placeholder="name@company.com"
                  />
                </div>
                {!isOtpSent && (
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={isLoading}
                    className="px-4 bg-neutral-900 text-white text-xs font-bold uppercase tracking-widest rounded-[4px] hover:bg-neutral-800 transition-all disabled:opacity-50"
                  >
                    Send OTP
                  </button>
                )}
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-500 font-medium">{errors.email.message}</p>
              )}
            </div>

            {/* OTP Field - Visible after sending OTP */}
            {isOtpSent && !isOtpVerified && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-neutral-50 border border-neutral-200 rounded-[4px] space-y-3"
              >
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600">
                  Verification Code
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white border border-neutral-200 rounded-[4px] focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all text-sm"
                      placeholder="Enter OTP"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={isLoading}
                    className="px-4 bg-neutral-900 text-white text-xs font-bold uppercase tracking-widest rounded-[4px] hover:bg-neutral-800 transition-all disabled:opacity-50"
                  >
                    Verify
                  </button>
                </div>
                <button 
                  type="button" 
                  onClick={() => setIsOtpSent(false)}
                  className="text-[10px] text-neutral-500 uppercase font-bold hover:text-neutral-900"
                >
                  Change Email
                </button>
              </motion.div>
            )}

            {/* Full Form - Visible after OTP verified */}
            <AnimatePresence>
              {isOtpVerified && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-4 pt-2"
                >
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                      <input
                        {...register('fullName')}
                        type="text"
                        className={`w-full pl-10 pr-4 py-3 bg-neutral-50 border ${errors.fullName ? 'border-red-500' : 'border-neutral-200'} rounded-[4px] focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all text-sm`}
                        placeholder="John Doe"
                      />
                    </div>
                    {errors.fullName && (
                      <p className="mt-1 text-xs text-red-500 font-medium">{errors.fullName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2">
                      Phone Number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                      <input
                        {...register('phone')}
                        type="text"
                        className={`w-full pl-10 pr-4 py-3 bg-neutral-50 border ${errors.phone ? 'border-red-500' : 'border-neutral-200'} rounded-[4px] focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all text-sm`}
                        placeholder="0912345678"
                      />
                    </div>
                    {errors.phone && (
                      <p className="mt-1 text-xs text-red-500 font-medium">{errors.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                      <input
                        {...register('password')}
                        type="password"
                        className={`w-full pl-10 pr-4 py-3 bg-neutral-50 border ${errors.password ? 'border-red-500' : 'border-neutral-200'} rounded-[4px] focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all text-sm`}
                        placeholder="••••••••"
                      />
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-xs text-red-500 font-medium">{errors.password.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                      <input
                        {...register('confirmPassword')}
                        type="password"
                        className={`w-full pl-10 pr-4 py-3 bg-neutral-50 border ${errors.confirmPassword ? 'border-red-500' : 'border-neutral-200'} rounded-[4px] focus:outline-none focus:ring-2 focus:ring-neutral-900/10 focus:border-neutral-900 transition-all text-sm`}
                        placeholder="••••••••"
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-xs text-red-500 font-medium">{errors.confirmPassword.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-neutral-900 text-white py-3 font-bold uppercase tracking-widest text-xs rounded-[4px] hover:bg-neutral-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <>
                        Complete Registration
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          <div className="mt-8 pt-6 border-t border-neutral-100 text-center">
            <p className="text-sm text-neutral-500">
              Already have an account?{' '}
              <Link to="/login" className="text-neutral-900 font-bold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
