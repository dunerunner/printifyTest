import Backbone from 'backbone';
import OrderModel from '../models/order.model';

export default Backbone.Collection.extend({
    url: 'data/orders.json',
    model: OrderModel,

    parse: function(response) {
        return response.orders;
    }
});