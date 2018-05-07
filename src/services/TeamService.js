import axios from 'axios';
import Config from '../config/Config';
import dbPromise from '../db/Db.js';

const CACHE_TIMEOUT = 60 * 60 * 24;

const loadFromApi = () => axios.get(Config.API_URL + '/team').then(response => {
    return dbPromise.then(db => {
        const transaction = db.transaction(['team', 'data'], 'readwrite');
        const teamObjectStore = transaction.objectStore('team');
        const dataObjectStore = transaction.objectStore('data');

        teamObjectStore.clear();
        response.data.team.forEach(member => teamObjectStore.add(member));
        dataObjectStore.put({
            key: 'lastTeamUpdate',
            value: Math.round((new Date()).getTime() / 1000),
        });

        return transaction.complete;
    }).then(() => response.data.team).catch(() => response.data.team);
});

const loadFromDb = () => dbPromise.then(db => db.transaction('team', 'readonly').objectStore('team').getAll());

export default {
    getTeam() {
        return dbPromise.then(
            db => db.transaction('data', 'readonly').objectStore('data').get('lastTeamUpdate')
        ).then(result => {
            if (undefined === result) {
                return loadFromApi();
            }

            const now = Math.round((new Date()).getTime() / 1000);

            if (result.value + CACHE_TIMEOUT < now) {
                return loadFromApi().catch(loadFromDb);
            }

            return loadFromDb().catch(loadFromApi);
        });
    },
};
