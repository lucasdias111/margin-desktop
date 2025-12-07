<script lang="ts">
    import PrivateChatContent from "$lib/components/content/PrivateChatContent.svelte";

    let privateChat: PrivateChatContent;

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