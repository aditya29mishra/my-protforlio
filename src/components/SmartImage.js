import React, { useEffect, useRef, useState } from "react";
import "../styles/SmartImage.css";

const seenSources = new Set();

const SmartImage = ({
  src,
  alt,
  className = "",
  wrapperClassName = "",
  style,
  aspectRatio,
  rootMargin = "250px",
  priority = false,
  sizes,
}) => {
  const wrapperRef = useRef(null);
  const [shouldLoad, setShouldLoad] = useState(priority || seenSources.has(src));
  const [isLoaded, setIsLoaded] = useState(seenSources.has(src));

  useEffect(() => {
    setShouldLoad(priority || seenSources.has(src));
    setIsLoaded(seenSources.has(src));
  }, [priority, src]);

  useEffect(() => {
    if (!src || shouldLoad || priority) {
      return undefined;
    }

    const target = wrapperRef.current;

    if (!target || typeof IntersectionObserver === "undefined") {
      setShouldLoad(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [priority, rootMargin, shouldLoad, src]);

  const handleLoad = () => {
    if (src) {
      seenSources.add(src);
    }

    setIsLoaded(true);
  };

  const wrapperStyle = {
    ...style,
    ...(aspectRatio ? { aspectRatio } : {}),
  };

  return (
    <div
      ref={wrapperRef}
      className={`smart-image ${wrapperClassName} ${
        isLoaded ? "smart-image--loaded" : ""
      }`.trim()}
      style={wrapperStyle}
    >
      {!isLoaded && <div className="smart-image__skeleton" aria-hidden="true" />}
      {shouldLoad && src ? (
        <img
          src={src}
          alt={alt}
          className={`smart-image__img ${className}`.trim()}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
          sizes={sizes}
          onLoad={handleLoad}
          onError={handleLoad}
        />
      ) : null}
    </div>
  );
};

export default SmartImage;
