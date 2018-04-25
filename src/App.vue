<style lang="css" scoped src="./App.css"></style>
<template src="./App.html">
    <div></div>
</template>

<script>
    import HomePage from './pages/home/HomePage';
    import store from './store';

    export default {
        name: 'app',
        store,
        computed: {
            menuIsOpen: {
                get() {
                    return store.state.menuIsOpen;
                },
                set(isOpen) {
                    store.commit('toggleMenu', isOpen);
                },
            },
        },
        data() {
            return {
                pages: [
                    {
                        routeName: 'schedule',
                        label: 'Schedule',
                        icon: 'fa-calendar'
                    },
                    {
                        routeName: 'map',
                        label: 'Map',
                        icon: 'fa-map'
                    },
                    {
                        routeName: 'team',
                        label: 'Team',
                        icon: 'fa-users'
                    },
                    {
                        routeName: 'achievements',
                        label: 'Achievements',
                        icon: 'fa-trophy'
                    },
                ]
            };
        },
        components: {
            HomePage,
        },
        methods: {
            goTo(routeName) {
                this.$router.push({name: routeName});
                store.commit('toggleMenu', false);
            },
        },
    };
</script>
