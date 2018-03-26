import axios from 'axios';
import Config from '../config/Config';
import Db from '../db/Db.js';

const CACHE_TIMEOUT = 60 * 60;

let loadFromApi = (resolve, reject) => {
    return axios.get(Config.API_URL + '/events').then((response) => {
        Db.getTransaction(['event', 'data'], 'readwrite').then((transaction) => {
            let eventObjectStore = transaction.objectStore('event', 'readonly');
            let dataObjectStore = transaction.objectStore('data', 'readonly');

            eventObjectStore.clear();

            response.data.events.forEach((event) => {
                eventObjectStore.add(event);
            });

            dataObjectStore.put({
                key: 'lastEventUpdate',
                value: Math.round((new Date()).getTime() / 1000),
            });

            transaction.addEventListener('complete', () => {
                resolve(response.data.events);
            });
        }).catch(() => {
            resolve(response.data.events);
        });
    }).catch(() => {
        reject();
    });
};

let loadFromDb = (resolve, reject) => {
    Db.getTransaction('event', 'readonly').then((transaction) => {
        let eventObjectStore = transaction.objectStore('event');
        let events = [];

        eventObjectStore.openCursor().addEventListener('success', (event) => {
            let cursor = event.target.result;

            if (! cursor) {
                resolve(events);
                return;
            }

            events.push({
                id: cursor.value.id,
                title: cursor.value.title,
                startsAt: cursor.value.startsAt,
                endsAt: cursor.value.endsAt,
                description: cursor.value.description,
                room: cursor.value.room,
            });
            cursor.continue();
        });
    }).catch(() => {
        reject();
    });
};

export default {
    getEvents() {
        return new Promise((resolve, reject) => {
            Db.getTransaction('data', 'readonly').then((transaction) => {
                let dataObjectStore = transaction.objectStore('data');
                let lastUpdateRequest = dataObjectStore.get('lastEventUpdate');
                lastUpdateRequest.addEventListener('success', (event) => {
                    if (event.target.result === undefined) {
                        loadFromApi(resolve, reject);
                        return;
                    }

                    let now = Math.round((new Date()).getTime() / 1000);
                    let lastUpdate = event.target.result.value;

                    if (lastUpdate + CACHE_TIMEOUT < now) {
                        loadFromApi(resolve, () => {
                            loadFromDb(resolve, reject);
                        });
                        return;
                    }

                    loadFromDb(resolve, reject);
                });
            }).catch(() => {
                loadFresh(resolve, reject);
            });
        });
    },
};
