import $ from 'jquery';
import Backbone from 'backbone';
import tableTemplate from './products-table.template.hbs';


export default Backbone.View.extend({
    template: tableTemplate,

    products: [],
    step: null,
    events: {
        'click .product-variant': 'selectProductVariant'
    },

    selectProductVariant: function (evt) {
        evt.preventDefault();
        const productId = parseInt(evt.target.dataset.productid);
        const variantId = parseInt(evt.target.dataset.variantid);
        this.products.forEach((el) => {
            if (el.id === productId) {
                el.variants.forEach((variant)=> {
                    if (variant.id === variantId) {
                        el.variant = variant.name;
                    }
                })
            }
        });

        this.checkProductVariants();
        this.render(this.products, this.step);
    },

    checkProductVariants: function () {
        let variantCounter = 0;
        this.products.forEach((el) => {
            if (el.variant) {
                variantCounter++;
            }
        });

        $('#nextBtn').attr('disabled', !(variantCounter === this.products.length));
    },

    render: function (products, step) {
        if (step === 2) {
            this.checkProductVariants();
        }

        this.products = products;
        this.step = step;
        this.$el.html(tableTemplate(
            {
                products: products,
                step: step
            }
        ));
    }
});