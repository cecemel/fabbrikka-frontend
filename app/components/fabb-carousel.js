import Ember from 'ember';

export default Ember.Component.extend({
  fastboot: Ember.inject.service(),
  imageSources: ["https://firebasestorage.googleapis.com/v0/b/fabbrikka.appspot.com/o/carouselimages%2FCarousel7.png?alt=media&token=59e6440b-3714-4e65-81ca-21b8cc60e17b"],

  _loadCarouselImages(){
    let imageSources = this.get("imageSources");

    if (!this.get("fastboot.isFastBoot")) {
      return imageSources.concat([
        "https://firebasestorage.googleapis.com/v0/b/fabbrikka.appspot.com/o/carouselimages%2FCarousel8.png?alt=media&token=de7a5115-58f5-4fbb-ad2e-b868fbc2994e",
        "https://firebasestorage.googleapis.com/v0/b/fabbrikka.appspot.com/o/carouselimages%2FCarousel9.png?alt=media&token=1d2f3272-ee15-40ba-b873-6bc766f3c5c3",
        "https://firebasestorage.googleapis.com/v0/b/fabbrikka.appspot.com/o/carouselimages%2Fcarousel10.png?alt=media&token=90f6cd4b-0479-4a15-83e7-02b3df804200",
        "https://firebasestorage.googleapis.com/v0/b/fabbrikka.appspot.com/o/carouselimages%2FCarousel11.png?alt=media&token=f93541fd-c30c-4a3c-8b03-7f0176efb509",

      ]);
    }
    return imageSources;
  },

  init(){
    this._super(...arguments);
    this.set("imageSources", this._loadCarouselImages());
  }

});
