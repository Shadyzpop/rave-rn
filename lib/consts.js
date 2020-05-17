"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrencyToCountryMap = exports.NetworkMap = exports.redirectApi = exports.paymentSandboxApi = exports.paymentApi = void 0;
exports.paymentApi = 'https://api.ravepay.co/flwv3-pug/getpaidx/api/v2/hosted/pay';
exports.paymentSandboxApi = 'https://ravesandboxapi.flutterwave.com/flwv3-pug/getpaidx/api/v2/hosted/pay';
exports.redirectApi = 'https://ravesandboxapi.flutterwave.com/redirection';
exports.NetworkMap = {
    live: exports.paymentApi,
    test: exports.paymentSandboxApi
};
exports.CurrencyToCountryMap = {
    GHS: 'GH',
    KES: 'KE',
    ZAR: 'ZA',
    TZS: 'TZ',
    USD: 'NG',
    EUR: 'NG',
    GBP: 'NG'
};
