<script lang="ts">
  import type { User } from "$lib/models/user";
  import ServerSelection from "./ServerSelection.svelte";
  import Navigation from "./Navigation.svelte";
  import UsersList from "./UsersList.svelte";

  interface Props {
    onUserSelected: (user: User) => void;
  }

  let { onUserSelected }: Props = $props();
</script>

<div class="sidebar">
  <ServerSelection />
  <Navigation onContentSelected={(c) => console.log("Selected " + c)} />
  <UsersList {onUserSelected} />
</div>

<style>
  .sidebar {
    width: 250px;
    background-color: #2a2a2a;
    border-right: 1px solid #333;
    padding: 20px;
    overflow-y: auto;
  }

  .sidebar h3 {
    margin: 0 0 15px 0;
  }

  .sidebar ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .sidebar button {
    width: 100%;
    padding: 10px;
    background-color: transparent;
    border: none;
    color: inherit;
    text-align: left;
    cursor: pointer;
    font: inherit;
  }

  .sidebar li {
    padding: 10px;
    margin-bottom: 5px;
    background-color: #333;
    border-radius: 4px;
    cursor: pointer;
  }

  .sidebar li:hover {
    background-color: #3a3a3a;
  }
</style>
