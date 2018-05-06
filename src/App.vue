<style lang="css" scoped src="./App.css"></style>
<template src="./App.html"></template>

<script>
    import store from './store';

    let transitionRunning = false;

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
                pageStack: [],
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
        created() {
            const mapRouteStack = route => this.pageStack = route.matched.map(m => m.components.default);

            if ('event' === this.$route.name) {
                let eventId = this.$route.params.eventId;
                this.$router.replace({name: 'schedule'});
                this.$router.push({name: 'event', params: {'eventId': eventId}});
            }

            mapRouteStack(this.$route);

            this.$router.beforeEach((to, from, next) => {
                if (transitionRunning) {
                    next(false);
                    return;
                }

                mapRouteStack(to);
                next();
            });
        },
        methods: {
            goTo(target) {
                if (target.startsWith('http://') || target.startsWith('https://')) {
                    window.open(target);
                } else {
                    this.$router.replace({name: target});
                }

                store.commit('toggleMenu', false);
            },
            transitionRunning() {
                transitionRunning = true;
            },
            transitionStopped() {
                transitionRunning = false;
            },
            goBack() {
                this.$router.go(-1);
            },
        },
    };
</script>
