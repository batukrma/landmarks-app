'use client';

import ClientMap from '@/components/ClientMap';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      // Redirect to login page after successful logout
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return <ClientMap onSignOut={handleSignOut} />;
}
