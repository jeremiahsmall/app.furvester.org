import qs from 'qs';
import axios from 'axios';
import Config from '../config/Config';
import Db from "../db/Db";

class OAuthService
{
    constructor() {
        this._accessToken = null;
        this._refreshToken = null;
    }

    authenticate(emailAddress, password) {
        return new Promise((resolve, reject) => {
            axios.post(Config.API_URL + '/oauth', qs.stringify({
                'grant_type': 'password',
                'client_id': Config.CLIENT_ID,
                'username': emailAddress,
                'password': password,
                'scope': 'USER',
            })).then((response) => {
                this._storeTokens(response).then(() => {
                    resolve();
                }).catch(() => {
                    reject();
                });
            }).catch(() => {
                reject();
            });
        });
    }

    request(method, path, data) {
        return new Promise((resolve, reject) => {
            this._getAccessToken().then((accessToken) => {
                let now = Math.round((new Date()).getTime() / 1000);
                let expiresAt = accessToken.expiresAt;

                if (expiresAt <= now) {
                    this._performRefresh().then(() => {
                        this._performRequest(method, path, data).then((response) => {
                            resolve(response);
                        }).catch((reason) => {
                            reject(reason);
                        });
                    }).catch(() => {
                        reject('authenticate');
                    });
                    return;
                }

                this._performRequest(method, path, data).then((response) => {
                    resolve(response);
                }).catch((reason) => {
                    reject(reason);
                });
            }).catch(() => {
                reject('authenticate');
            });
        });
    }

    _performRequest(method, path, data) {
        return new Promise((resolve, reject) => {
            this._getAccessToken().then((accessToken) => {
                axios.request({
                    method: method,
                    url: Config.API_URL + path,
                    data: qs.stringify(data),
                    headers: {
                        Authorization: 'Bearer ' + accessToken.value,
                    },
                }).then((response) => {
                    resolve(response);
                }).catch((error) => {
                    if (! error.response) {
                        reject('unknown');
                        return;
                    }

                    if (401 !== error.response.status) {
                        reject(error.response);
                        return;
                    }

                    this._performRefresh().then(() => {
                        this._performRequest(method, path, data);
                    }).catch(() => {
                        reject('authenticate');
                    });
                });
            }).catch(() => {
                reject('authenticate');
            });
        });
    }

    _performRefresh() {
        return new Promise((resolve, reject) => {
            this._getRefreshToken().then((refreshToken) => {
                axios.post(Config.API_URL + '/oauth', qs.stringify({
                    'grant_type': 'refresh_token',
                    'client_id': Config.CLIENT_ID,
                    'refresh_token': refreshToken,
                })).then((response) => {
                    this._storeTokens(response).then(() => {
                        resolve();
                    }).catch(() => {
                        reject();
                    });
                }).catch(() => {
                    reject();
                });
            }).catch(() => {
                reject();
            });
        });
    }

    _storeTokens(response) {
        return new Promise((resolve, reject) => {
            this._accessToken = {
                value: response.data.access_token,
                expiresAt: Math.round((new Date()).getTime() / 1000) + response.data.expires_in,
            };
            this._refreshToken = response.data.refresh_token;

            Db.getTransaction('data', 'readwrite').then((transaction) => {
                let dataObjectStore = transaction.objectStore('data');
                dataObjectStore.put({
                    key: 'accessToken',
                    value: this._accessToken,
                });
                dataObjectStore.put({
                    key: 'refreshToken',
                    value: this._refreshToken,
                });

                transaction.addEventListener('complete', () => {
                    resolve();
                });
            }).catch(() => {
                reject();
            });
        });
    }

    _getAccessToken() {
        return new Promise((resolve, reject) => {
            if (null !== this._accessToken) {
                resolve(this._accessToken);
                return;
            }

            Db.getTransaction('data', 'readonly').then((transaction) => {
                let dataObjectStore = transaction.objectStore('data');
                let accessTokenRequest = dataObjectStore.get('accessToken');
                accessTokenRequest.addEventListener('success', (event) => {
                    if (event.target.result === undefined) {
                        reject();
                        return;
                    }

                    this._accessToken = event.target.result.value;
                    resolve(this._accessToken);
                });
            }).catch(() => {
                reject();
            });
        });
    }

    _getRefreshToken() {
        return new Promise((resolve, reject) => {
            if (null !== this._refreshToken) {
                resolve(this._refreshToken);
                return;
            }

            Db.getTransaction('data', 'readonly').then((transaction) => {
                let dataObjectStore = transaction.objectStore('data');
                let refreshTokenRequest = dataObjectStore.get('refreshToken');
                refreshTokenRequest.addEventListener('success', (event) => {
                    if (event.target.result === undefined) {
                        reject();
                    }

                    this._refreshToken = event.target.result.value;
                    resolve(this._refreshToken);
                });
            }).catch(() => {
                reject();
            });
        });
    }
}

export default new OAuthService();
