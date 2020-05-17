export const paymentApi = 'https://api.ravepay.co/flwv3-pug/getpaidx/api/v2/hosted/pay';
export const paymentSandboxApi = 'https://ravesandboxapi.flutterwave.com/flwv3-pug/getpaidx/api/v2/hosted/pay';
export const redirectApi = 'https://ravesandboxapi.flutterwave.com/redirection';

export const NetworkMap = {
    live: paymentApi,
    test: paymentSandboxApi
};

export const CurrencyToCountryMap = {
    GHS: 'GH',
    KES: 'KE',
    ZAR: 'ZA',
    TZS: 'TZ',
    USD: 'NG',
    EUR: 'NG',
    GBP: 'NG'
};
