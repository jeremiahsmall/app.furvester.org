<template src="./AboutPage.html"></template>

<script>
    import Navbar from '../../components/navbar/Navbar';
    import Config from '../../config/Config';

    export default {
        name: 'info-page',
        components: {
            Navbar,
        },
        data() {
            return {
                version: Config.VERSION,
            };
        },
    };
</script>
