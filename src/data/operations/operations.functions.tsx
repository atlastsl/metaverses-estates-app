import {Operation} from "./operations.dto.ts";


export function roundAmount (value: number, digits: number = 4): number {
    return Math.round(value * Math.pow(10, digits)) / Math.pow(10, digits);
}

export function getOperationTotalAmount (operation: Operation): number {
    const amount = (operation.amount || [])
        .map(amount => amount.value_usd)
        .filter(x => x !== undefined)
        .reduce((a, b) => a + b, 0);
    return roundAmount(amount);
}

export function getOperationTotalFees (operation: Operation): number {
    const fees =  (operation.fees || [])
        .map(amount => amount.value_usd)
        .filter(x => x !== undefined)
        .reduce((a, b) => a + b, 0);
    return roundAmount(fees);
}

export function getOperationBlockchainUrl (operation: Operation): string {
    switch (operation.chain.toLowerCase()) {
        case 'ethereum':
            return `https://etherscan.io/tx/${operation.transaction_hash}`;
        default:
            return `https://opensea.io/`;
    }
}