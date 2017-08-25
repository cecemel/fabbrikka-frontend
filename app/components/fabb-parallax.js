import Ember from 'ember';

export default Ember.Component.extend({
     newImage: "https://firebasestorage.googleapis.com/v0/b/fabbrikka-app.appspot.com/o/DSC09027%20copia.jpg?alt=media&token=098b1916-a1f1-404c-84a2-8ddcbb876e57",
     images: [
            //"https://firebasestorage.googleapis.com/v0/b/fabbrikka-app.appspot.com/o/DSC09027%20copia.jpg?alt=media&token=098b1916-a1f1-404c-84a2-8ddcbb876e57",
            //  "https://firebasestorage.googleapis.com/v0/b/fabbrikka.appspot.com/o/Muuralax.jpeg?alt=media&token=d59f4369-2d6a-479e-b831-128d67a9101a",
            "https://firebasestorage.googleapis.com/v0/b/fabbrikka-app.appspot.com/o/DSC00114%20copia.jpg?alt=media&token=6a5eaaf8-7303-4a5e-8a7b-3c8de53bf163"
            ],
     imageObjects: [],

     didInsertElement: function() {
        this._super(...arguments);

        let self = this;
        // this._loadImages()
        // .then(() =>{
        //   self.get('imageObjects').forEach((img) =>{
        //     self.$(".parallax").append(img);
        //     img.style = "display: none; " + self.$(".parallax").children().first().attr("style").split(";")[1] + ";"
        //     self._removeCurrentImage()
        //     .then(() => {
        //       //self._initParallax();
        //     });
        //     //.then(() => {
        //       self.$(img).fadeIn(2000, () =>{
        //         //this._initParallax();
        //     //  });
        //     })
        //   });
        // })

        this.$('.parallax').parallax();
        this.$('.parallax2').parallax();

        this.$('.parallax2').fadeOut(5000, () => {
          this.$('.parallax2').fadeIn(5000, () => {
            this.$('.parallax2').fadeOut(5000, () => {
              this.$('.parallax2').fadeIn(5000)
            })
          });
        });

        // this._removeCurrentImage(this)
        // .then(this._loadImage.bind(this))
        // .then(this._initParallax.bind(this));
    },

    _removeCurrentImage: function(){
      let self = this;
      return new Ember.RSVP.Promise((resolve) => {
        self.$(".parallax").children().first().fadeOut(1000, () => {
          self.$(".parallax").children().first().remove();
          resolve();
        });
      });
    },

    _loadImage: function(src){
      let self = this;
      //return new Ember.RSVP.Promise((resolve) => {
        let img = new Image();
        img.style.display = "none";
        // img.onload = function() {
        //   self.$(this).fadeIn(1000);
        // };
        // self.$(".parallax").append(img);
        //img.src = self.get("newImage");
        img.src = src;
        return img;
        //resolve();
      //});
    },

    _initParallax: function(){
      this.$('.parallax').parallax();
    },

    _imageLoaded(imgElement) {
      return imgElement.complete && imgElement.naturalHeight !== 0;
    },

    _allImagesLoaded(){
      let c = this.get('imageObjects').reduce((acc, value) =>{
        if(this._imageLoaded(value)){
          return acc + 1;
        }
        return acc;
      }, 0);

      if(c >= 3){
        return true;
      }
      return false;
    },

    _waitForImages(attempt){
      return new Ember.RSVP.Promise((resolve) => {
        setTimeout(() => {
          if(!this._allImagesLoaded() && attempt < 10){
            ++attempt;
            this._waitForImages(attempt);
          }
          resolve();
        }, 3000);

      });
    },

    _loadImages(){
      return new Ember.RSVP.Promise((resolve) => {
        this.get("images").forEach((src) => {
          this.get('imageObjects').push(this._loadImage(src));
        });
        let attempts = 0;
        this._waitForImages(attempts)
        .then(() => {
          resolve();
        });
      });
    }

});
