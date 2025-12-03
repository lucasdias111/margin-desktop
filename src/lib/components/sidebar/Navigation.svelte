<script lang="ts">
    interface Props {
        onContentSelected: (contentType: string) => void;
    }

    let { onContentSelected }: Props = $props();
</script>

<div class="button-group">
    <button onclick={() => onContentSelected("privateConversation")}>Private conversations</button>
    <button onclick={() => onContentSelected("spaces")}>Spaces</button>
    <button onclick={() => onContentSelected("explore")}>Explore</button>
</div>
<hr />

<style>
    .button-group {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .button-group button {
        font-size: 1rem;
        width: 100%;
        background: #3a3737;
        cursor: pointer;
        transition: background 0.2s;
    }
</style>
