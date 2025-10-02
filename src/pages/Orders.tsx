import { useState } from 'react';
import { Layout } from '@/components/Layout';
import { OrderCard } from '@/components/OrderCard';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { OrderStatus } from '@/types/order';

export default function Orders() {
  const navigate = useNavigate();
  const { state, updateOrderStatus } = useRestaurant();
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredOrders = state.orders.filter((order) => {
    if (statusFilter === 'all') return true;
    return order.status === statusFilter;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const handleUpdateStatus = (orderId: string) => {
    const order = state.orders.find((o) => o.id === orderId);
    if (!order) return;

    const statusFlow: OrderStatus[] = ['RECEBIDO', 'EM_PREPARO', 'PRONTO', 'ENTREGUE'];
    const currentIndex = statusFlow.indexOf(order.status);
    if (currentIndex < statusFlow.length - 1) {
      updateOrderStatus(orderId, statusFlow[currentIndex + 1]);
    }
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Pedidos</h1>
            <p className="text-muted-foreground">
              Gerencie todos os pedidos do restaurante
            </p>
          </div>
          <Button
            onClick={() => navigate('/orders/new')}
            className="btn-primary shrink-0"
            size="lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            Novo Pedido
          </Button>
        </div>

        {/* Filter */}
        <div className="flex gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-64 input-focus">
              <SelectValue placeholder="Filtrar por status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="RECEBIDO">Recebido</SelectItem>
              <SelectItem value="EM_PREPARO">Em Preparo</SelectItem>
              <SelectItem value="PRONTO">Pronto</SelectItem>
              <SelectItem value="ENTREGUE">Entregue</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Orders List */}
        {sortedOrders.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              {statusFilter !== 'all'
                ? 'Nenhum pedido encontrado com este status'
                : 'Nenhum pedido cadastrado ainda'}
            </p>
            {statusFilter === 'all' && (
              <Button
                onClick={() => navigate('/orders/new')}
                variant="outline"
                className="mt-4"
              >
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Pedido
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sortedOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onUpdateStatus={handleUpdateStatus}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
