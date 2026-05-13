import { getSessionUser } from "@/lib/auth";
import { getOrCreateSessionId } from "@/lib/session";
import { nextId, readAppData, updateAppData, type StoredCart, type StoredCartItem } from "@/lib/persistence";

function createCart(id: string, userId?: number): StoredCart {
  return {
    id,
    userId,
    sessionId: id,
    items: [],
    updatedAt: new Date().toISOString()
  };
}

export async function getCurrentCart() {
  const sessionId = getOrCreateSessionId();
  const user = getSessionUser();
  const data = await readAppData();
  let cart = data.carts.find((entry) => entry.sessionId === sessionId || (user && entry.userId === user.id));
  if (!cart) {
    cart = createCart(sessionId, user?.id);
    await updateAppData((draft) => {
      draft.carts.push(cart as StoredCart);
    });
  }
  return cart;
}

export async function addCartItem(turboId: number, quantity: number) {
  return updateAppData((data) => {
    const sessionId = getOrCreateSessionId();
    const user = getSessionUser();
    let cart = data.carts.find((entry) => entry.sessionId === sessionId || (user && entry.userId === user.id));
    if (!cart) {
      cart = createCart(sessionId, user?.id);
      data.carts.push(cart);
    }
    const item = cart.items.find((entry) => entry.turboId === turboId);
    if (item) item.quantity += quantity;
    else cart.items.push({ turboId, quantity });
    cart.updatedAt = new Date().toISOString();
    return cart;
  });
}

export async function updateCartItem(turboId: number, quantity: number) {
  return updateAppData((data) => {
    const sessionId = getOrCreateSessionId();
    const user = getSessionUser();
    const cart = data.carts.find((entry) => entry.sessionId === sessionId || (user && entry.userId === user.id));
    if (!cart) return null;
    cart.items = cart.items
      .map((item) => (item.turboId === turboId ? { ...item, quantity } : item))
      .filter((item) => item.quantity > 0);
    cart.updatedAt = new Date().toISOString();
    return cart;
  });
}

export async function clearCart() {
  return updateAppData((data) => {
    const sessionId = getOrCreateSessionId();
    const user = getSessionUser();
    const cart = data.carts.find((entry) => entry.sessionId === sessionId || (user && entry.userId === user.id));
    if (cart) {
      cart.items = [];
      cart.updatedAt = new Date().toISOString();
    }
    return cart || null;
  });
}

export async function buildCartView() {
  const data = await readAppData();
  const cart = await getCurrentCart();
  const items = cart.items.map((item) => {
    const turbo = data.turbos.find((entry) => entry.id === item.turboId);
    return turbo
      ? {
          turboId: turbo.id,
          sku: turbo.sku,
          name: `${turbo.make} ${turbo.model} ${turbo.engine}`,
          quantity: item.quantity,
          unitPrice: turbo.price,
          lineTotal: turbo.price * item.quantity
        }
      : null;
  }).filter(Boolean);
  const total = items.reduce((sum, item) => sum + (item?.lineTotal || 0), 0);
  return { cart, items, total };
}
