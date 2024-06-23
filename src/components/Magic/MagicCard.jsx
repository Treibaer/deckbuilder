import { lazy } from "react";
import "./MagicCard.css";

const backside = "https://magic.treibaer.de/image/card/backside.jpg";

function determineImageUrl(card) {
  if (card.image_uris) {
    // if is scryfall card
    return card.image_uris.normal;
  } else if (card.image) {
    // if is treibaer card
    return card.image;
  } else {
    return backside;
  }
}

export default function MagicCard({
  card = { name: "Loading...", image: backside },
  src = "https://magic.treibaer.de/image/card/normal/0004311b-646a-4df8-a4b4-9171642e9ef4",
  onTap = () => {},
  size = "normal",
}) {
  lazy();
  return (
    <div className={"magicCard " + size}>
      {/* <div className="title">{card.name}</div> */}
      <LazyImage
        src={determineImageUrl(card)}
        alt={card.name}
        placeholder={backside}
        onTap={onTap}
      />
      {/* <img src2={backside} loading="lazy" src={determineImageUrl(card)} onClick={onTap} /> */}
    </div>
  );
}

import React, { useRef, useState, useEffect } from "react";

const LazyImage = ({ src, alt, placeholder, onTap }) => {
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
