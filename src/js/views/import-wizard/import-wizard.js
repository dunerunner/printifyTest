import $ from 'jquery';
import Backbone from 'backbone';
import wizardTemplate from './import-wizard.template.hbs';

import ImportOrdersCollection from '../../collections/import-orders.collection';
import OrdersTable from '../orders-table/orders-table';
import ProductsTable from '../products-table/products-table';

export default Backbone.View.extend({
    template: wizardTemplate,

    collection: new ImportOrdersCollection(),

    childView: new OrdersTable(),
    childView2: new ProductsTable(),

    dataModel: {
        selectedOrder: null,
        selectedProducts: [],
        query: ''
    },

    step: 1,

    events: {
        'keyup #searchInput': 'queryOrders',
        'click .import-item': 'showOrderProducts',
        'change .product-checkbox': 'toggleSelectedProduct',

        'click #previousBtn': 'previousStep',
        'click #nextBtn': 'nextStep',
        'click #cnsBtn': 'shipOrder'
    },

    queryOrders: function (evt) {
        let query;
        if (evt) {
            evt.preventDefault();
            query = evt.target.value;
            this.dataModel.query = query;
        } else {
            query = this.dataModel.query;
        }

        if (query) {
            const orders = this.collection.toJSON();
            let result = [];
            orders.forEach((el) => {
                if ((el.id.toString().toLowerCase().indexOf(query) > -1)
                    || (el.customer.toLowerCase().indexOf(query) > -1)
                    || (el.volume.toString().toLowerCase().indexOf(query) > -1)
                    || (el.sku.toLowerCase().indexOf(query) > -1)) {
                    result.push(el);
                }
            });
            this.renderOrdersTable(result);
        } else {
            this.renderOrdersTable(this.collection.toJSON());
        }
    },

    renderOrdersTable: function (orders) {
        this.childView.$el = $('#ordersTable');
        this.childView.render(orders || this.collection.toJSON());
        this.childView.delegateEvents();
    },

    renderProductsTable: function () {
        this.childView2.$el = $('#productsTable');
        this.childView2.render(this.step === 1 ? this.dataModel.selectedOrder.products : this.dataModel.selectedProducts, this.step);
        this.childView2.delegateEvents();
    },

    showOrderProducts: function (evt) {
        const orderId = evt.target.parentNode.dataset.id;

        this.collection.forEach((el) => {
            if (el.id === parseInt(orderId)) {
                this.dataModel.selectedOrder = el.toJSON();
            }
        });
        this.render();
    },

    toggleSelectedProduct: function (evt) {
        evt.preventDefault();
        const productId = parseInt(evt.target.value);
        if (evt.target.checked) {
            this.dataModel.selectedOrder.products.forEach((el) => {
                if (el.id === productId) {
                    el.selected = true;
                    this.dataModel.selectedProducts.push(el);
                }
            });
        } else {
            this.dataModel.selectedProducts.forEach((el, index) => {
                if (el.id === productId) {
                    el.selected = false;
                    this.dataModel.selectedProducts.splice(index, 1);
                }
            });
        }
        $('#nextBtn').attr('disabled', !this.dataModel.selectedProducts.length);
    },
    clearVariantSelection: function () {
        this.dataModel.selectedProducts.forEach((el) => {
            el.variant = null;
        });
    },

    clearDataModel: function () {
        this.dataModel.selectedOrder.products.forEach((el) => {
            el.selected = false;
        });
        this.dataModel.selectedOrder = null;
        this.dataModel.selectedProducts = [];
    },


    previousStep: function () {
        switch (this.step) {
            case 1:
                this.clearDataModel();
                break;
            case 2:
                this.clearVariantSelection();
                this.step--;
                break;
            case 3:
                this.step--;
                break;
        }
        this.render();
    },

    nextStep: function () {
        this.step++;
        console.log('DM', this.dataModel);
        this.render();
    },

    shipOrder: function () {
        console.log('LOL END');
    },

    initialize: function () {
        this.collection.fetch({
            reset: true
        });
        this.collection.bind("reset", this.render, this);

        $(document).on('hidden.bs.modal', '#importModal', () => {
            this.dataModel.query = '';
            this.clearDataModel();
            this.step = 1;
        })
    },

    render: function () {
        this.$el.html(wizardTemplate(
            {
                step: this.step,
                dataModel: this.dataModel
            }
        ));
        if (!this.dataModel.selectedOrder) {
            this.queryOrders(null);
        } else {
            this.renderProductsTable();
        }
    }
});