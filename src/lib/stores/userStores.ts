import { writable } from 'svelte/store';
import type { User } from '$lib/models/user';

export const currentUser = writable<User | null>(null);