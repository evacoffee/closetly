import Image from 'next/image';

interface AppIconProps {
  className?: string;
  width?: number;
  height?: number;
}

export function AppIcon({ className = "", width = 40, height = 40 }: AppIconProps) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <div className="relative w-full h-full">
        <Image
          src="/images/icon.png"
          alt="Closetly App Icon"
          width={width}
          height={height}
          priority
          className="object-contain w-full h-full"
          style={{
            maxWidth: '100%',
            height: 'auto',
          }}
        />
      </div>
    </div>
  );
}
