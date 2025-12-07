<script lang="ts">
    import { onMount, onDestroy, tick } from "svelte";
    import type { User } from "$lib/models/user.ts";
    import type { DirectMessage } from "$lib/models/directMessage.ts";
    import { currentUser } from "$lib/stores/userStores";
    import { websocketService } from "$lib/services/websocketService";
    import { chatState } from '$lib/services/chatState.svelte';

    let selectedUser = $state<User | null>(null);
    let messages = $state<DirectMessage[]>([]);
    let messageInput = $state("");
    let messagesContainer: HTMLDivElement;

    $effect(() => {
        tick().then(() => {
            if (messagesContainer) {
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }
        });

        if (chatState.selectedUser) {
            loadMessagesForUser(chatState.selectedUser);
        }
    });

    onMount(() => {
        websocketService.on("SEND_MESSAGE", handleIncomingMessage);
    });

    onDestroy(() => {
        websocketService.off("SEND_MESSAGE", handleIncomingMessage);
    });

    function handleIncomingMessage(data: any) {
        try {
            console.log("Incoming message data:", data);

            const incomingMsg: DirectMessage = JSON.parse(data.payload);

            if (selectedUser && incomingMsg.fromUserId === selectedUser.id) {
                messages = [...messages, incomingMsg];
            } else {
                console.log(
                    "Message not added - sender doesn't match selected user",
                );
            }
        } catch (error) {
            console.error("Error handling incoming message:", error, data);
        }
    }

    function handleSubmit(event: SubmitEvent) {
        event.preventDefault();
        if (selectedUser && messageInput.trim()) {
            sendMessage(selectedUser.id, messageInput);
            messageInput = "";
        }
    }

    async function sendMessage(toUserId: number, messageText: string) {
        try {
            websocketService.send({
                type: "SEND_DIRECT_MESSAGE",
                toUserId: toUserId,
                message: messageText,
            });

            if (!$currentUser) return;

            const newMessage: DirectMessage = {
                id: null,
                fromUserId: $currentUser.id,
                toUserId: toUserId,
                message: messageText,
                isRead: false,
                isEdited: false,
                createdAt: new Date().toISOString(),
            };

            messages = [...messages, newMessage];
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    }

    export async function loadMessagesForUser(user: User) {
        if (selectedUser && selectedUser.id === user.id) return;

        selectedUser = user;

        if (!$currentUser) {
            throw new Error("No user logged in");
        }

        try {
            const token = sessionStorage.getItem("authToken");
            if (!token) {
                throw new Error("No auth token found");
            }

            const response = await fetch(
                `http://localhost:8080/chat_messages/get_chat_history?userId=${$currentUser.id}&toUserId=${user.id}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                },
            );

            if (!response.ok) {
                throw new Error(
                    `Request failed with status: ${response.status}`,
                );
            }

            messages = await response.json();
        } catch (error) {
            console.error("Failed to load messages:", error);
        }
    }
</script>

<div class="chat">
    {#if selectedUser}
        <h1>{selectedUser.username}</h1>
    {:else}
        <h1>No user selected</h1>
    {/if}

    <div class="messages" bind:this={messagesContainer}>
        {#each messages as message}
            <div
                class="message"
                class:sent={message.fromUserId === $currentUser?.id}
            >
                {message.message}
            </div>
        {/each}
    </div>

    <form class="input-area" onsubmit={handleSubmit}>
        <input
            bind:value={messageInput}
            placeholder="Type a message..."
            disabled={!selectedUser}
        />
        <button type="submit" disabled={!selectedUser}>Send</button>
    </form>
</div>

<style>
    .chat {
        flex: 1;
        display: flex;
        flex-direction: column;
    }

    .messages {
        flex: 1;
        padding: 20px;
        overflow-y: auto;
        scroll-behavior: smooth;
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .message {
        padding: 12px 16px;
        border-radius: 18px;
        max-width: 70%;
        word-wrap: break-word;
        width: fit-content;
    }

    .message:not(.sent) {
        background-color: #b47024;
        align-self: flex-start;
        border-bottom-left-radius: 4px;
    }

    .message.sent {
        background-color: #69685f;
        color: #e5e5e5;
        align-self: flex-end;
        border-bottom-right-radius: 4px;
    }

    .input-area {
        display: flex;
        padding: 20px;
        gap: 10px;
        border-top: 1px solid #333;
    }

    .input-area input {
        flex: 1;
        padding: 10px;
        background-color: #2a2a2a;
        border: 1px solid #333;
        border-radius: 4px;
        color: #f6f6f6;
    }

    .input-area button {
        padding: 10px 20px;
    }

    h1 {
        text-align: center;
    }
</style>
