import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { DishCard } from '@/components/DishCard';
import { DishFormDialog } from '@/components/DishFormDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search } from 'lucide-react';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { Dish, DishCategory } from '@/types/dish';

export default function Menu() {
  const { state, addDish, updateDish, deleteDish } = useRestaurant();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const activeDishes = state.dishes.filter((d) => d.isActive);

  const filteredDishes = activeDishes.filter((dish) => {
    const matchesSearch = dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dish.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || dish.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleEdit = (dish: Dish) => {
    setEditingDish(dish);
    setDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja realmente remover este prato do cardápio?')) {
      deleteDish(id);
    }
  };

  const handleSubmit = (data: any) => {
    if (editingDish) {
      updateDish(editingDish.id, data);
    } else {
      addDish(data);
    }
    setEditingDish(undefined);
  };

  const handleDialogClose = (open: boolean) => {
    setDialogOpen(open);
    if (!open) {
      setEditingDish(undefined);
    }
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Cardápio</h1>
            <p className="text-muted-foreground">
              Gerencie os pratos do seu restaurante
            </p>
          </div>
          <Button
            onClick={() => setDialogOpen(true)}
            className="btn-primary shrink-0"
            size="lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            Novo Prato
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar pratos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 input-focus"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-48 input-focus">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas Categorias</SelectItem>
              <SelectItem value="bebida">Bebidas</SelectItem>
              <SelectItem value="prato_principal">Pratos Principais</SelectItem>
              <SelectItem value="sobremesa">Sobremesas</SelectItem>
              <SelectItem value="entrada">Entradas</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Dishes Grid */}
        {filteredDishes.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              {searchTerm || categoryFilter !== 'all'
                ? 'Nenhum prato encontrado com os filtros aplicados'
                : 'Nenhum prato cadastrado ainda'}
            </p>
            {!searchTerm && categoryFilter === 'all' && (
              <Button
                onClick={() => setDialogOpen(true)}
                variant="outline"
                className="mt-4"
              >
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Primeiro Prato
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDishes.map((dish) => (
              <DishCard
                key={dish.id}
                dish={dish}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}

        <DishFormDialog
          open={dialogOpen}
          onOpenChange={handleDialogClose}
          onSubmit={handleSubmit}
          dish={editingDish}
        />
      </div>
    </Layout>
  );
}
