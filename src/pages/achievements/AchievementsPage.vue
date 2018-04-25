<template src="./AchievementsPage.html">
    <div></div>
</template>

<script>
    import Navbar from '../../components/navbar/Navbar';
    import LoadingIndicator from '../../components/loading-indicator/LoadingIndicator';
    import OAuthService from '../../services/OAuthService';

    export default {
        name: 'achievements-page',
        components: {
            Navbar,
            LoadingIndicator,
        },
        data() {
            return {
                isLoading: false,
                code: null,
                achievements: [],
            };
        },
        mounted() {
            this.isLoading = true;

            OAuthService.request('GET', '/achievements').then((response) => {
                this.isLoading = false;
                this.achievements = response.data.achievements.sort((a, b) => {
                    let dateA = this.$moment(a.assignedAt).unix();
                    let dateB = this.$moment(b.assignedAt).unix();

                    if (dateA === dateB) {
                        return 0;
                    } else if (dateA > dateB) {
                        return -1;
                    } else {
                        return 1;
                    }
                });
            }).catch((reason) => {
                this.isLoading = false;

                if ('authenticate' === reason) {
                    this.$router.replace({name: 'sign-in'});
                    return;
                }

                this.$ons.notification.alert('An error occured when loading your achievements.');
            });
        },
        methods: {
            submitCode() {
                this.isLoading = true;

                OAuthService.request('POST', '/achievements/claim', {code: this.code}).then((response) => {
                    this.isLoading = false;
                    this.achievements.shift(response.data);
                }).catch((reason) => {
                    this.isLoading = false;

                    if ('authenticate' === reason) {
                        this.$router.replace({name: 'sign-in'});
                        return;
                    } else if ('unknown' === reason) {
                        this.$ons.notification.alert('An unknown error occured.');
                        return;
                    }

                    this.$ons.notification.alert(reason.data);
                });
            }
        }
    };
</script>
