import { Dish } from './dish';

export type OrderStatus = 'RECEBIDO' | 'EM_PREPARO' | 'PRONTO' | 'ENTREGUE';

export interface OrderItem {
  dish: Dish;
  quantity: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  statusHistory: {
    status: OrderStatus;
    timestamp: Date;
  }[];
}

export interface CreateOrderData {
  items: {
    dishId: string;
    quantity: number;
  }[];
}
