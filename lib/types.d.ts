/// <reference types="react" />
import { CurrencyToCountryMap, NetworkMap } from './consts';
export interface PaymentDataProps {
    userId: string;
    PBFPubKey: string;
    currency: keyof typeof CurrencyToCountryMap;
    amount: string;
    customer_email: string;
    customer_phone: string;
    customer_firstname: string;
    customer_lastname: string;
    meta?: Array<{
        [metaKey: string]: string;
    }>;
}
export interface RaveViewProps {
    network?: keyof typeof NetworkMap;
    paymentData: PaymentDataProps;
    button: React.ReactElement;
    onSuccess?: () => void;
    onCancel?: () => void;
    onError?: () => void;
}
