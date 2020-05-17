import React, { useState, useEffect } from 'react';
import { View, Text, Modal, ActivityIndicator, TouchableOpacity } from 'react-native';
import { WebView, WebViewMessageEvent, WebViewNavigation } from 'react-native-webview';

import axios from 'axios';
import uuid4 from 'uuid/v4';

import { RaveViewProps } from 'types';
import { CurrencyToCountryMap, paymentApi, redirectApi } from 'consts';

export const Rave = (props: RaveViewProps) => {
    const [loading, setLoading] = useState(true);
    const [visible, setVisible] = useState(false);
    const [url, setUrl] = useState('');
    
    const PayButton = React.cloneElement(props.button, { onPress: () => setVisible(true) });
    const { userId, ...raveData } = props.paymentData;

    const hideAndCancel = () => {
        setVisible(false);
        setLoading(false);
        setUrl('');
    }

    const loadUrl = async () => {
        const constructedData = {
            ...raveData,
            country: CurrencyToCountryMap[raveData.currency],
            txref: `rave-${uuid4()}`,
            redirect_url: redirectApi
        };
        
        try {
            const { data } = await axios.post(paymentApi, constructedData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            setLoading(false);
            setUrl(data.link);
        } catch (e) {
            hideAndCancel();
            if (props.onError) {
                props.onError();
            }
        }
    }

    const handleMessage = async (event: WebViewMessageEvent | WebViewNavigation) => {
        hideAndCancel();
        if ((event as object).hasOwnProperty('nativeEvent')) {
            // from onMessage
            const data = JSON.parse((event as WebViewMessageEvent).nativeEvent.data);
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
        } else {
            // from onRedirect (default succeeds)
            if (props.onSuccess) {
                props.onSuccess();
            }
        }

    }
    
    return (
        <View>
            <Modal visible={visible} animationType="slide" transparent={false}>
                <WebView
                    javaScriptEnabled={true}
                    originWhitelist={['*']}
                    source={{ uri: url }}
                    onLoadStart={async (event) => {
                        if (event.nativeEvent.url !== redirectApi) {
                            await loadUrl();
                        }
                    }}
                    onMessage={handleMessage}
                    onNavigationStateChange={(e) => {
                        if (e.url === redirectApi) {
                            handleMessage(e);
                        }
                    }}
                />
                {loading && (
                    <View>
                        <ActivityIndicator size="large" />
                        <TouchableOpacity onPress={hideAndCancel}>
                            <Text>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </Modal>
            {PayButton}
        </View>
    );
}
