import { StyleDefinition } from '@/config/styles';
import Image from 'next/image';

interface StyleCardProps {
  style: StyleDefinition;
  selected: boolean;
  onSelect: (id: string) => void;
}

export const StyleCard = ({ style, selected, onSelect }: StyleCardProps) => {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl cursor-pointer transform transition-all duration-300 ease-in-out ${
        selected
          ? 'ring-4 ring-primary ring-offset-4 ring-offset-background scale-[1.02] shadow-xl'
          : 'hover:shadow-xl hover:-translate-y-1'
      }`}
      onClick={() => onSelect(style.id)}
    >
      {/* Main content container with soft blur background */}
      <div className="relative z-10 h-full bg-text/95 backdrop-blur-sm p-5">
        {/* Image container with Pinterest-style aspect ratio */}
        {style.imageUrl ? (
          <div className="relative w-full aspect-square mb-4 rounded-xl overflow-hidden group-hover:shadow-md transition-shadow">
            <Image
              src={style.imageUrl}
              alt={style.name}
              fill
              className="object-cover transform transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        ) : (
          <div className="relative w-full aspect-square mb-4 rounded-xl overflow-hidden bg-neutral/30 group-hover:bg-neutral/40 transition-colors">
            <div className="absolute inset-0 bg-coffee-pattern opacity-10" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-satisfy text-3xl text-primary transform transition-transform duration-300 group-hover:scale-105">{style.name}</span>
            </div>
          </div>
        )}
        {/* Content section with improved typography and spacing */}
        <div className="space-y-3">
          <h3 className="font-satisfy text-2xl text-secondary tracking-wide group-hover:text-primary transition-colors">
            {style.name}
          </h3>
          <p className="text-sm text-accent/80 leading-relaxed font-medium line-clamp-2">
            {style.description}
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {style.keywords.map((keyword) => (
              <span
                key={keyword}
                className="text-xs bg-primary/10 px-3 py-1.5 rounded-full text-primary font-satisfy tracking-wider
                         transform transition-all duration-300 hover:bg-primary/20 hover:-translate-y-0.5"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Selection indicator */}
      {selected && (
        <div className="absolute top-3 right-3 z-20 bg-primary text-text rounded-full p-2 shadow-lg">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
          </svg>
        </div>
      )}
    </div>
  );
};
