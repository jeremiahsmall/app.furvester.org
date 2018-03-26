import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        menuIsOpen: false,
    },
    mutations: {
        toggleMenu(state, isOpen) {
            if (typeof isOpen !== 'undefined') {
                state.menuIsOpen = isOpen;
            } else {
                state.menuIsOpen = ! state.menuIsOpen;
            }
        },
    },
});
