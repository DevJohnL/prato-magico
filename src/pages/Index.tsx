import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { UtensilsCrossed, ShoppingBag, ChefHat, TrendingUp } from 'lucide-react';
import { useRestaurant } from '@/contexts/RestaurantContext';

export default function Index() {
  const navigate = useNavigate();
  const { state } = useRestaurant();

  const activeOrders = state.orders.filter((o) => o.status !== 'ENTREGUE');
  const totalRevenue = state.orders
    .filter((o) => o.status === 'ENTREGUE')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const stats = [
    {
      icon: UtensilsCrossed,
      label: 'Pratos no Cardápio',
      value: state.dishes.filter((d) => d.isActive).length,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      icon: ShoppingBag,
      label: 'Pedidos Ativos',
      value: activeOrders.length,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      icon: ChefHat,
      label: 'Em Preparo',
      value: state.orders.filter((o) => o.status === 'EM_PREPARO').length,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      icon: TrendingUp,
      label: 'Receita Total',
      value: `R$ ${totalRevenue.toFixed(2)}`,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
  ];

  return (
    <Layout>
      <div className="space-y-8 animate-fade-in">
        {/* Hero Section */}
        <section className="text-center space-y-4 py-12">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-slide-up">
            Sistema de Gerenciamento
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Automatize pedidos, reduza erros e otimize o atendimento do seu restaurante
          </p>
          <div className="flex flex-wrap gap-4 justify-center pt-4">
            <Button
              size="lg"
              onClick={() => navigate('/menu')}
              className="btn-primary text-lg px-8"
            >
              <UtensilsCrossed className="mr-2 h-5 w-5" />
              Ver Cardápio
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/orders/new')}
              className="text-lg px-8 border-2"
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              Novo Pedido
            </Button>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="p-6 card-hover"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground truncate">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </section>

        {/* Features Section */}
        <section className="grid md:grid-cols-3 gap-6 pt-8">
          <Card className="p-6 space-y-3 text-center card-hover">
            <div className="inline-flex p-3 rounded-full bg-primary/10">
              <UtensilsCrossed className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">Gestão de Cardápio</h3>
            <p className="text-muted-foreground">
              Cadastre e organize pratos com categorias, preços e descrições detalhadas
            </p>
          </Card>

          <Card className="p-6 space-y-3 text-center card-hover">
            <div className="inline-flex p-3 rounded-full bg-secondary/10">
              <ShoppingBag className="h-8 w-8 text-secondary" />
            </div>
            <h3 className="text-xl font-semibold">Controle de Pedidos</h3>
            <p className="text-muted-foreground">
              Acompanhe cada pedido desde o recebimento até a entrega final
            </p>
          </Card>

          <Card className="p-6 space-y-3 text-center card-hover">
            <div className="inline-flex p-3 rounded-full bg-accent/10">
              <ChefHat className="h-8 w-8 text-accent" />
            </div>
            <h3 className="text-xl font-semibold">Fluxo Automatizado</h3>
            <p className="text-muted-foreground">
              Status automáticos garantem controle e evitam erros operacionais
            </p>
          </Card>
        </section>

        {/* Recent Orders */}
        {activeOrders.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Pedidos Ativos</h2>
              <Button variant="outline" onClick={() => navigate('/orders')}>
                Ver Todos
              </Button>
            </div>
            <div className="grid gap-4">
              {activeOrders.slice(0, 3).map((order) => (
                <Card key={order.id} className="p-4 flex items-center justify-between card-hover">
                  <div>
                    <p className="font-semibold">Pedido #{order.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.items.length} item(s) • R$ {order.totalAmount.toFixed(2)}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/orders/${order.id}`)}
                  >
                    Ver Detalhes
                  </Button>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}
