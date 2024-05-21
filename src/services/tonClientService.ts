import { TonClient, Address } from 'ton';
import { JACKPOT_MASTER_CA } from '@/const';
import axios from 'axios';

const client = new TonClient({
    endpoint: 'https://testnet.toncenter.com/api/v2/jsonRPC',
});

const TON_API_URL = 'https://testnet.tonapi.io/v2/blockchain/accounts';
const OP_CODE = '0x2d98c896';

let lastTransactionLT: number | null = null;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const fetchWithRetry = async (fetchFunction: () => Promise<any>, retries: number = 5, delayTime: number = 2000) => {
    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            return await fetchFunction();
        } catch (error: any) {
            if (attempt < retries - 1 && error.response && error.response.status === 429) {
                console.warn(`Rate limit exceeded. Retrying in ${delayTime}ms...`);
                await delay(delayTime);
                delayTime *= 2; // Exponential backoff
            } else {
                throw error;
            }
        }
    }
};

export const getJackPotContractAddresses = async (limit: number = 10, beforeLT: number | null = null) => {
    const url = new URL(`${TON_API_URL}/${encodeURIComponent(JACKPOT_MASTER_CA)}/transactions`);
    url.searchParams.append('limit', limit.toString());
    url.searchParams.append('sort_order', 'desc');
    if (beforeLT) {
        url.searchParams.append('before_lt', beforeLT.toString());
    }

    const response = await fetchWithRetry(async () => {
        return axios.get(url.toString());
    });

    const transactions = response.data.transactions;
    
    const addresses = transactions
        .filter((tx: any) => tx.out_msgs.some((outMsg: any) => outMsg.op_code === OP_CODE))
        .map((tx: any) => {
            const outMsg = tx.out_msgs.find((outMsg: any) => outMsg.op_code === OP_CODE);
            return outMsg.destination.address;
        });

    if (transactions.length > 0) {
        lastTransactionLT = transactions[transactions.length - 1].lt;
    }

    return addresses;
};

export const getJackpotInfo = async (address: string) => {
    const result = await fetchWithRetry(async () => {
        return client.runMethod(
            Address.parse(address),
            'get_info'
        );
    });

    const jackpot = {
        address: Address.parse(address).toString(),
        id: result.stack.readBigNumber().toString(),
        isFinished: result.stack.readBoolean(),
        creator: result.stack.readAddressOpt()?.toString(),
        winner: result.stack.readAddressOpt()?.toString(),
        goalPrice: result.stack.readBigNumber().toString(),
        totalBets: result.stack.readBigNumber().toString(),
        minBet: result.stack.readBigNumber().toString(),
        nft: result.stack.readAddressOpt()?.toString(),
        deadline: result.stack.readBigNumber().toString(),
    };

    return jackpot;
};