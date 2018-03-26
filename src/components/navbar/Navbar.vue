<template>
    <v-ons-toolbar>
        <div class="left">
            <v-ons-toolbar-button @click="toggleMenu()">
                <v-ons-icon icon="fa-bars"></v-ons-icon>
            </v-ons-toolbar-button>
        </div>
        <div class="center">{{ msg }}</div>
    </v-ons-toolbar>
</template>

<script>
    export default {
        name: 'navbar',
        methods: {
            toggleMenu() {
                this.$store.commit('toggleMenu', true);
            },
        },
        props: {
            msg: String,
        },
    };
</script>
