import Backbone from 'backbone';

export default Backbone.Model.extend({
    defaults: {
        id: "Not specified",
        customer: "Not specified",
        volume: "Not specified",
        sku: "Not specified",
        products: []
    }
});
