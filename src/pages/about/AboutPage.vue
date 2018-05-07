<template src="./AboutPage.html"></template>

<script>
    import Navbar from '../../components/navbar/Navbar';

    export default {
        name: 'info-page',
        components: {
            Navbar,
        },
        data() {
            return {
                version: process.env.VERSION,
            };
        },
    };
</script>
