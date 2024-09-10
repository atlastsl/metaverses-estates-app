import {Operation} from "./operations.dto.ts";


export function roundAmount (value: number, digits: number = 4): number {
    return Math.round(value * Math.pow(10, digits)) / Math.pow(10, digits);
}

export function displayAmount (value: number, digits: number = 4, displayCurrency = false): string {
    let locale = 'en-US', splitIndex = 1, currency = 'USD';
    let formatter = new Intl.NumberFormat(locale, {style: 'currency', currency: currency, currencyDisplay: 'symbol', minimumFractionDigits: 2, maximumFractionDigits: digits});
    if (displayCurrency) {
        return formatter.format(value);
    } else {
        let displayParts = formatter.format(value).split(" ");
        return displayParts[splitIndex];
    }
}

export function getOperationTotalAmount (operation: Operation, displayCurrency = false): string {
    const amount = (operation.amount || [])
        .map(amount => amount.value_usd)
        .filter(x => x !== undefined)
        .reduce((a, b) => a + b, 0);
    return displayAmount(amount, 4, displayCurrency);
}

export function getOperationTotalFees (operation: Operation, displayCurrency = false): number {
    const fees =  (operation.fees || [])
        .map(amount => amount.value_usd)
        .filter(x => x !== undefined)
        .reduce((a, b) => a + b, 0);
    return displayAmount(fees, 4, displayCurrency);
}

export function getOperationBlockchainUrl (operation: Operation): string {
    switch (operation.chain.toLowerCase()) {
        case 'ethereum':
            return `https://etherscan.io/tx/${operation.transaction_hash}`;
        default:
            return `https://opensea.io/`;
    }
}