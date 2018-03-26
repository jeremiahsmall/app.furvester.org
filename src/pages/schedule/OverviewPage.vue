<template src="./OverviewPage.html" id="overview">
    <div></div>
</template>

<script>
    import Navbar from '../../components/navbar/Navbar';
    import LoadingIndicator from '../../components/loading-indicator/LoadingIndicator';
    import EventService from '../../services/EventService';
    import EventTab from './EventTab';
    import EventPage from './EventPage';

    let eventMap = {};

    export default {
        name: 'overview-page',
        components: {
            Navbar,
            LoadingIndicator,
            EventTab,
        },
        data() {
            return {
                isLoading: false,
                showTabs: false,
                events: {},
                activeIndex: 0,
                tabs: [],
            };
        },
        mounted() {
            this.isLoading = true;

            EventService.getEvents().then((events) => {
                let indexedEvents = {};
                let dates = {};

                events.forEach((event) => {
                    let moment = this.$moment(event.startsAt);
                    let index = moment.format('YYYY-MM-DD')
                    let date = moment.format('D MMM');

                    if (! (index in dates)) {
                        dates[index] = date;
                        indexedEvents[index] = [];
                    }

                    indexedEvents[index].push(event);
                    eventMap[event.id] = event;
                });

                let sortedDates = Object.keys(dates).sort().reduce((result, index) => {
                    result[index] = dates[index];
                    return result;
                }, {});

                let isFirst = true;
                Object.keys(sortedDates).forEach((index) => {
                    indexedEvents[index] = indexedEvents[index].sort((a, b) => {
                        let dateA = this.$moment(a.startsAt).unix();
                        let dateB = this.$moment(b.startsAt).unix();

                        if (dateA === dateB) {
                            return 0;
                        } else if (dateA > dateB) {
                            return 1;
                        } else {
                            return -1;
                        }
                    });

                    this.tabs.push({
                        label: sortedDates[index],
                        key: 'page-' + index,
                        active: isFirst,
                        page: EventTab,
                        props: {
                            events: indexedEvents[index],
                        },
                    });
                    isFirst = false;
                });

                this.events = indexedEvents;
                this.isLoading = false;
                this.showTabs = true;
            }).catch(() => {
                this.$ons.notification.alert('Could not load schedule. Please check your internet connection.');
                this.isLoading = false;
            });
        },
        created() {
            this.$on('event-clicked', (eventId) => {
                if (! (eventId in eventMap)) {
                    return;
                }

                this.$emit('push-page', {
                    extends: EventPage,
                    data() {
                        return {
                            event: eventMap[eventId],
                        };
                    }
                });
            });
        },
    };
</script>
