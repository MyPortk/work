import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CategoryCardProps {
  name: string;
  image: string;
  totalCount: number;
  availableCount: number;
  subTypes: readonly string[];
  onClick?: () => void;
}

export default function CategoryCard({
  name,
  image,
  totalCount,
  availableCount,
  subTypes,
  onClick
}: CategoryCardProps) {
  return (
    <Card 
      className="overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      onClick={onClick}
      data-testid={`card-category-${name.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div 
        className="h-[180px] bg-cover bg-center relative"
        style={{ backgroundImage: `url(${image})` }}
      >
        <Badge 
          className="absolute top-3 right-3 bg-green-600 hover:bg-green-700"
          data-testid={`badge-available-${name.toLowerCase().replace(/\s+/g, '-')}`}
        >
          {availableCount} Available
        </Badge>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold mb-2 text-card-foreground" data-testid={`text-category-name-${name.toLowerCase().replace(/\s+/g, '-')}`}>
          {name}
        </h3>
        <p className="text-sm text-muted-foreground mb-3" data-testid={`text-category-count-${name.toLowerCase().replace(/\s+/g, '-')}`}>
          {totalCount} total items
        </p>
        <div className="flex flex-wrap gap-1.5">
          {subTypes.map((subType, index) => (
            <Badge 
              key={index} 
              variant="secondary"
              className="bg-gradient-to-r from-[#667eea] to-[#764ba2] text-white text-[11px] px-2 py-0.5"
              data-testid={`badge-subtype-${subType.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {subType}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  );
}
