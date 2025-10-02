import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Plus, Minus, ShoppingCart, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CartItem {
  dishId: string;
  quantity: number;
}

export default function NewOrder() {
  const navigate = useNavigate();
  const { state, createOrder } = useRestaurant();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const activeDishes = state.dishes.filter((d) => d.isActive);

  const filteredDishes = activeDishes.filter((dish) => {
    const matchesSearch = dish.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || dish.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getCartItemQuantity = (dishId: string) => {
    return cart.find((item) => item.dishId === dishId)?.quantity || 0;
  };

  const addToCart = (dishId: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.dishId === dishId);
      if (existing) {
        return prev.map((item) =>
          item.dishId === dishId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { dishId, quantity: 1 }];
    });
  };

  const removeFromCart = (dishId: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.dishId === dishId);
      if (existing && existing.quantity > 1) {
        return prev.map((item) =>
          item.dishId === dishId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      }
      return prev.filter((item) => item.dishId !== dishId);
    });
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => {
      const dish = state.dishes.find((d) => d.id === item.dishId);
      return sum + (dish?.price || 0) * item.quantity;
    }, 0);
  };

  const handleCreateOrder = () => {
    if (cart.length === 0) {
      alert('Adicione pelo menos um item ao pedido');
      return;
    }

    createOrder({ items: cart });
    navigate('/orders');
  };

  const categoryLabels: Record<string, string> = {
    bebida: 'Bebida',
    prato_principal: 'Prato Principal',
    sobremesa: 'Sobremesa',
    entrada: 'Entrada',
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/orders')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Novo Pedido</h1>
            <p className="text-muted-foreground">Selecione os pratos para o pedido</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Dishes Selection */}
          <div className="lg:col-span-2 space-y-4">
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
                  <SelectItem value="all">Todas</SelectItem>
                  <SelectItem value="bebida">Bebidas</SelectItem>
                  <SelectItem value="prato_principal">Pratos Principais</SelectItem>
                  <SelectItem value="sobremesa">Sobremesas</SelectItem>
                  <SelectItem value="entrada">Entradas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4">
              {filteredDishes.map((dish) => {
                const quantity = getCartItemQuantity(dish.id);
                return (
                  <Card key={dish.id} className="p-4 card-hover">
                    <div className="flex items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold truncate">{dish.name}</h3>
                          <Badge variant="outline" className="shrink-0">
                            {categoryLabels[dish.category]}
                          </Badge>
                        </div>
                        {dish.description && (
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {dish.description}
                          </p>
                        )}
                        <p className="text-lg font-bold text-primary mt-2">
                          R$ {dish.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {quantity > 0 ? (
                          <>
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => removeFromCart(dish.id)}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center font-semibold">
                              {quantity}
                            </span>
                            <Button
                              size="icon"
                              className="btn-primary"
                              onClick={() => addToCart(dish.id)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <Button
                            className="btn-primary"
                            onClick={() => addToCart(dish.id)}
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Adicionar
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24 space-y-4">
              <div className="flex items-center gap-2 pb-4 border-b">
                <ShoppingCart className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Resumo do Pedido</h2>
              </div>

              {cart.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Nenhum item adicionado
                </p>
              ) : (
                <>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {cart.map((item) => {
                      const dish = state.dishes.find((d) => d.id === item.dishId);
                      if (!dish) return null;
                      return (
                        <div
                          key={item.dishId}
                          className="flex justify-between items-start gap-2 p-2 bg-muted/50 rounded"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate">{dish.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {item.quantity}x R$ {dish.price.toFixed(2)}
                            </p>
                          </div>
                          <p className="font-semibold shrink-0">
                            R$ {(dish.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-4 border-t space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Subtotal</span>
                      <span className="font-semibold">
                        R$ {calculateTotal().toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-lg">
                      <span className="font-semibold">Total</span>
                      <span className="text-2xl font-bold text-primary">
                        R$ {calculateTotal().toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <Button
                    className="w-full btn-primary"
                    size="lg"
                    onClick={handleCreateOrder}
                  >
                    Confirmar Pedido
                  </Button>
                </>
              )}
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
