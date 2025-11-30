import type { User } from "$lib/models/user";
import type { Channel } from "$lib/models/channel";

export type ChatViewType = 'private' | 'channel' | 'explore';

export interface PrivateChatView {
    type: 'private';
    user: User;
}

export interface ChannelView {
    type: 'channel';
    channel: Channel;
}

export interface ExploreView {
    type: 'explore';
}

export type ChatView = PrivateChatView | ChannelView | ExploreView;