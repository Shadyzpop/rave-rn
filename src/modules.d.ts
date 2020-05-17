declare module 'uuid/v4' {
    const uidGenFunc: () => string;
    export default uidGenFunc;
}