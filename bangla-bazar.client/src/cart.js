const CART_ITEMS_KEY = 'cartItems';
const CART_COUNT_KEY = 'cartCount';
const CART_UPDATED_EVENT = 'bb-cart-updated';
const CART_API_BASE_URL = 'http://localhost:5272/api/cart';

function getCurrentUserId() {
    try {
        const user = JSON.parse(localStorage.getItem('bb_user'));
        const parsedUserId = Number(user?.id);
        return Number.isFinite(parsedUserId) && parsedUserId > 0 ? parsedUserId : null;
    } catch {
        return null;
    }
}

async function upsertCartItemOnServer(productId, quantity) {
    const userId = getCurrentUserId();
    if (!userId) return;

    const normalizedProductId = Number(productId);
    const normalizedQuantity = Math.max(1, Number(quantity) || 1);
    if (!Number.isFinite(normalizedProductId) || normalizedProductId <= 0) return;

    try {
        const listResponse = await fetch(CART_API_BASE_URL);
        if (!listResponse.ok) throw new Error('Failed to fetch cart items');

        const cartItems = await listResponse.json();
        const normalizedItems = Array.isArray(cartItems) ? cartItems : [];
        const existingItem = normalizedItems.find((item) =>
            Number(item?.userId) === userId && Number(item?.productId) === normalizedProductId
        );

        if (existingItem) {
            const updatedItem = {
                ...existingItem,
                userId,
                productId: normalizedProductId,
                quantity: (Number(existingItem.quantity) || 0) + normalizedQuantity
            };

            const updateResponse = await fetch(`${CART_API_BASE_URL}/${existingItem.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedItem)
            });

            if (!updateResponse.ok) throw new Error('Failed to update cart item');
            return;
        }

        const createResponse = await fetch(CART_API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId,
                productId: normalizedProductId,
                quantity: normalizedQuantity
            })
        });

        if (!createResponse.ok) throw new Error('Failed to create cart item');
    } catch (error) {
        console.error('Server cart sync failed:', error);
    }
}

async function findServerCartItem(productId, userId) {
    const normalizedProductId = Number(productId);
    if (!Number.isFinite(normalizedProductId) || normalizedProductId <= 0) return null;

    const listResponse = await fetch(CART_API_BASE_URL);
    if (!listResponse.ok) throw new Error('Failed to fetch cart items');

    const cartItems = await listResponse.json();
    const normalizedItems = Array.isArray(cartItems) ? cartItems : [];

    return normalizedItems.find((item) =>
        Number(item?.userId) === userId && Number(item?.productId) === normalizedProductId
    ) || null;
}

export function readCartItems() {
    try {
        const raw = localStorage.getItem(CART_ITEMS_KEY);
        const items = raw ? JSON.parse(raw) : [];
        return Array.isArray(items) ? items : [];
    } catch {
        return [];
    }
}

export function getCartCount(items = readCartItems()) {
    return items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
}

export function persistCartItems(items) {
    localStorage.setItem(CART_ITEMS_KEY, JSON.stringify(items));
    localStorage.setItem(CART_COUNT_KEY, String(getCartCount(items)));
    window.dispatchEvent(new Event(CART_UPDATED_EVENT));
}

export function addProductToCart(product, quantity = 1) {
    const cartItems = readCartItems();
    const normalizedQuantity = Math.max(1, Number(quantity) || 1);
    const existingItem = cartItems.find((item) => item.id === product.id);

    // Keep UI instant by updating local cart immediately.
    // Server sync runs in parallel for database persistence.
    upsertCartItemOnServer(product.id, normalizedQuantity);

    if (existingItem) {
        existingItem.quantity += normalizedQuantity;
    } else {
        cartItems.push({
            id: product.id,
            name: product.name,
            price: product.price,
            brand: product.brand,
            weight: product.weight,
            image: product.image,
            quantity: normalizedQuantity
        });
    }

    persistCartItems(cartItems);
    return cartItems;
}

export async function removeProductFromCart(productId) {
    const userId = getCurrentUserId();
    if (!userId) return;

    try {
        const existingItem = await findServerCartItem(productId, userId);
        if (!existingItem) return;

        const deleteResponse = await fetch(`${CART_API_BASE_URL}/${existingItem.id}`, {
            method: 'DELETE'
        });

        if (!deleteResponse.ok) throw new Error('Failed to delete cart item');
    } catch (error) {
        console.error('Server cart remove failed:', error);
    }
}

export async function setProductQuantityInCart(productId, quantity) {
    const userId = getCurrentUserId();
    if (!userId) return;

    const normalizedProductId = Number(productId);
    const normalizedQuantity = Math.max(0, Number(quantity) || 0);
    if (!Number.isFinite(normalizedProductId) || normalizedProductId <= 0) return;

    if (normalizedQuantity <= 0) {
        await removeProductFromCart(normalizedProductId);
        return;
    }

    try {
        const existingItem = await findServerCartItem(normalizedProductId, userId);

        if (existingItem) {
            const updateResponse = await fetch(`${CART_API_BASE_URL}/${existingItem.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...existingItem,
                    userId,
                    productId: normalizedProductId,
                    quantity: normalizedQuantity
                })
            });

            if (!updateResponse.ok) throw new Error('Failed to update cart quantity');
            return;
        }

        const createResponse = await fetch(CART_API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userId,
                productId: normalizedProductId,
                quantity: normalizedQuantity
            })
        });

        if (!createResponse.ok) throw new Error('Failed to create cart item quantity');
    } catch (error) {
        console.error('Server cart quantity sync failed:', error);
    }
}

export function clearCart() {
    localStorage.removeItem(CART_ITEMS_KEY);
    localStorage.setItem(CART_COUNT_KEY, '0');
    window.dispatchEvent(new Event(CART_UPDATED_EVENT));
}

export { CART_ITEMS_KEY, CART_COUNT_KEY, CART_UPDATED_EVENT };
