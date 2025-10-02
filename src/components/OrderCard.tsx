import { Order } from '@/types/order';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface OrderCardProps {
  order: Order;
  onUpdateStatus?: (orderId: string) => void;
}

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

export function OrderCard({ order, onUpdateStatus }: OrderCardProps) {
  const navigate = useNavigate();
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

  return (
    <Card className="p-5 space-y-4 card-hover">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-lg">Pedido #{order.id}</h3>
            <Badge className={`${config.color} status-badge`}>
              {config.label}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {formatDate(order.createdAt)}
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate(`/orders/${order.id}`)}
          className="shrink-0"
        >
          <Eye className="h-4 w-4 mr-1" />
          Detalhes
        </Button>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Itens:</p>
        <ul className="space-y-1">
          {order.items.slice(0, 3).map((item, idx) => (
            <li key={idx} className="text-sm text-muted-foreground flex justify-between">
              <span>
                {item.quantity}x {item.dish.name}
              </span>
              <span>R$ {(item.dish.price * item.quantity).toFixed(2)}</span>
            </li>
          ))}
          {order.items.length > 3 && (
            <li className="text-sm text-muted-foreground italic">
              +{order.items.length - 3} item(s)...
            </li>
          )}
        </ul>
      </div>

      <div className="flex items-center justify-between pt-3 border-t">
        <div>
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="text-2xl font-bold text-primary">
            R$ {order.totalAmount.toFixed(2)}
          </p>
        </div>
        {config.next && onUpdateStatus && (
          <Button
            onClick={() => onUpdateStatus(order.id)}
            className="btn-primary"
          >
            {config.nextLabel}
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </Card>
  );
}
