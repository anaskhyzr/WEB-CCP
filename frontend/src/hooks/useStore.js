import { useDispatch, useSelector } from 'react-redux';

// Hook to use cart
export const useCart = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  return { dispatch, ...cart };
};

// Hook to use products
export const useProducts = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products);
  return { dispatch, ...products };
};

// Hook to use order
export const useOrder = () => {
  const dispatch = useDispatch();
  const order = useSelector((state) => state.order);
  return { dispatch, ...order };
};
