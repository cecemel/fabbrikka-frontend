import Ember from 'ember';
import RouterScroll from 'ember-router-scroll';
import config from './config/environment';

const Router = Ember.Router.extend(RouterScroll, {
  location: config.locationType,
  rootURL: config.rootURL,
  metrics: Ember.inject.service(),

  didTransition() {
      this._super(...arguments);
      this._trackPage();
  },

  _trackPage() {
      Ember.run.scheduleOnce('afterRender', this, () => {
          if (typeof FastBoot === 'undefined') {
              const page = document.location.pathname;
              const title = this.getWithDefault('currentRouteName', 'unknown');
              Ember.get(this, 'metrics').trackPage({ page, title });
          }
      });
  }
});

Router.map(function() {
  this.route('products', function() {
    this.route('new');
    this.route('details', { path: '/:id/details' });
  });

  this.route('admin', function() {
    this.route('products', function() {
      this.route('new');
      this.route('edit', { path: '/:id/edit' });
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
    this.route('faq', function() {
      this.route('new');
      this.route('edit', { path: '/:id/edit' });
    });
    this.route('faq-content');
  });
  this.route('shopping-cart', function() {
    this.route('checkout', function() {});
  });
  this.route('login');
  this.route('about');
  this.route('free-try-out-rules');
  this.route('faq');
});

export default Router;
