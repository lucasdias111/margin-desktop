<script lang="ts">
  import { goto } from "$app/navigation";
    import { authenticatedFetch, loginFetch } from "$lib/services/api";

  let username = $state("");
  let password = $state("");
  let loginResponse = $state("");

  function handleLogin(event: SubmitEvent) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget as HTMLFormElement);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    login(username, password);
  }

  async function login(username: string, password: string) {
    try {
      const response = await loginFetch(username, password);

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const authResponse = await response.json();

      if (!authResponse.token) {
        throw new Error("No token in response");
      }

      sessionStorage.setItem("authToken", authResponse.token);

      loginResponse = "Login successful";
      console.log("Logged in");

      goto("/home");
      return true;
    } catch (error: any) {
      loginResponse = error.message || String(error);
      return false;
    }
  }

  function getStoredToken(): string | null {
    return sessionStorage.getItem("authToken");
  }

  function clearToken() {
    sessionStorage.removeItem("authToken");
  }
</script>

<div class="container">
  <h1>margin</h1>
  <form class="row" onsubmit={handleLogin}>
    <input type="text" name="username" bind:value={username} />
    <input type="password" name="password" bind:value={password} />
    <button type="submit">Login</button>
  </form>
  <p>{loginResponse}</p>
</div>

<style>
  .container {
    margin: 0;
    padding-top: 10vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
  }

  .row {
    display: flex;
    justify-content: center;
  }

  h1,
  p {
    text-align: center;
  }
</style>
