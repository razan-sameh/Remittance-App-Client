import { enmTransactionStatus } from "./enum"

export type typTransaction = {
    id: number,
    sender: string,
    receiver: string,
    amount: number,
    status: enmTransactionStatus,
    fcmToken: string,
    createdAt: string
}

export type typAttachment = {
    uri: string,
    name: string,
    type: string
}

export type typKYC = {
    fullName: string;
    address: string;
    phone: string;
    nationalId: typAttachment;
    selfiePhoto: typAttachment;
}