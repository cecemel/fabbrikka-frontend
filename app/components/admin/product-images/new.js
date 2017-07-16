//clean up later
import Ember from 'ember';
import config from 'fabbrikka-frontend/config/environment';

export default Ember.Component.extend({
    fileUploadHost: config.APP.backendHost,
    fileUploadEndpoint: config.APP.backendHost + "/files",

    imageUploadValidation: Ember.computed(function(){
      return Ember.run.bind(this, () => {
        if (Ember.isEmpty(this.productImageType)) {
          alert("please provide an image type");
          return false;
        }
        return true;
      });
    }),

    imageUploadFail: Ember.computed(function(){
      return Ember.run.bind(this, (jqXHR, textStatus) => {
        alert("image upload failed:" + textStatus);
      });
    }),

    imageUploadSuccess: Ember.computed(function(){
      return Ember.run.bind(this, (data) => {
          let url = this.fileUploadHost + data.links.self + "/download";
          this.sendAction('save', url, this.get('productImageType'));

        // this.createRecordLocally('productImages', 'product-image',
        //     {accessURL : this.fileUploadHost + data.links.self + "/download", type: this.productImageType});
      });
    }),

});
