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
                categories: [
                    {
                        label: null,
                        pages: [
                            {
                                target: 'schedule',
                                label: 'Schedule',
                                icon: 'fa-calendar'
                            },
                            {
                                target: 'map',
                                label: 'Map',
                                icon: 'fa-map'
                            },
                            {
                                target: 'team',
                                label: 'Team',
                                icon: 'fa-users'
                            },
                            {
                                target: 'about',
                                label: 'About',
                                icon: 'fa-info-circle'
                            },
                            {
                                target: 'achievements',
                                label: 'Achievements',
                                icon: 'fa-trophy'
                            },
                        ],
                    },
                    {
                        label: 'Links',
                        pages: [
                            {
                                target: 'https://furvester.org',
                                label: 'Website',
                                icon: 'fa-link'
                            },
                            {
                                target: 'https://twitter.com/furvester',
                                label: 'Twitter',
                                icon: 'fa-twitter'
                            },
                        ],
                    }
                ]
            };
        },
        components: {
            HomePage,
        },
        methods: {
            goTo(target) {
                if (target.startsWith('http://') || target.startsWith('https://')) {
                    window.open(target);
                } else {
                    this.$router.push({name: target});
                }

                store.commit('toggleMenu', false);
            },
        },
    };
</script>
