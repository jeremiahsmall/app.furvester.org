import axios from 'axios';

export default {
    getTeam() {
        return axios.get(process.env.API_URL + '/team').then(response => response.data.team);
    },
};
