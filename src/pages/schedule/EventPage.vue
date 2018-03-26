<template>
    <v-ons-page>
        <v-ons-toolbar>
            <div class="left">
                <v-ons-back-button>Back</v-ons-back-button>
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
                <p style="white-space: pre;">{{event.description}}</p>
            </div>
        </v-ons-card>
    </v-ons-page>
</template>

<script>
    export default {
        name: 'event-page',
    };
</script>
