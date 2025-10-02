import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Dish, DishFormData } from '@/types/dish';
import { Order, CreateOrderData, OrderStatus } from '@/types/order';
import { toast } from '@/hooks/use-toast';

interface RestaurantState {
  dishes: Dish[];
  orders: Order[];
}

type RestaurantAction =
  | { type: 'ADD_DISH'; payload: Dish }
  | { type: 'UPDATE_DISH'; payload: Dish }
  | { type: 'DELETE_DISH'; payload: string }
  | { type: 'ADD_ORDER'; payload: Order }
  | { type: 'UPDATE_ORDER_STATUS'; payload: { orderId: string; status: OrderStatus } };

interface RestaurantContextType {
  state: RestaurantState;
  addDish: (dishData: DishFormData) => void;
  updateDish: (id: string, dishData: DishFormData) => void;
  deleteDish: (id: string) => void;
  createOrder: (orderData: CreateOrderData) => void;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  getDishById: (id: string) => Dish | undefined;
  getOrderById: (id: string) => Order | undefined;
}

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

const initialState: RestaurantState = {
  dishes: [
    {
      id: '1',
      name: 'Pizza Margherita',
      description: 'Pizza tradicional com molho de tomate, mussarela e manjericão fresco',
      price: 45.90,
      category: 'prato_principal',
      createdAt: new Date(),
      isActive: true,
    },
    {
      id: '2',
      name: 'Refrigerante Lata',
      description: 'Coca-Cola, Guaraná ou Sprite - 350ml',
      price: 6.50,
      category: 'bebida',
      createdAt: new Date(),
      isActive: true,
    },
    {
      id: '3',
      name: 'Tiramisu',
      description: 'Sobremesa italiana com café, mascarpone e cacau',
      price: 18.90,
      category: 'sobremesa',
      createdAt: new Date(),
      isActive: true,
    },
    {
      id: '4',
      name: 'Bruschetta',
      description: 'Pão italiano tostado com tomate, alho e manjericão',
      price: 22.50,
      category: 'entrada',
      createdAt: new Date(),
      isActive: true,
    },
  ],
  orders: [],
};

function restaurantReducer(state: RestaurantState, action: RestaurantAction): RestaurantState {
  switch (action.type) {
    case 'ADD_DISH':
      return {
        ...state,
        dishes: [...state.dishes, action.payload],
      };
    case 'UPDATE_DISH':
      return {
        ...state,
        dishes: state.dishes.map((dish) =>
          dish.id === action.payload.id ? action.payload : dish
        ),
      };
    case 'DELETE_DISH':
      return {
        ...state,
        dishes: state.dishes.map((dish) =>
          dish.id === action.payload ? { ...dish, isActive: false } : dish
        ),
      };
    case 'ADD_ORDER':
      return {
        ...state,
        orders: [...state.orders, action.payload],
      };
    case 'UPDATE_ORDER_STATUS':
      return {
        ...state,
        orders: state.orders.map((order) => {
          if (order.id === action.payload.orderId) {
            return {
              ...order,
              status: action.payload.status,
              updatedAt: new Date(),
              statusHistory: [
                ...order.statusHistory,
                {
                  status: action.payload.status,
                  timestamp: new Date(),
                },
              ],
            };
          }
          return order;
        }),
      };
    default:
      return state;
  }
}

export function RestaurantProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(restaurantReducer, initialState);

  const addDish = (dishData: DishFormData) => {
    const newDish: Dish = {
      id: Date.now().toString(),
      ...dishData,
      createdAt: new Date(),
      isActive: true,
    };
    dispatch({ type: 'ADD_DISH', payload: newDish });
    toast({
      title: 'Prato adicionado',
      description: `${newDish.name} foi adicionado ao cardápio.`,
    });
  };

  const updateDish = (id: string, dishData: DishFormData) => {
    const existingDish = state.dishes.find((d) => d.id === id);
    if (!existingDish) return;

    const updatedDish: Dish = {
      ...existingDish,
      ...dishData,
    };
    dispatch({ type: 'UPDATE_DISH', payload: updatedDish });
    toast({
      title: 'Prato atualizado',
      description: `${updatedDish.name} foi atualizado com sucesso.`,
    });
  };

  const deleteDish = (id: string) => {
    const dish = state.dishes.find((d) => d.id === id);
    if (!dish) return;

    // Check if dish is in active orders
    const hasActiveOrders = state.orders.some(
      (order) =>
        order.status !== 'ENTREGUE' &&
        order.items.some((item) => item.dish.id === id)
    );

    if (hasActiveOrders) {
      toast({
        title: 'Não é possível excluir',
        description: 'Este prato está vinculado a pedidos ativos.',
        variant: 'destructive',
      });
      return;
    }

    dispatch({ type: 'DELETE_DISH', payload: id });
    toast({
      title: 'Prato removido',
      description: `${dish.name} foi removido do cardápio.`,
    });
  };

  const createOrder = (orderData: CreateOrderData) => {
    const orderItems = orderData.items.map((item) => {
      const dish = state.dishes.find((d) => d.id === item.dishId);
      if (!dish) throw new Error('Prato não encontrado');
      return {
        dish,
        quantity: item.quantity,
      };
    });

    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.dish.price * item.quantity,
      0
    );

    const newOrder: Order = {
      id: Date.now().toString(),
      items: orderItems,
      totalAmount,
      status: 'RECEBIDO',
      createdAt: new Date(),
      updatedAt: new Date(),
      statusHistory: [
        {
          status: 'RECEBIDO',
          timestamp: new Date(),
        },
      ],
    };

    dispatch({ type: 'ADD_ORDER', payload: newOrder });
    toast({
      title: 'Pedido criado',
      description: `Pedido #${newOrder.id} foi criado com sucesso.`,
    });
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    const order = state.orders.find((o) => o.id === orderId);
    if (!order) return;

    const statusFlow: OrderStatus[] = ['RECEBIDO', 'EM_PREPARO', 'PRONTO', 'ENTREGUE'];
    const currentIndex = statusFlow.indexOf(order.status);
    const newIndex = statusFlow.indexOf(newStatus);

    if (newIndex !== currentIndex + 1) {
      toast({
        title: 'Status inválido',
        description: 'Não é possível pular etapas no fluxo de status.',
        variant: 'destructive',
      });
      return;
    }

    dispatch({ type: 'UPDATE_ORDER_STATUS', payload: { orderId, status: newStatus } });
    toast({
      title: 'Status atualizado',
      description: `Pedido #${orderId} agora está ${newStatus}.`,
    });
  };

  const getDishById = (id: string) => state.dishes.find((d) => d.id === id);
  const getOrderById = (id: string) => state.orders.find((o) => o.id === id);

  return (
    <RestaurantContext.Provider
      value={{
        state,
        addDish,
        updateDish,
        deleteDish,
        createOrder,
        updateOrderStatus,
        getDishById,
        getOrderById,
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurant() {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within RestaurantProvider');
  }
  return context;
}
