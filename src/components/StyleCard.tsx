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
        {style.imageUrl ? (
          <div className="relative w-full aspect-square mb-4 rounded-xl overflow-hidden group-hover:shadow-md transition-shadow">
            <Image
              src={style.imageUrl}
              alt={style.name}
              fill
              className="object-cover transform transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
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

