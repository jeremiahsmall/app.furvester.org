<template>
    <v-ons-page>
        <v-ons-toolbar>
            <div class="left">
                <v-ons-back-button>Back</v-ons-back-button>
            </div>
            <div class="right" v-if="shareSupported">
                <v-ons-toolbar-button @click="share()">
                    <v-ons-icon icon="fa-share-alt"></v-ons-icon>
                </v-ons-toolbar-button>
            </div>
        </v-ons-toolbar>

        <v-ons-card>
            <div class="title">
                {{event.title}}
            </div>
            <div class="content">
                <v-ons-list>
                    <v-ons-list-item>When: {{event.startsAt | moment('ddd HH:mm')}} - {{event.endsAt | moment('HH:mm')}}</v-ons-list-item>
                    <v-ons-list-item>Where: {{event.room}}</v-ons-list-item>
                </v-ons-list>
                <p style="white-space: pre-wrap;">{{event.description}}</p>
            </div>
        </v-ons-card>
    </v-ons-page>
</template>

<script>
    export default {
        name: 'event-page',
        data() {
            return {
                shareSupported: !! navigator.share,
            };
        },
        methods: {
            share() {
                let a = document.createElement('a');
                a.href = '#' + this.$router.match({name: 'schedule', query: {event: this.event.id}}).fullPath;
                let url = a.protocol + '//' + a.host + a.pathname + a.hash;

                navigator.share({
                    title: this.event.title,
                    url: url,
                });
            },
        },
    };
</script>
