

export function getStakeholderBlockchainUrl (address: string, chain: string) {
    switch (chain.toLowerCase()) {
        case 'ethereum':
            return `https://etherscan.io/address/${address}`;
        default:
            return `https://opensea.io/`;
    }
}