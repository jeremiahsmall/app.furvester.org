<template>
    <v-ons-page>
        <v-ons-list>
            <v-ons-list-item v-for="event in events" :key="event.id" modifier="chevron" tappable @click="showEvent(event.id)">
                <span class="list-item__title">{{ event.title }}</span>
                <span class="list-item__subtitle">
                    {{ event.startsAt | moment('HH:mm') }}
                    {{ event.room }}
                </span>
            </v-ons-list-item>
        </v-ons-list>
    </v-ons-page>
</template>

<script>
    export default {
        props: {
            events: Array,
        },
        methods: {
            showEvent(eventId) {
                this.$router.push({name: 'event', params: {eventId: eventId}});
            },
        },
    };
</script>
