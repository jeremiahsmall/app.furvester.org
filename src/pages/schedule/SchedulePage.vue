<template src="./SchedulePage.html"></template>

<script>
    import Navbar from '../../components/navbar/Navbar';
    import LoadingIndicator from '../../components/loading-indicator/LoadingIndicator';
    import EventService from '../../services/EventService';
    import EventTab from './EventTab';

    let eventMap = {};

    export default {
        name: 'schedule-page',
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
                showEventId: null,
            };
        },
        mounted() {
            this.isLoading = true;

            EventService.getEvents().then(events => {
                const indexedEvents = {};
                const dates = {};

                events.forEach(event => {
                    let moment = this.$moment(event.startsAt);
                    let index = moment.format('YYYY-MM-DD');
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
                Object.keys(sortedDates).forEach(index => {
                    indexedEvents[index] = indexedEvents[index].sort(
                        (a, b) => this.$moment(a.startsAt).unix() - this.$moment(b.startsAt).unix()
                    );

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

                if (this.showEventId) {
                    this.showEvent(this.showEventId);
                }
            }).catch(() => {
                this.$ons.notification.alert('Could not load schedule. Please check your internet connection.');
                this.isLoading = false;
            });
        },
    };
</script>
