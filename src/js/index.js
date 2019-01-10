import 'jquery';
import 'popper.js';
import 'bootstrap';

import Backbone from 'backbone';
import Router from './router';
import Handlebars from 'hbsfy/runtime';

const router = new Router();

Handlebars.registerHelper('formatdate', function(date) {
    return (new Date(date)).toLocaleString();
});

Handlebars.registerHelper('times', function(n, block) {
    var accum = '';
    for(var i = 1; i <= n; ++i)
        accum += block.fn(i);
    return accum;
});

Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

Handlebars.registerHelper('ifNotEquals', function(arg1, arg2, options) {
    return (arg1 != arg2) ? options.fn(this) : options.inverse(this);
});


Backbone.history.start({ pushState: true, root: '/' });
