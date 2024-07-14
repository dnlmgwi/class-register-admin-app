<script lang="ts">
  import { inactiveSession, tokenExpired } from "$lib/stores/tokenStore.js";
  import * as AlertDialog from "$lib/components/ui/alert-dialog";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { baseUrl } from "$lib/utils/constants.js";

  let showInactiveDialog = false;
  let showTokenExpiredDialog = false;
  let inactivityTime = 900000; // 15 minutes

  let timeout: number | undefined;

  // Subscribe to the store to get the token expiration state
  inactiveSession.subscribe((value) => {
    showInactiveDialog = value;
  });

  tokenExpired.subscribe((value) => {
    showTokenExpiredDialog = value;
  });

  async function handleLogout() {
    const response = await fetch(`${baseUrl}/api/v1/auth/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${data.jwt}`,
        "Content-Type": "application/json",
      },
      // credentials: "include",
    });

    if (response.ok) {
      await goto("/auth");
    } else {
      alert("Logout failed");
    }
  }

  function handleLogoutClick(event: CustomEvent) {
    event.preventDefault();
    handleLogout().catch((error) => {
      alert(error);
    });
  }

  function closeDialog(event: CustomEvent) {
    showInactiveDialog = false;
    inactiveSession.set(false); // Reset the store
    handleLogoutClick(event);
  }

  function resetTimer() {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      inactiveSession.set(true); // Set token as expired after inactivity
    }, inactivityTime);
  }

  // Reset the timer on user activity
  function setupInactivityTimer() {
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keypress", resetTimer);
    window.addEventListener("click", resetTimer);
    window.addEventListener("scroll", resetTimer);
  }

  onMount(() => {
    setupInactivityTimer();
    resetTimer();
  });

  export let data;
</script>

{#if data.jwt}
  <AlertDialog.Root bind:open={$inactiveSession}>
    <AlertDialog.Content>
      <AlertDialog.Header>
        <AlertDialog.Title>Inactive Session</AlertDialog.Title>
        <AlertDialog.Description>
          This Session has been Inactive. Please login again.
        </AlertDialog.Description>
      </AlertDialog.Header>
      <AlertDialog.Footer>
        <AlertDialog.Action on:click={(event) => closeDialog(event)}
          >Login</AlertDialog.Action
        >
      </AlertDialog.Footer>
    </AlertDialog.Content>
  </AlertDialog.Root>

  <AlertDialog.Root bind:open={$tokenExpired}>
    <AlertDialog.Content>
      <AlertDialog.Header>
        <AlertDialog.Title>Your Session Has Expired</AlertDialog.Title>
        <AlertDialog.Description>
          Session Expired. Please login again.
        </AlertDialog.Description>
      </AlertDialog.Header>
      <AlertDialog.Footer>
        <AlertDialog.Action on:click={(event) => closeDialog(event)}
          >Login</AlertDialog.Action
        >
      </AlertDialog.Footer>
    </AlertDialog.Content>
  </AlertDialog.Root>

  <slot />
{:else if data.jwt === undefined}
  <!-- Loading state while waiting for data -->
  <div class="flex items-center justify-center min-h-screen bg-gray-50">
    <div class="w-full max-w-md">
      <div class="inline-flex items-center justify-center w-full">
        <p>Loading...</p>
      </div>
    </div>
  </div>
{:else}
  <div class="flex items-center justify-center min-h-screen bg-gray-50">
    <div class="w-full max-w-md">
      <div class="inline-flex items-center justify-center w-full">
        <p>Redirecting to login...</p>
      </div>
    </div>
  </div>
  <script>
    window.location.href = "/auth";
  </script>
{/if}
