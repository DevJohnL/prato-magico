import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, Clock } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRestaurant } from '@/contexts/RestaurantContext';
import { OrderStatus } from '@/types/order';

const statusConfig = {
  RECEBIDO: {
    label: 'Recebido',
    color: 'bg-accent/10 text-accent border-accent/20',
    next: 'EM_PREPARO',
    nextLabel: 'Iniciar Preparo',
  },
  EM_PREPARO: {
    label: 'Em Preparo',
    color: 'bg-warning/10 text-warning border-warning/20',
    next: 'PRONTO',
    nextLabel: 'Marcar como Pronto',
  },
  PRONTO: {
    label: 'Pronto',
    color: 'bg-secondary/10 text-secondary border-secondary/20',
    next: 'ENTREGUE',
    nextLabel: 'Marcar como Entregue',
  },
  ENTREGUE: {
    label: 'Entregue',
    color: 'bg-success/10 text-success border-success/20',
    next: null,
    nextLabel: '',
  },
};

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getOrderById, updateOrderStatus } = useRestaurant();

  const order = id ? getOrderById(id) : undefined;

  if (!order) {
    return (
      <Layout>
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-2">Pedido não encontrado</h2>
          <p className="text-muted-foreground mb-4">
            O pedido solicitado não existe ou foi removido
          </p>
          <Button onClick={() => navigate('/orders')}>
            Voltar para Pedidos
          </Button>
        </div>
      </Layout>
    );
  }

  const config = statusConfig[order.status];

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleUpdateStatus = () => {
    if (config.next) {
      updateOrderStatus(order.id, config.next);
    }
  };

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => navigate('/orders')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">Pedido #{order.id}</h1>
            <p className="text-muted-foreground">{formatDate(order.createdAt)}</p>
          </div>
          <Badge className={`${config.color} status-badge text-base px-4 py-2`}>
            {config.label}
          </Badge>
        </div>

        {/* Order Items */}
        <Card className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">Itens do Pedido</h2>
          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
              >
                <div className="flex-1">
                  <p className="font-medium">{item.dish.name}</p>
                  {item.dish.description && (
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {item.dish.description}
                    </p>
                  )}
                </div>
                <div className="text-right ml-4">
                  <p className="text-sm text-muted-foreground">
                    {item.quantity}x R$ {item.dish.price.toFixed(2)}
                  </p>
                  <p className="font-semibold">
                    R$ {(item.dish.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="pt-4 border-t flex justify-between items-center">
            <span className="text-lg font-medium">Total</span>
            <span className="text-3xl font-bold text-primary">
              R$ {order.totalAmount.toFixed(2)}
            </span>
          </div>
        </Card>

        {/* Status History */}
        <Card className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-xl font-semibold">Histórico de Status</h2>
          </div>
          <div className="space-y-3">
            {order.statusHistory.map((history, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 p-3 bg-muted/50 rounded-lg"
              >
                <Badge className={statusConfig[history.status].color}>
                  {statusConfig[history.status].label}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {formatDate(history.timestamp)}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Action Button */}
        {config.next && (
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg mb-1">Próxima Etapa</h3>
                <p className="text-sm text-muted-foreground">
                  Avançar pedido para: {statusConfig[config.next].label}
                </p>
              </div>
              <Button onClick={handleUpdateStatus} size="lg" className="btn-primary">
                {config.nextLabel}
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
}
