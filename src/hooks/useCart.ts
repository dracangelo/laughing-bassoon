"use client";

import { useState } from "react";

export type CartItem = {
  turboId: number;
  sku: string;
  quantity: number;
  unitPrice: number;
};

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  function addItem(item: CartItem) {
    setItems((current) => [...current, item]);
  }

  return {
    items,
    addItem,
    total: items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0)
  };
}
