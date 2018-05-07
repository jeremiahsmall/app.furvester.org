<template>
    <v-ons-page>
        <v-ons-toolbar>
            <div class="left">
                <v-ons-back-button>Back</v-ons-back-button>
            </div>
            <div class="right" v-show="shareSupported && event">
                <v-ons-toolbar-button @click="share()">
                    <v-ons-icon icon="fa-share"></v-ons-icon>
                </v-ons-toolbar-button>
            </div>
        </v-ons-toolbar>

        <loading-indicator :is-loading="! event"></loading-indicator>

        <v-ons-card v-show="event">
            <div class="title">
                <span v-if="event">{{ event.title }}</span>
            </div>
            <div class="content">
                <span v-if="event">
                    <v-ons-list>
                        <v-ons-list-item>
                            When: {{ event.startsAt | moment('dddd HH:mm') }}
                            - {{ event.endsAt | moment('HH:mm') }}
                        </v-ons-list-item>
                        <v-ons-list-item>Where: {{ event.room }}</v-ons-list-item>
                    </v-ons-list>
                    <p style="white-space: pre-wrap;">{{ event.description }}</p>
                </span>
            </div>
        </v-ons-card>
    </v-ons-page>
</template>

<script>
    import LoadingIndicator from '../../components/loading-indicator/LoadingIndicator';
    import EventService from '../../services/EventService';

    export default {
        name: 'event-page',
        components: {
            LoadingIndicator,
        },
        data() {
            return {
                shareSupported: undefined !== navigator.share,
                event: null,
            };
        },
        created() {
            EventService.getEvent(this.$route.params.eventId).then((event) => {
                this.event = event;
            }).catch(() => {
                this.$ons.notification.alert('Could not load event. Please check your internet connection.');
            });
        },
        methods: {
            share() {
                const a = document.createElement('a');
                a.href = this.$router.resolve({name: 'event', params: {eventId: this.event.id}}).href;
                const url = a.protocol + '//' + a.host + a.pathname;

                navigator.share({
                    title: this.event.title,
                    text: 'Check out the "' + this.event.title + '" event on Furvester',
                    url: url,
                });
            },
        },
    };
</script>
