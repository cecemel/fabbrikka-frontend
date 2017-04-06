export function initialize(application) {
  application.inject('route', 'cart', 'service:shopping-cart');
}

export default {
  name: 'shopping-cart',
  initialize: initialize
};
