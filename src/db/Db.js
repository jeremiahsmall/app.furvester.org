import idb from 'idb';

const dbPromise = idb.open('app', 3, upgradeDb => {
    switch (upgradeDb.oldVersion) {
        case 0:
            let eventObjectStore = upgradeDb.createObjectStore('event', {keyPath: 'id'});
            eventObjectStore.createIndex('title', 'title', {unique: false});
            eventObjectStore.createIndex('startsAt', 'startsAt', {unique: false});
            eventObjectStore.createIndex('endsAt', 'endsAt', {unique: false});
            eventObjectStore.createIndex('description', 'description', {unique: false});
            eventObjectStore.createIndex('room', 'room', {unique: false});

            let dataObjectStore = upgradeDb.createObjectStore('data', {keyPath: 'key'});
            dataObjectStore.createIndex('value', 'value', {unique: false});;

        case 1:
            let teamObjectStore = upgradeDb.createObjectStore('team', {keyPath: 'id'});
            teamObjectStore.createIndex('nickname', 'nickname', {unique: false});
            teamObjectStore.createIndex('departments', 'departments', {unique: false});
            teamObjectStore.createIndex('badge', 'badge', {unique: false});

        case 2:
            upgradeDb.deleteObjectStore('event');
            upgradeDb.deleteObjectStore('team');
    }
});

export default dbPromise;
