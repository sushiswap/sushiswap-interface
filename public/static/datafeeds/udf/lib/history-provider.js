import { getErrorMessage, } from './helpers';
var HistoryProvider = /** @class */ (function () {
    function HistoryProvider(datafeedUrl, requester) {
        this._datafeedUrl = datafeedUrl;
        this._requester = requester;
    }
    HistoryProvider.prototype.getBars = function (symbolInfo, resolution, periodParams) {
        var _this = this;
        var requestParams = {
            symbol: symbolInfo.ticker || '',
            resolution: resolution,
            from: periodParams.from,
            to: periodParams.to,
        };
        if (periodParams.countBack !== undefined) {
            requestParams.countback = periodParams.countBack;
        }
        if (symbolInfo.currency_code !== undefined) {
            requestParams.currencyCode = symbolInfo.currency_code;
        }
        return new Promise(function (resolve, reject) {
            _this._requester.sendRequest(_this._datafeedUrl, 'history', requestParams)
                .then(function (response) {
                if (response.s !== 'ok' && response.s !== 'no_data') {
                    reject(response.errmsg);
                    return;
                }
                var bars = [];
                var meta = {
                    noData: false,
                };
                if (response.s === 'no_data') {
                    meta.noData = true;
                    meta.nextTime = response.nextTime;
                }
                else {
                    var volumePresent = response.v !== undefined;
                    var ohlPresent = response.o !== undefined;
                    for (var i = 0; i < response.t.length; ++i) {
                        var barValue = {
                            time: response.t[i] * 1000,
                            close: parseFloat(response.c[i]),
                            open: parseFloat(response.c[i]),
                            high: parseFloat(response.c[i]),
                            low: parseFloat(response.c[i]),
                        };
                        if (ohlPresent) {
                            barValue.open = parseFloat(response.o[i]);
                            barValue.high = parseFloat(response.h[i]);
                            barValue.low = parseFloat(response.l[i]);
                        }
                        if (volumePresent) {
                            barValue.volume = parseFloat(response.v[i]);
                        }
                        bars.push(barValue);
                    }
                }
                resolve({
                    bars: bars,
                    meta: meta,
                });
            })
                .catch(function (reason) {
                var reasonString = getErrorMessage(reason);
                // tslint:disable-next-line:no-console
                console.warn("HistoryProvider: getBars() failed, error=" + reasonString);
                reject(reasonString);
            });
        });
    };
    return HistoryProvider;
}());
export { HistoryProvider };
