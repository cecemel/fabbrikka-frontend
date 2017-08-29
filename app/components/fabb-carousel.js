import Ember from 'ember';

export default Ember.Component.extend({
  fastboot: Ember.inject.service(),
  imageSources: ["https://firebasestorage.googleapis.com/v0/b/fabbrikka.appspot.com/o/carouselimages%2FCar1-min.jpg?alt=media&token=766bb252-3392-4e32-be9c-49f19494591d"],

  _loadCarouselImages(){
    let imageSources = this.get("imageSources");

    if (!this.get("fastboot.isFastBoot")) {
      return imageSources.concat([
        "https://firebasestorage.googleapis.com/v0/b/fabbrikka.appspot.com/o/carouselimages%2FCar2-min.jpg?alt=media&token=880b459f-4e74-49c7-b6ab-695bf03d38a5",
        "https://firebasestorage.googleapis.com/v0/b/fabbrikka.appspot.com/o/carouselimages%2FCar2-min.jpg?alt=media&token=880b459f-4e74-49c7-b6ab-695bf03d38a5",
        "https://firebasestorage.googleapis.com/v0/b/fabbrikka.appspot.com/o/carouselimages%2FCar5-min.jpg?alt=media&token=2e07b79c-5be2-418c-b7ca-f0930ef5378e",
        "https://firebasestorage.googleapis.com/v0/b/fabbrikka.appspot.com/o/carouselimages%2FCar6-min.jpg?alt=media&token=df4ba17f-a754-4189-af85-72999e530cf1",
        "https://firebasestorage.googleapis.com/v0/b/fabbrikka.appspot.com/o/carouselimages%2FCar3-min.jpg?alt=media&token=1fd2e43b-7b5f-4018-80bf-c09dbc148db7",

      ]);
    }
    return imageSources;
  },

  init(){
    this._super(...arguments);
    this.set("imageSources", this._loadCarouselImages());
  }

});
