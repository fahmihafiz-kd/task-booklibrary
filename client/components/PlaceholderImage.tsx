import React from 'react';

interface PlaceholderImageProps {
  width: number;
  height: number;
  className?: string;
}

const PlaceholderImage: React.FC<PlaceholderImageProps> = ({ width, height, className }) => (
  <div
    className={className}
    style={{ width, height, backgroundColor: '#ccc', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
  >
  </div>
);

export default PlaceholderImage;
