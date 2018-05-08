<style lang="css" scoped src="./HomePage.css"></style>
<template src="./HomePage.html"></template>

<script>
    import Navbar from '../../components/navbar/Navbar';

    const promptRequired = () => {
        if (! ['iPhone', 'iPad', 'iPod'].includes(navigator.platform)) {
            return false;
        }

        if (false !== navigator.standalone) {
            // If standalone is either true or undefined (no standalone support), we don't need to prompt.
            return false;
        }

        if (localStorage.getItem('promptDismissed')) {
            return false;
        }

        return true;
    };

    export default {
        name: 'home-page',
        components: {
            Navbar,
        },
        data() {
            return {
                showPrompt: false,
            };
        },
        mounted() {
            this.showPrompt = promptRequired();
        },
        methods: {
            dismissPrompt() {
                localStorage.setItem('promptDismissed', true);
                this.showPrompt = false;
            },
        },
    };
</script>
