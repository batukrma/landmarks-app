import Image from 'next/image';
import logo from '@/assets/logo.svg';

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white">
      <div className="relative w-[200px] h-[30px]">
        <Image
          src={logo}
          alt="Landmarks Logo"
          className="w-full h-full object-contain"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shine" />
      </div>
    </div>
  );
}
