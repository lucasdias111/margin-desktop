interface DirectMessage {
    id: number | null;
    fromUserId: number;
    toUserId: number;
    message: string;
    isRead: boolean;
    isEdited: boolean;
    createdAt: string | null;
}
