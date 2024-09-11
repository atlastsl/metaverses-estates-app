import {Operation} from "./operations.dto.ts";


export function roundAmount (value: number, digits: number = 4): number {
    return Math.round(value * Math.pow(10, digits)) / Math.pow(10, digits);
}

export function displayAmount (value: number, digits: number = 2, displayCurrency = false): string {
    let locale = 'en-US', splitIndex = 1, currency = 'USD';
    if (displayCurrency) {
        let formatter = new Intl.NumberFormat(locale, {style: 'currency', currency: currency, currencyDisplay: 'symbol', minimumFractionDigits: 2, maximumFractionDigits: digits});
        return formatter.format(value);
    } else {
        let formatter = new Intl.NumberFormat(locale, {style: 'currency', currency: currency, currencyDisplay: 'code', minimumFractionDigits: 2, maximumFractionDigits: digits});
        let displayParts = formatter.format(value).split(" ");
        console.log(displayParts)
        return displayParts[splitIndex];
    }
}

export function getOperationTotalAmount (operation: Operation, displayCurrency = false): string {
    const amount = (operation.amount || [])
        .map(amount => amount.value_usd)
        .filter(x => x !== undefined)
        .reduce((a, b) => a + b, 0);
    return displayAmount(amount, 2, displayCurrency);
}

export function getOperationTotalFees (operation: Operation, displayCurrency = false): string {
    const fees =  (operation.fees || [])
        .map(amount => amount.value_usd)
        .filter(x => x !== undefined)
        .reduce((a, b) => a + b, 0);
    return displayAmount(fees, 2, displayCurrency);
}

export function getOperationBlockchainUrl (operation: Operation): string {
    switch (operation.chain.toLowerCase()) {
        case 'ethereum':
            return `https://etherscan.io/tx/${operation.transaction_hash}`;
        default:
            return `https://opensea.io/`;
    }
}