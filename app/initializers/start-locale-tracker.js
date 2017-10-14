export function initialize(application) {
    application.inject('component', 'locale-select-modal', 'service:locale-tracker');
}

export default {
  name: 'start-locale-tracker',
  before: 'shopping-cart',
  initialize
};
