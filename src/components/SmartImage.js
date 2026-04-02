import React, {
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import "../styles/SmartImage.css";

const seenSources = new Set();
const sharedObservers = new Map();
const observerListeners = new WeakMap();

function getSharedObserver(rootMargin) {
  if (sharedObservers.has(rootMargin)) {
    return sharedObservers.get(rootMargin);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const listener = observerListeners.get(entry.target);

        if (listener) {
          listener();
        }
      });
    },
    { rootMargin }
  );

  sharedObservers.set(rootMargin, observer);

  return observer;
}

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
  const latestSourceRef = useRef(src);
  const [shouldLoad, setShouldLoad] = useState(priority || seenSources.has(src));
  const [isLoaded, setIsLoaded] = useState(seenSources.has(src));

  useEffect(() => {
    latestSourceRef.current = src;
  }, [src]);

  useEffect(() => {
    setShouldLoad(priority || seenSources.has(src));
    setIsLoaded(seenSources.has(src));
  }, [priority, src]);

  const activateLoading = useCallback(() => {
    setShouldLoad(true);
  }, []);

  useEffect(() => {
    if (!src || shouldLoad || priority) {
      return undefined;
    }

    const target = wrapperRef.current;

    if (!target || typeof IntersectionObserver === "undefined") {
      setShouldLoad(true);
      return undefined;
    }

    const observer = getSharedObserver(rootMargin);
    observerListeners.set(target, activateLoading);

    observer.observe(target);

    return () => {
      observer.unobserve(target);
      observerListeners.delete(target);
    };
  }, [activateLoading, priority, rootMargin, shouldLoad, src]);

  const handleLoad = useCallback(() => {
    if (latestSourceRef.current) {
      seenSources.add(latestSourceRef.current);
    }

    setIsLoaded(true);
  }, []);

  const wrapperStyle = {
    ...style,
    ...(aspectRatio ? { "--smart-image-aspect-ratio": aspectRatio } : {}),
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

export default memo(SmartImage);
