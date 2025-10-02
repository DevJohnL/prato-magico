import { Dish } from '@/types/dish';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DishCardProps {
  dish: Dish;
  onEdit: (dish: Dish) => void;
  onDelete: (id: string) => void;
}

const categoryLabels: Record<string, string> = {
  bebida: 'Bebida',
  prato_principal: 'Prato Principal',
  sobremesa: 'Sobremesa',
  entrada: 'Entrada',
};

const categoryColors: Record<string, string> = {
  bebida: 'bg-accent/10 text-accent border-accent/20',
  prato_principal: 'bg-primary/10 text-primary border-primary/20',
  sobremesa: 'bg-secondary/10 text-secondary border-secondary/20',
  entrada: 'bg-warning/10 text-warning border-warning/20',
};

export function DishCard({ dish, onEdit, onDelete }: DishCardProps) {
  return (
    <Card className="overflow-hidden card-hover group">
      <div className="aspect-video bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl opacity-20">🍽️</span>
        </div>
      </div>

      <div className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">{dish.name}</h3>
            {dish.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                {dish.description}
              </p>
            )}
          </div>
          <Badge className={`shrink-0 ${categoryColors[dish.category]}`}>
            {categoryLabels[dish.category]}
          </Badge>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <span className="text-2xl font-bold text-primary">
            R$ {dish.price.toFixed(2)}
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(dish)}
              className="hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDelete(dish.id)}
              className="hover:bg-destructive hover:text-destructive-foreground transition-all duration-300"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
