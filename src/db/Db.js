let db = null;
let getDb = () => {
    return new Promise((resolve, reject) => {
        if (null !== db) {
            resolve(db);
        }

        let dbOpenRequest = window.indexedDB.open('app', 2);

        dbOpenRequest.addEventListener('error', () => {
            reject();
        });

        dbOpenRequest.addEventListener('upgradeneeded', (event) => {
            let db = dbOpenRequest.result;
            db.addEventListener('error', () => {
                reject();
            });

            if (event.oldVersion < 1) {
                let eventObjectStore = db.createObjectStore('event', {keyPath: 'id'});
                eventObjectStore.createIndex('title', 'title', {unique: false});
                eventObjectStore.createIndex('startsAt', 'startsAt', {unique: false});
                eventObjectStore.createIndex('endsAt', 'endsAt', {unique: false});
                eventObjectStore.createIndex('description', 'description', {unique: false});
                eventObjectStore.createIndex('room', 'room', {unique: false});

                let dataObjectStore = db.createObjectStore('data', {keyPath: 'key'});
                dataObjectStore.createIndex('value', 'value', {unique: false});
            }

            if (event.oldVersion < 2) {
                let teamObjectStore = db.createObjectStore('team', {keyPath: 'id'});
                teamObjectStore.createIndex('nickname', 'nickname', {unique: false});
                teamObjectStore.createIndex('departments', 'departments', {unique: false});
                teamObjectStore.createIndex('badge', 'badge', {unique: false});
            }
        });

        dbOpenRequest.addEventListener('success', () => {
            db = dbOpenRequest.result;
            resolve(db);
        });
    });
};

export default {
    getTransaction(storeNames, mode) {
        return new Promise((resolve, reject) => {
            getDb().then((db) => {
                resolve(db.transaction(storeNames, mode));
            }).catch(() => {
                reject();
            });
        });
    }
};
