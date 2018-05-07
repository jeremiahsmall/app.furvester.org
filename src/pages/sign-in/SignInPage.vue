<template src="./SignInPage.html"></template>

<script>
    import Navbar from '../../components/navbar/Navbar';
    import LoadingIndicator from '../../components/loading-indicator/LoadingIndicator';
    import OAuthService from '../../services/OAuthService';
    import store from '../../store';

    export default {
        name: 'sign-in-page',
        components: {
            Navbar,
            LoadingIndicator,
        },
        data() {
            return {
                isLoading: false,
                achievements: [],
                emailAddress: null,
                password: null,
            };
        },
        mounted() {
            OAuthService.forget().then(() => store.commit('updateAccount', null));
        },
        methods: {
            signIn() {
                if (this.isLoading) {
                    return;
                }

                this.isLoading = true;

                OAuthService.authenticate(this.emailAddress, this.password).then(account => {
                    store.commit('updateAccount', account);
                    this.isLoading = false;
                    this.$router.replace({name: 'achievements'});
                }).catch(() => {
                    this.isLoading = false;
                    this.$ons.notification.alert('The entered user credentials are not valid.');
                });
            }
        }
    };
</script>
