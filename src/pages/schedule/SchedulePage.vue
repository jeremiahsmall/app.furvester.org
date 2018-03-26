<template src="./SchedulePage.html">
    <div></div>
</template>

<script>
    import OverviewPage from './OverviewPage';

    let pageStack = [OverviewPage];

    export default {
        name: 'schedule-page',
        data() {
            return {
                pageStack,
            };
        },
        methods: {
            pushStack() {
                window.history.pushState({}, '', '');
            },
        },
        created() {
            window.addEventListener('popstate', () => {
                if (pageStack.length > 1) {
                    pageStack.pop();
                }
            });
        },
    };
</script>
