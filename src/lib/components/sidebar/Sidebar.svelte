<script lang="ts">
  import type { User } from "$lib/models/user";
  import ServerSelection from "./ServerSelection.svelte";
  import Navigation from "./Navigation.svelte";
  import UsersList from "./UsersList.svelte";

</script>

<div class="sidebar">
  <ServerSelection />
  <Navigation onContentSelected={(c) => console.log("Selected " + c)} />
  <UsersList/>
</div>

<style>
  .sidebar {
    width: 250px;
    background-color: #2a2a2a;
    border-right: 1px solid #333;
    padding: 20px;
    overflow-y: auto;
  }
</style>
