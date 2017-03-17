export function initialize(application) {
    application.inject('component', 'locale-selector', 'service:locale-tracker');
}

export default {
  name: 'start-locale-tracker',
  initialize
};
