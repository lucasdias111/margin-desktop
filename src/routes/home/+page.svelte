<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import Sidebar from "$lib/components/sidebar/Sidebar.svelte";
    import ContentWindow from "$lib/components/content/ContentWindow.svelte";
    import Header from "$lib/components/MainHeader.svelte";
    import type {User} from "$lib/models/user";
    import { currentUser } from '$lib/stores/userStores';
    import { websocketService } from '$lib/services/websocketService';

    let messageInput = $state("");
    let content: ContentWindow;

    onMount(() => {
        getCurrentUser();
        websocketService.connect();
    });

    onDestroy(() => {
        websocketService.disconnect();
    });

    async function getCurrentUser() {
        try {
            const token = sessionStorage.getItem('authToken');
            if (!token) {
                console.error("No token found. Please login first.");
                return;
            }

            const response = await fetch("http://localhost:8080/users/me", {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Request failed with status: ${response.status}`);
            }

            const user: User = await response.json();
            currentUser.set(user);
            console.log("Current user loaded:", user);
        } catch (error) {
            console.error("Error getting current user:", error);
        }
    }

</script>

<div class="app">
  <Header />
  <div class="content">
    <Sidebar/>
    <ContentWindow bind:this={content}/>
  </div>
</div>

<style>
  .app {
    height: 97.5vh;
    display: flex;
    flex-direction: column;
  }

  .content {
    display: flex;
    flex: 1;
    overflow: hidden;
  }
</style>