<script lang="ts">
    import type { User } from "$lib/models/user";
    import { invoke } from "@tauri-apps/api/core";
    import { listen } from "@tauri-apps/api/event";
    import { onMount } from "svelte";

      interface Props {
    onUserSelected: (user: User) => void;
  }

  let { onUserSelected }: Props = $props();
  let users = $state<User[]>([]);

  onMount(() => {
    getAllUsersForServer().then((fetchedUsers) => {
      users = fetchedUsers;
    });
  });

  async function getAllUsersForServer(): Promise<User[]> {
    try {
      return await invoke("get_all_users_for_server");
    } catch (error) {
      console.log("Error getting users");
      return [];
    }
  }

  listen<User>("ws_login", (event) => {
    users = [...users, event.payload];
  });

  listen<User>("ws_logout", (event) => {
    users = users.filter((user) => user.id !== event.payload.id);
  });
</script>

<div>
    <h3>Users</h3>
    <ul>
        {#each users as user}
            <li>
                <button onclick={() => onUserSelected(user)}
                    >{user.username}</button
                >
            </li>
        {/each}
    </ul>
</div>

<style>
</style>
