import axios from 'axios';
import Config from '../config/Config';
import Db from '../db/Db.js';

const CACHE_TIMEOUT = 60 * 60 * 24;

let loadFromApi = (resolve, reject) => {
    return axios.get(Config.API_URL + '/team').then((response) => {
        Db.getTransaction(['team', 'data'], 'readwrite').then((transaction) => {
            let teamObjectStore = transaction.objectStore('team', 'readonly');
            let dataObjectStore = transaction.objectStore('data', 'readonly');

            teamObjectStore.clear();

            response.data.team.forEach((member) => {
                teamObjectStore.add(member);
            });

            dataObjectStore.put({
                key: 'lastTeamUpdate',
                value: Math.round((new Date()).getTime() / 1000),
            });

            transaction.addEventListener('complete', () => {
                resolve(response.data.team);
            });
        }).catch(() => {
            resolve(response.data.team);
        });
    }).catch(() => {
        reject();
    });
};

let loadFromDb = (resolve, reject) => {
    Db.getTransaction('team', 'readonly').then((transaction) => {
        let teamObjectStore = transaction.objectStore('team');
        let team = [];

        teamObjectStore.openCursor().addEventListener('success', (event) => {
            let cursor = event.target.result;

            if (! cursor) {
                resolve(team);
                return;
            }

            team.push({
                id: cursor.value.id,
                nickname: cursor.value.nickname,
                departments: cursor.value.departments,
                badge: cursor.value.badge,
            });
            cursor.continue();
        });
    }).catch(() => {
        reject();
    });
};

export default {
    getTeam() {
        return new Promise((resolve, reject) => {
            Db.getTransaction('data', 'readonly').then((transaction) => {
                let dataObjectStore = transaction.objectStore('data');
                let lastUpdateRequest = dataObjectStore.get('lastTeamUpdate');
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
                loadFromApi(resolve, reject);
            });
        });
    },
};
