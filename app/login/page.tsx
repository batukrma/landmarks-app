'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import login1 from '@/assets/login-1.jpg';
import login2 from '@/assets/login-2.jpg';
import login3 from '@/assets/login-3.jpg';
import login4 from '@/assets/login-4.jpg';
import login5 from '@/assets/login-5.jpg';
import login6 from '@/assets/login-6.jpg';
import ImageCarousel from '@/components/ImageCarousel';

const backgroundImages = [login1, login2, login3, login4, login5, login6];

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async (isSignUp: boolean) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          isSignUp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error);
        return;
      }

      router.push('/');
      router.refresh();
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleAuth(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleAuth(true);
  };

  return (
    <div className="flex h-screen">
      <div className="relative flex-1 hidden lg:block">
        <ImageCarousel images={backgroundImages} autoplayInterval={2000} />
      </div>
      <div className="w-[360px] bg-white border-l border-gray-200 flex flex-col">
        <div className="flex-col gap-2 px-6 py-6 flex justify-between items-center border-b border-gray-200">
          <h1 className="font-zain text-4xl text-gray-900 m-0">
            landmarks app
          </h1>
        </div>

        <form className="flex-1 overflow-y-auto px-6 py-6">
          {error && (
            <div className="mb-6 bg-red-50 text-red-500 p-3 text-sm border border-red-200">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="text-sm font-medium text-gray-900 block mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200 bg-white focus:ring-0 focus:border-gray-400 px-3 py-2 text-sm"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-900 block mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-200 bg-white focus:ring-0 focus:border-gray-400 px-3 py-2 text-sm"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <button
              type="button"
              onClick={handleSignIn}
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-black text-white text-sm font-medium uppercase tracking-wider hover:bg-gray-900 transition-colors"
            >
              {isLoading ? 'Loading...' : 'Sign in'}
            </button>
            <button
              type="button"
              onClick={handleSignUp}
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-white text-gray-900 text-sm font-medium uppercase tracking-wider border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              {isLoading ? 'Loading...' : 'Sign up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
