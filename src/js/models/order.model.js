import Backbone from 'backbone';

export default Backbone.Model.extend({
    defaults: {
        id: "Not specified",
        customer: "Not specified",
        created: "Not specified",
        revenue: "Not specified",
        cost: "Not specified",
        price: "Not specified",
        fulfillment: "Not specified"
    }
});
