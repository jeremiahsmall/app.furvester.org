<template src="./AboutPage.html"></template>

<script>
    import Navbar from '../../components/navbar/Navbar';

    export default {
        name: 'about-page',
        components: {
            Navbar,
        },
        data() {
            return {
                version: process.env.VERSION,
            };
        },
        methods: {
            viewSource() {
                window.open('https://github.com/Furvester/app.furvester.org');
            },
            reportABug() {
                window.open('https://github.com/Furvester/app.furvester.org/issues/new');
            },
        },
    };
</script>
