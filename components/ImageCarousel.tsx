import { useState, useEffect } from 'react';
import Image, { StaticImageData } from 'next/image';

interface ImageCarouselProps {
  images: StaticImageData[];
  autoplayInterval?: number;
}

export default function ImageCarousel({
  images,
  autoplayInterval = 3000,
}: ImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, autoplayInterval);

    return () => clearInterval(timer);
  }, [images.length, autoplayInterval]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <style jsx>{`
        .carousel-slide {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          transition: opacity 1.5s cubic-bezier(0.4, 0, 0.2, 1);
          pointer-events: none;
        }
        .carousel-slide--active {
          opacity: 1;
          pointer-events: auto;
          z-index: 1;
        }
      `}</style>

      <div className="h-full relative">
        {images.map((image, index) => (
          <div
            key={index}
            className={`carousel-slide ${
              index === activeIndex ? 'carousel-slide--active' : ''
            }`}
          >
            <Image
              src={image}
              alt={`Slide ${index + 1}`}
              fill
              className="object-cover"
              priority={index === activeIndex}
            />
          </div>
        ))}
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black opacity-20 z-10" />
    </div>
  );
}
