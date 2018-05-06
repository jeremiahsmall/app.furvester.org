<template src="./SchedulePage.html">
    <div></div>
</template>

<script>
    import OverviewPage from './OverviewPage';

    export default {
        name: 'schedule-page',
        data() {
            return {
                pageStack: [],
            };
        },
        methods: {
            pushStack() {
                window.history.pushState({}, '', '');
            },
        },
        created() {
            if (this.$route.query.event) {
                history.replaceState(
                    undefined,
                    undefined,
                    '#' + this.$router.match('schedule').fullPath
                );

                this.pageStack.push({
                    extends: OverviewPage,
                    data() {
                        return {
                            showEventAfterLoad: this.$route.query.event,
                        };
                    }
                });
            } else {
                this.pageStack.push(OverviewPage);
            }

            window.addEventListener('popstate', () => {
                if (pageStack.length > 1) {
                    pageStack.pop();
                }
            });
        },
    };
</script>
