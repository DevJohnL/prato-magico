export type DishCategory = 'bebida' | 'prato_principal' | 'sobremesa' | 'entrada';

export interface Dish {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: DishCategory;
  image?: string;
  createdAt: Date;
  isActive: boolean;
}

export interface DishFormData {
  name: string;
  description?: string;
  price: number;
  category: DishCategory;
}
