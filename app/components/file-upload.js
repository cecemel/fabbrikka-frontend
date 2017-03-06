import Ember from 'ember';
import EmberUploader from 'ember-uploader';

export default EmberUploader.FileField.extend({
  filesDidChange: function(files) {
    const uploader = EmberUploader.Uploader.create({
      url: this.get('url')
    });

    if(!this.get('validationAction')()){
        return;
    }

    if (!Ember.isEmpty(files)) {
      uploader.upload(files[0]).then(this.get('uploadSuccessAction'), this.get('uploadFailedAction'));
    }
  }
});
