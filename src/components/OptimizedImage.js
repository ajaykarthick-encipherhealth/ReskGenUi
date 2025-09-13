import React, { useState } from 'react';
import Image from 'next/image';

const OptimizedImage = ({ 
  src, 
  alt, 
  width, 
  height, 
  className = '', 
  style = {},
  priority = false,
  placeholder = 'blur',
  blurDataURL,
  ...props 
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Generate a simple blur placeholder if not provided
  const defaultBlurDataURL = `data:image/svg+xml;base64,${Buffer.from(
    `<svg width="${width || 100}" height="${height || 100}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f0f0f0"/>
    </svg>`
  ).toString('base64')}`;

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  if (hasError) {
    return (
      <div 
        className={`image-error ${className}`}
        style={{
          width: width || '100%',
          height: height || 'auto',
          backgroundColor: '#f5f5f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#999',
          fontSize: '12px',
          ...style
        }}
      >
        Image not available
      </div>
    );
  }

  return (
    <div 
      className={`optimized-image-container ${className}`}
      style={{ 
        position: 'relative',
        width: width || '100%',
        height: height || 'auto',
        ...style 
      }}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        placeholder={placeholder}
        blurDataURL={blurDataURL || defaultBlurDataURL}
        onLoad={handleLoad}
        onError={handleError}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        style={{
          objectFit: 'cover',
          transition: 'opacity 0.3s ease',
          opacity: isLoading ? 0 : 1,
        }}
        {...props}
      />
      {isLoading && (
        <div 
          className="image-loading-placeholder"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'skeleton 1.4s ease infinite',
          }}
        >
          <div style={{ fontSize: '12px', color: '#999' }}>Loading...</div>
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;