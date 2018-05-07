import axios from 'axios';

export default {
    getEvents() {
        return axios.get(process.env.API_URL + '/events').then(response => response.data.events);
    },

    getEvent(eventId) {
        return axios.get(process.env.API_URL + '/events').then(
            response => response.data.events.find(event => event.id === eventId)
        );
    },
};
