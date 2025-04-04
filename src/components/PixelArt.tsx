
import React from 'react';

interface PixelProps {
  color: string;
  className?: string;
}

const Pixel: React.FC<PixelProps> = ({ color, className = "" }) => (
  <div className={`aspect-square ${color} ${className}`} />
);

interface PixelArtProps {
  className?: string;
  variant: 'coffee' | 'laptop' | 'code' | 'plant';
}

const PixelArt: React.FC<PixelArtProps> = ({ className = "", variant }) => {
  const renderCoffee = () => (
    <div className="grid grid-cols-6 gap-0.5 w-full max-w-[120px]">
      {/* Cup top */}
      <Pixel color="bg-transparent" />
      <Pixel color="bg-coffee-dark" />
      <Pixel color="bg-coffee-dark" />
      <Pixel color="bg-coffee-dark" />
      <Pixel color="bg-coffee-dark" />
      <Pixel color="bg-transparent" />
      
      {/* Cup body */}
      <Pixel color="bg-coffee-dark" />
      <Pixel color="bg-coffee-light" />
      <Pixel color="bg-coffee-light" />
      <Pixel color="bg-coffee-light" />
      <Pixel color="bg-coffee-light" />
      <Pixel color="bg-coffee-dark" />
      
      <Pixel color="bg-coffee-dark" />
      <Pixel color="bg-coffee" />
      <Pixel color="bg-coffee" />
      <Pixel color="bg-coffee" />
      <Pixel color="bg-coffee" />
      <Pixel color="bg-coffee-dark" />
      
      <Pixel color="bg-coffee-dark" />
      <Pixel color="bg-coffee" />
      <Pixel color="bg-coffee" />
      <Pixel color="bg-coffee" />
      <Pixel color="bg-coffee" />
      <Pixel color="bg-coffee-dark" />
      
      {/* Cup handle */}
      <Pixel color="bg-coffee-dark" />
      <Pixel color="bg-coffee-dark" />
      <Pixel color="bg-coffee-dark" />
      <Pixel color="bg-coffee-dark" />
      <Pixel color="bg-transparent" />
      <Pixel color="bg-coffee-dark" />
      
      {/* Cup bottom */}
      <Pixel color="bg-coffee-dark" />
      <Pixel color="bg-coffee-dark" />
      <Pixel color="bg-coffee-dark" />
      <Pixel color="bg-coffee-dark" />
      <Pixel color="bg-coffee-dark" />
      <Pixel color="bg-coffee-dark" />
    </div>
  );

  const renderLaptop = () => (
    <div className="grid grid-cols-8 gap-0.5 w-full max-w-[160px]">
      {/* Screen */}
      <Pixel color="bg-gray-800" />
      <Pixel color="bg-gray-800" />
      <Pixel color="bg-gray-800" />
      <Pixel color="bg-gray-800" />
      <Pixel color="bg-gray-800" />
      <Pixel color="bg-gray-800" />
      <Pixel color="bg-gray-800" />
      <Pixel color="bg-gray-800" />
      
      <Pixel color="bg-gray-800" />
      <Pixel color="bg-blue-500" />
      <Pixel color="bg-blue-400" />
      <Pixel color="bg-blue-500" />
      <Pixel color="bg-blue-400" />
      <Pixel color="bg-blue-500" />
      <Pixel color="bg-blue-400" />
      <Pixel color="bg-gray-800" />
      
      <Pixel color="bg-gray-800" />
      <Pixel color="bg-blue-400" />
      <Pixel color="bg-coffee" />
      <Pixel color="bg-coffee-light" />
      <Pixel color="bg-coffee" />
      <Pixel color="bg-coffee-light" />
      <Pixel color="bg-blue-500" />
      <Pixel color="bg-gray-800" />
      
      <Pixel color="bg-gray-800" />
      <Pixel color="bg-blue-500" />
      <Pixel color="bg-coffee-light" />
      <Pixel color="bg-coffee" />
      <Pixel color="bg-coffee-light" />
      <Pixel color="bg-coffee" />
      <Pixel color="bg-blue-400" />
      <Pixel color="bg-gray-800" />
      
      <Pixel color="bg-gray-800" />
      <Pixel color="bg-blue-400" />
      <Pixel color="bg-blue-500" />
      <Pixel color="bg-blue-400" />
      <Pixel color="bg-blue-500" />
      <Pixel color="bg-blue-400" />
      <Pixel color="bg-blue-500" />
      <Pixel color="bg-gray-800" />
      
      {/* Keyboard */}
      <Pixel color="bg-gray-700" />
      <Pixel color="bg-gray-700" />
      <Pixel color="bg-gray-700" />
      <Pixel color="bg-gray-700" />
      <Pixel color="bg-gray-700" />
      <Pixel color="bg-gray-700" />
      <Pixel color="bg-gray-700" />
      <Pixel color="bg-gray-700" />
    </div>
  );

  const renderCode = () => (
    <div className="grid grid-cols-8 gap-0.5 w-full max-w-[160px]">
      <Pixel color="bg-coffee-black" />
      <Pixel color="bg-coffee-black" />
      <Pixel color="bg-coffee-black" />
      <Pixel color="bg-coffee-black" />
      <Pixel color="bg-coffee-black" />
      <Pixel color="bg-coffee-black" />
      <Pixel color="bg-coffee-black" />
      <Pixel color="bg-coffee-black" />
      
      <Pixel color="bg-coffee-black" />
      <Pixel color="bg-sage-light" />
      <Pixel color="bg-transparent" />
      <Pixel color="bg-coffee" />
      <Pixel color="bg-transparent" />
      <Pixel color="bg-coffee" />
      <Pixel color="bg-transparent" />
      <Pixel color="bg-coffee-black" />
      
      <Pixel color="bg-coffee-black" />
      <Pixel color="bg-transparent" />
      <Pixel color="bg-coffee-light" />
      <Pixel color="bg-transparent" />
      <Pixel color="bg-coffee-light" />
      <Pixel color="bg-transparent" />
      <Pixel color="bg-sage-light" />
      <Pixel color="bg-coffee-black" />
      
      <Pixel color="bg-coffee-black" />
      <Pixel color="bg-coffee" />
      <Pixel color="bg-transparent" />
      <Pixel color="bg-coffee" />
      <Pixel color="bg-transparent" />
      <Pixel color="bg-coffee" />
      <Pixel color="bg-transparent" />
      <Pixel color="bg-coffee-black" />
      
      <Pixel color="bg-coffee-black" />
      <Pixel color="bg-coffee-black" />
      <Pixel color="bg-coffee-black" />
      <Pixel color="bg-coffee-black" />
      <Pixel color="bg-coffee-black" />
      <Pixel color="bg-coffee-black" />
      <Pixel color="bg-coffee-black" />
      <Pixel color="bg-coffee-black" />
    </div>
  );

  const renderPlant = () => (
    <div className="grid grid-cols-5 gap-0.5 w-full max-w-[100px]">
      {/* Leaves */}
      <Pixel color="bg-transparent" />
      <Pixel color="bg-sage" />
      <Pixel color="bg-sage-dark" />
      <Pixel color="bg-sage" />
      <Pixel color="bg-transparent" />
      
      <Pixel color="bg-sage" />
      <Pixel color="bg-sage-dark" />
      <Pixel color="bg-sage" />
      <Pixel color="bg-sage-dark" />
      <Pixel color="bg-sage" />
      
      <Pixel color="bg-sage-dark" />
      <Pixel color="bg-sage" />
      <Pixel color="bg-sage-dark" />
      <Pixel color="bg-sage" />
      <Pixel color="bg-sage-dark" />
      
      <Pixel color="bg-transparent" />
      <Pixel color="bg-sage" />
      <Pixel color="bg-sage-dark" />
      <Pixel color="bg-sage" />
      <Pixel color="bg-transparent" />
      
      {/* Pot */}
      <Pixel color="bg-transparent" />
      <Pixel color="bg-wood" />
      <Pixel color="bg-wood" />
      <Pixel color="bg-wood" />
      <Pixel color="bg-transparent" />
      
      <Pixel color="bg-transparent" />
      <Pixel color="bg-wood-dark" />
      <Pixel color="bg-wood-dark" />
      <Pixel color="bg-wood-dark" />
      <Pixel color="bg-transparent" />
    </div>
  );

  return (
    <div className={`inline-block ${className}`}>
      {variant === 'coffee' && renderCoffee()}
      {variant === 'laptop' && renderLaptop()}
      {variant === 'code' && renderCode()}
      {variant === 'plant' && renderPlant()}
    </div>
  );
};

export default PixelArt;
