import qs from 'qs';
import axios from 'axios';
import Config from '../config/Config';
import dbPromise from '../db/Db.js';

class OAuthService
{
    constructor() {
        this._accessToken = null;
        this._refreshToken = null;
    }

    authenticate(emailAddress, password) {
        return axios.post(Config.API_URL + '/oauth', qs.stringify({
            'grant_type': 'password',
            'client_id': Config.CLIENT_ID,
            'username': emailAddress,
            'password': password,
            'scope': 'USER',
        })).then(this._storeTokens.bind(this));
    }

    request(method, path, data) {
        return this._getAccessToken().then(accessToken => {
            const now = Math.round((new Date()).getTime() / 1000);

            if (accessToken.expiresAt <= now) {
                return this._performRefresh().then(() => {
                    return this._performRequest(method, path, data);
                });
            }

            return this._performRequest(method, path, data);
        });
    }

    _performRequest(method, path, data) {
        return this._getAccessToken().then(accessToken => axios.request({
            method: method,
            url: Config.API_URL + path,
            data: qs.stringify(data),
            headers: {
                Authorization: 'Bearer ' + accessToken.value,
            }
        })).catch(error => {
            if (! error.response) {
                return Promise.reject('unknown');
            }

            if (401 !== error.response.status) {
                return Promise.reject(error.response);
            }

            return this._performRefresh().then(() => this.performRequest(method, path, data));
        });
    }

    _performRefresh() {
        return this._getRefreshToken().then(refreshToken => axios.post(
            Config.API_URL + '/oauth',
            qs.stringify({
                'grant_type': 'refresh_token',
                'client_id': Config.CLIENT_ID,
                'refresh_token': refreshToken,
            })
        )).then(this._storeTokens).catch(() => Promise.reject('authenticate'));
    }

    _storeTokens(response) {
        this._accessToken = {
            value: response.data.access_token,
            expiresAt: Math.round((new Date()).getTime() / 1000) + response.data.expires_in,
        };
        this._refreshToken = response.data.refresh_token;

        return dbPromise.then(db => {
            const transaction = db.transaction('data', 'readwrite');
            const dataObjectStore = transaction.objectStore('data');
            dataObjectStore.put({
                key: 'accessToken',
                value: this._accessToken,
            });
            dataObjectStore.put({
                key: 'refreshToken',
                value: this._refreshToken,
            });

            return transaction.complete;
        });
    }

    _getAccessToken() {
        if (null !== this._accessToken) {
            return Promise.resolve(this._accessToken);
        }

        return dbPromise.then(
            db => db.transaction('data', 'readonly').objectStore('data').get('accessToken')
        ).then(result => {
            if (undefined === result) {
                return Promise.reject();
            }

            this._accessToken = result.value;
            return this._accessToken;
        }).catch(() => Promise.reject('authenticate'));
    }

    _getRefreshToken() {
        if (null !== this._refreshToken) {
            return Promise.resolve(this._refreshToken);
        }

        return dbPromise.then(
            db => db.transaction('data', 'readonly').objectStore('data').get('refreshToken')
        ).then(result => {
            if (undefined === result) {
                return Promise.reject();
            }

            this._refreshToken = result.value;
            return this._refreshToken;
        }).catch(() => Promise.reject('authenticate'));
    }
}

export default new OAuthService();
