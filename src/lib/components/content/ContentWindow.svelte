<script lang="ts">
    import type {User} from "$lib/models/user";
    import PrivateChatContent from "$lib/components/content/PrivateChatContent.svelte";

    let privateChat: PrivateChatContent;

    export async function selectUser(user: User) {
        await privateChat?.loadMessagesForUser(user);
    }
</script>

<div class="content">
    <PrivateChatContent bind:this={privateChat}/>
</div>

<style>
    .content {
        display: flex;
        flex: 1;
        overflow: hidden;
    }
</style>