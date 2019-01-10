import Backbone from 'backbone';
import HomePage from './views/home/home';

const routes = {
    '': 'index'
};

class Router extends Backbone.Router {
    constructor() {
        super({ routes });
    }

    index() {
        new HomePage().render();
    }
}

export default Router;
