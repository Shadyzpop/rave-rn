"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rave = void 0;
const react_1 = __importStar(require("react"));
const react_native_1 = require("react-native");
const react_native_webview_1 = require("react-native-webview");
const axios_1 = __importDefault(require("axios"));
const v4_1 = __importDefault(require("uuid/v4"));
const consts_1 = require("consts");
exports.Rave = (props) => {
    const [loading, setLoading] = react_1.useState(true);
    const [visible, setVisible] = react_1.useState(false);
    const [url, setUrl] = react_1.useState('');
    const PayButton = react_1.default.cloneElement(props.button, { onPress: () => setVisible(true) });
    const { userId, ...raveData } = props.paymentData;
    const hideAndCancel = () => {
        setVisible(false);
        setLoading(false);
        setUrl('');
    };
    const loadUrl = async () => {
        const constructedData = {
            ...raveData,
            country: consts_1.CurrencyToCountryMap[raveData.currency],
            txref: `rave-${v4_1.default()}`,
            redirect_url: consts_1.redirectApi
        };
        try {
            const { data } = await axios_1.default.post(consts_1.paymentApi, constructedData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setLoading(false);
            setUrl(data.link);
        }
        catch (e) {
            hideAndCancel();
            if (props.onError) {
                props.onError();
            }
        }
    };
    const handleMessage = async (event) => {
        hideAndCancel();
        if (event.hasOwnProperty('nativeEvent')) {
            // from onMessage
            const data = JSON.parse(event.nativeEvent.data);
            if (data.event === 'cancelled') {
                if (props.onCancel) {
                    props.onCancel();
                }
            }
            if (data.event === 'successful') {
                if (props.onSuccess) {
                    props.onSuccess();
                }
            }
        }
        else {
            // from onRedirect (default succeeds)
            if (props.onSuccess) {
                props.onSuccess();
            }
        }
    };
    return (<react_native_1.View>
            <react_native_1.Modal visible={visible} animationType="slide" transparent={false}>
                <react_native_webview_1.WebView javaScriptEnabled={true} originWhitelist={['*']} source={{ uri: url }} onLoadStart={async (event) => {
        if (event.nativeEvent.url !== consts_1.redirectApi) {
            await loadUrl();
        }
    }} onMessage={handleMessage} onNavigationStateChange={(e) => {
        if (e.url === consts_1.redirectApi) {
            handleMessage(e);
        }
    }}/>
                {loading && (<react_native_1.View>
                        <react_native_1.ActivityIndicator size="large"/>
                        <react_native_1.TouchableOpacity onPress={hideAndCancel}>
                            <react_native_1.Text>Cancel</react_native_1.Text>
                        </react_native_1.TouchableOpacity>
                    </react_native_1.View>)}
            </react_native_1.Modal>
            {PayButton}
        </react_native_1.View>);
};
