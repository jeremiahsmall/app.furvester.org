import axios from 'axios';
import Config from '../config/Config';

export default {
    getTeam() {
        return axios.get(Config.API_URL + '/team').then(response => response.data.team);
    },
};
