import Ember from 'ember';
import RouterScroll from 'ember-router-scroll';
import config from './config/environment';

const Router = Ember.Router.extend(RouterScroll, {
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {

  this.route('products', function() {
    this.route('new');
    this.route('details', { path: '/:id/details' });
  });

  this.route('admin', function() {
    this.route('products', function() {
      this.route('new');
    });

    this.route('product-audiences', function() {
      this.route('new');
    });

    this.route('product-variant-sizes', function() {
      this.route('new');
    });
    this.route('stock-items', function() {
      this.route('new');
    });
  });
  this.route('shopping-cart', function() {
    this.route('checkout', function() {});
  });
  this.route('login');
});

export default Router;
