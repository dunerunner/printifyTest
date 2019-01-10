import $ from 'jquery';
import Backbone from 'backbone';
import homeTemplate from './home.template.hbs';
import OrderCollection from '../../collections/order.collection';

import ImportWizard from '../import-wizard/import-wizard';

export default Backbone.View.extend({
    el: '#main',
    template: homeTemplate,

    collection: new OrderCollection(),

    tableOptions: {
        currentPage: 1,
        itemsPerPage: 2,
        pages: 1,
    },

    childView: new ImportWizard(),

    events: {
        'click #importBtn': 'showImportModal',
        'click .page-number': 'goToPage',
        'click .page-prev': 'prevPage',
        'click .page-next': 'nextPage'
    },

    showImportModal: function () {
        this.childView.$el = $('#wizardContainer');
        this.childView.render();
        this.childView.delegateEvents();
    },

    goToPage: function (evt) {
        evt.preventDefault();
        evt.stopPropagation();

        this.tableOptions.currentPage = parseInt(evt.target.innerHTML);

        this.render();
    },

    nextPage: function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
        if (this.tableOptions.currentPage < this.tableOptions.pages) {
            this.tableOptions.currentPage++;
            this.render();
        }
    },

    prevPage: function (evt) {
        evt.preventDefault();
        evt.stopPropagation();
        if (this.tableOptions.currentPage > 1) {
            this.tableOptions.currentPage--;
            this.render();
        }
    },

    initialize: function () {
        this.collection.fetch({
            reset: true
        });
        this.collection.bind("reset", this.render, this);
    },

    render: function () {
        let orders = this.collection.toJSON();
        let ordersCopy = JSON.parse(JSON.stringify(orders));
        let startIndex = (this.tableOptions.currentPage - 1) * this.tableOptions.itemsPerPage;
        let filteredOrders = ordersCopy.splice(startIndex, this.tableOptions.itemsPerPage);

        this.tableOptions.pages = Math.ceil(orders.length / this.tableOptions.itemsPerPage);

        this.$el.html(homeTemplate(
            {
                orders: filteredOrders,
                pages: this.tableOptions.pages,
                currentPage: this.tableOptions.currentPage
            }
        ));
    }
});
