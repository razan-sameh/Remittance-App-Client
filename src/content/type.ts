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
