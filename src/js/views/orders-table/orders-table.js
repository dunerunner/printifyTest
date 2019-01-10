import Backbone from 'backbone';
import tableTemplate from './orders-table.template.hbs';


export default Backbone.View.extend({
    template: tableTemplate,

    render: function (orders) {
        this.$el.html(tableTemplate(
            {
                orders: orders,
            }
        ));
    }
});