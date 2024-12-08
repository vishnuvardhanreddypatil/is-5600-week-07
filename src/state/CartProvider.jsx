// CartProvider.js

const UPDATE_ITEM_QUANTITY = 'UPDATE_ITEM_QUANTITY';

const cartReducer = (state, action) => {
  const { payload } = action;
  switch (action.type) {
    case ADD_ITEM:
      const newState = {
        ...state,
        itemsById: {
          ...state.itemsById,
          [payload._id]: {
            ...payload,
            quantity: state.itemsById[payload._id]
              ? state.itemsById[payload._id].quantity + 1
              : 1,
          },
        },
        allItems: Array.from(new Set([...state.allItems, payload._id])),
      };
      return newState;

    case REMOVE_ITEM:
      return {
        ...state,
        itemsById: Object.entries(state.itemsById)
          .filter(([key]) => key !== payload._id)
          .reduce((obj, [key, value]) => ({ ...obj, [key]: value }), {}),
        allItems: state.allItems.filter((id) => id !== payload._id),
      };

    case UPDATE_ITEM_QUANTITY:
      return {
        ...state,
        itemsById: {
          ...state.itemsById,
          [payload.id]: {
            ...state.itemsById[payload.id],
            quantity: Math.max(payload.quantity, 0),
          },
        },
      };

    default:
      return state;
  }
};

const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const removeFromCart = (product) => {
    dispatch({ type: REMOVE_ITEM, payload: product });
  };

  const addToCart = (product) => {
    dispatch({ type: ADD_ITEM, payload: product });
  };

  const updateItemQuantity = (id, quantity) => {
    dispatch({ type: UPDATE_ITEM_QUANTITY, payload: { id, quantity } });
  };

  const getCartTotal = () => {
    return state.allItems.reduce(
      (total, id) => total + state.itemsById[id].price * state.itemsById[id].quantity,
      0
    );
  };

  const getCartItems = () => {
    return state.allItems.map((id) => state.itemsById[id]) ?? [];
  };

  return (
    <CartContext.Provider
      value={{
        cartItems: getCartItems(),
        addToCart,
        updateItemQuantity,
        removeFromCart,
        getCartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export { CartProvider, useCart };
