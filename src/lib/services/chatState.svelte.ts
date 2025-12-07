import type { User } from '$lib/models/user';

class ChatState {
  selectedUser = $state<User | null>(null);
  
  selectUser(user: User) {
    this.selectedUser = user;
  }
}

export const chatState = new ChatState();