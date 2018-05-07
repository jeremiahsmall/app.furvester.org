import axios from 'axios';
import Config from '../config/Config';
import dbPromise from '../db/Db.js';

const CACHE_TIMEOUT = 60 * 60;

const loadAllFromApi = () => axios.get(Config.API_URL + '/events').then(response => {
    return dbPromise.then(db => {
        const transaction = db.transaction(['event', 'data'], 'readwrite');
        const eventObjectStore = transaction.objectStore('event');
        const dataObjectStore = transaction.objectStore('data');

        eventObjectStore.clear();
        response.data.events.forEach(event => eventObjectStore.add(event));
        dataObjectStore.put({
            key: 'lastEventUpdate',
            value: Math.round((new Date()).getTime() / 1000),
        });

        return transaction.complete;
    }).then(() => response.data.events).catch(() => response.data.events);
});

const loadOneFromApi = eventId => {
    return loadAllFromApi().then(events => {
        return events.find(event => event.id === eventId);
    });
};

const loadAllFromDb = () => dbPromise.then(db => db.transaction('event', 'readonly').objectStore('event').getAll());
const loadOneFromDb = eventId => dbPromise.then(
    db => db.transaction('event', 'readonly').objectStore('event').get(eventId)
);

export default {
    getEvents() {
        return dbPromise.then(
            db => db.transaction('data', 'readonly').objectStore('data').get('lastEventUpdate')
        ).then(result => {
            if (undefined === result) {
                return loadAllFromApi();
            }

            const now = Math.round((new Date()).getTime() / 1000);

            if (result.value + CACHE_TIMEOUT < now) {
                return loadAllFromApi().catch(loadAllFromDb);
            }

            return loadAllFromDb().catch(loadAllFromApi);
        });
    },

    getEvent(eventId) {
        return dbPromise.then(
            db => db.transaction('data', 'readonly').objectStore('data').get('lastEventUpdate')
        ).then(result => {
            if (undefined === result) {
                return loadOneFromApi(eventId);
            }

            const now = Math.round((new Date()).getTime() / 1000);

            if (result.value + CACHE_TIMEOUT < now) {
                return loadOneFromApi(eventId).catch(() => loadOneFromDb(eventId));
            }

            return loadOneFromDb(eventId).catch(() => loadOneFromApi(eventId));
        });
    },
};
