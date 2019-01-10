import Backbone from 'backbone';
import ImportOrderModel from '../models/import-order.model';

export default Backbone.Collection.extend({
    url: 'data/import-orders.json',
    model: ImportOrderModel,

    parse: function(response) {
        return response.orders;
    }
});