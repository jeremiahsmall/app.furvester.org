<style lang="css" scoped src="./App.css"></style>
<template src="./App.html"></template>

<script>
    import OAuthService from './services/OAuthService';
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
            account: {
                get() {
                    return store.state.account;
                },
            },
        },
        data() {
            return {
                pageStack: [],
                mainPages: [
                    {
                        route: 'schedule',
                        label: 'Schedule',
                        icon: 'fa-calendar'
                    },
                    {
                        route: 'map',
                        label: 'Map',
                        icon: 'fa-map'
                    },
                    {
                        route: 'team',
                        label: 'Team',
                        icon: 'fa-users'
                    },
                    {
                        route: 'about',
                        label: 'About',
                        icon: 'fa-info-circle'
                    },
                ],
                links: [
                    {
                        url: 'https://furvester.org',
                        label: 'Website',
                        icon: 'fa-link'
                    },
                    {
                        url: 'https://twitter.com/furvester',
                        label: 'Twitter',
                        icon: 'fa-twitter'
                    },
                ],
            };
        },
        created() {
            const mapRouteStack = route => this.pageStack = route.matched.map(m => m.components.default);

            if ('event' === this.$route.name) {
                const eventId = this.$route.params.eventId;
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

            OAuthService.getAccount().then(account => store.commit('updateAccount', account)).catch(() => {});
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
            signOut() {
                OAuthService.forget().then(() => {
                    store.commit('updateAccount', null);
                    store.commit('toggleMenu', false);
                    this.$router.replace('home');
                });
            },
        },
    };
</script>
