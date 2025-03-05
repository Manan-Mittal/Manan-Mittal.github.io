import React, { useEffect, useState } from "react";

interface PixelProps {
  color: string;
  className?: string;
}

const Pixel: React.FC<PixelProps> = ({ color, className = "" }) => (
  <div className={`w-4 h-4 ${color} ${className}`} />
);

const PixelCoffeeWithSteam: React.FC = () => {
  const [steamFrame, setSteamFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSteamFrame((prev) => (prev + 1) % 3);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const renderSteam = () => {
    const frames = [
      [
        <Pixel key="s1" color="bg-transparent" />,
        <Pixel key="s2" color="bg-coffee-light/40" />,
        <Pixel key="s3" color="bg-transparent" />,
        <Pixel key="s4" color="bg-transparent" />,
        <Pixel key="s5" color="bg-coffee-light/40" />,
        <Pixel key="s6" color="bg-transparent" />,
      ],
      [
        <Pixel key="s1" color="bg-coffee-light/40" />,
        <Pixel key="s2" color="bg-transparent" />,
        <Pixel key="s3" color="bg-coffee-light/40" />,
        <Pixel key="s4" color="bg-coffee-light/40" />,
        <Pixel key="s5" color="bg-transparent" />,
        <Pixel key="s6" color="bg-coffee-light/40" />,
      ],
      [
        <Pixel key="s1" color="bg-transparent" />,
        <Pixel key="s2" color="bg-coffee-light/40" />,
        <Pixel key="s3" color="bg-coffee-light/40" />,
        <Pixel key="s4" color="bg-coffee-light/40" />,
        <Pixel key="s5" color="bg-coffee-light/40" />,
        <Pixel key="s6" color="bg-transparent" />,
      ],
    ];
    return frames[steamFrame];
  };

  return (
    <div className="inline-block ml-auto ma-auto"> {/* Moves the whole cup right */}
      {/* Steam animation */}
      <div className="grid grid-cols-3 gap-1">{renderSteam()}</div>

      {/* Coffee cup */}
      <div className="grid grid-cols-6 gap-1 w-full max-w-[240px]"> {/* Adjusted size */}
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
    </div>
  );
};

export default PixelCoffeeWithSteam;
