interface AestheticBackgroundProps {
  bgImage?: string;
}

import bgDefault from '../assets/dashboard.jpg';

const AestheticBackground: React.FC<AestheticBackgroundProps> = ({ bgImage }) => {
  const image = bgImage ?? bgDefault;
  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden -z-10"
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-black/30" />
    </div>
  );
};

export default AestheticBackground;
