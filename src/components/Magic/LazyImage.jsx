
import React, { useRef, useState, useEffect } from "react";

export default function LazyImage ({ src, alt, placeholder, onTap }) {
  const [isIntersecting, setIntersecting] = useState(false);
  const imgRef = useRef();

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
        observer.unobserve(imgRef.current);
      }
    };
  }, []);

  return (
    <img
      ref={imgRef}
      src={isIntersecting ? src : placeholder}
      alt={alt}
      onClick={onTap}
      style={{ width: "100%", height: "auto" }}
    />
  );
};
