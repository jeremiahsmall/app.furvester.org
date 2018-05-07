<template src="./TeamPage.html"></template>

<script>
    import Navbar from '../../components/navbar/Navbar';
    import LoadingIndicator from '../../components/loading-indicator/LoadingIndicator';
    import TeamService from '../../services/TeamService';
    import Blazy from 'blazy';

    export default {
        name: 'team-page',
        components: {
            Navbar,
            LoadingIndicator,
        },
        data() {
            return {
                isLoading: false,
                team: [],
            };
        },
        mounted() {
            this.isLoading = true;

            TeamService.getTeam().then(team => {
                team.sort((a, b) => a.nickname.localeCompare(b.nickname));

                this.team = team;
                this.isLoading = false;

                new Blazy({
                    container: '.page__content',
                });
            }).catch(() => {
                this.$ons.notification.alert('Could not load team. Please check your internet connection.');
                this.isLoading = false;
            });
        },
    };
</script>
