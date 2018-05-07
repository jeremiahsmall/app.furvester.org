import axios from 'axios';
import Config from '../config/Config';

export default {
    getEvents() {
        return axios.get(Config.API_URL + '/events').then(response => response.data.events);
    },

    getEvent(eventId) {
        return axios.get(Config.API_URL + '/events').then(
            response => response.data.events.find(event => event.id === eventId)
        );
    },
};
