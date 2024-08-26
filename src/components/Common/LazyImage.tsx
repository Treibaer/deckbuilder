import { useEffect, useRef, useState } from "react";

const LazyImage: React.FC<{
  src: string;
  alt: string;
  placeholder: string;
  onTap?: () => void;
  onMouseOver?: () => void;
  title?: string;
}> = ({ src, alt, placeholder, onTap, onMouseOver, title }) => {
  const [isIntersecting, setIntersecting] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIntersecting(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.unobserve(imgRef.current);
      }
    };
  }, []);

  return (
    <img
      ref={imgRef}
      title={title}
      src={isIntersecting ? src : placeholder}
      alt={alt}
      onClick={onTap}
      onMouseOver={onMouseOver}
      style={{ width: "100%", height: "auto" }}
    />
  );
};

export default LazyImage;
