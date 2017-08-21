import Ember from 'ember';

export default Ember.Component.extend({

    _formatRows: function(data){
        let rows = [], start = 0, stop = 4, size = 4, length = data.get('length');

        while(start < length + size - 1){
            rows.push(data.slice(start, stop));
            start = start + size;
            stop = stop + size;
        }

        return rows;
    },

    init(){
        this._super(...arguments);
        this.set("rows", this._formatRows(this.get('data')));
    }
});
