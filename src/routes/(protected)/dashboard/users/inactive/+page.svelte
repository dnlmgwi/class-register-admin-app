<script lang="ts">
  import { goto, invalidateAll } from "$app/navigation";
  import { toast } from "svelte-sonner";
  import * as AlertDialog from "$lib/components/ui/alert-dialog";
  import { derived, writable } from "svelte/store";
  import { baseUrl } from "$lib/utils/constants.js";
  import { page } from "$app/stores";
  import { invalidateCache } from "$lib/stores/cache.js";
  import { SelectUserRole } from "$lib/utils/enums/UserRole.js";
  import { onMount } from "svelte";

  export let data;

  let total = data.meta.total;
  let currentPage = 1;

  const dialogStore = createDialogStore();

  let selectedRole: SelectUserRole = SelectUserRole.Student;

  // $: if (selectedRole) {
  //   updateUrlAndFetch();
  // }

  // const updateUrlAndFetch = () => {
  //   url.searchParams.set("role", selectedRole);
  //   goto(`${$currentPath}${url.search}`, {
  //     replaceState: true,
  //   }).then(() => {
  //     // Invalidate all benefit caches
  //     invalidateCache();

  //     // Reload the current page to fetch fresh data
  //     // goto($page.url.pathname + $page.url.search, { invalidateAll: true });
  //   });
  // };

  onMount(() => {
    url.searchParams.set("role", selectedRole);
  });

  function createDialogStore() {
    const { subscribe, update } = writable(new Map<string, boolean>());

    return {
      subscribe,
      open: (id: string) => update((state) => new Map(state).set(id, true)),
      close: (id: string) => update((state) => new Map(state).set(id, false)),
      reset: () => update(() => new Map()),
    };
  }

  const currentPath = derived(page, ($page) => $page.url.pathname);

  const url = $page.url;

  $: $page;

  function goToPage(page: number) {
    currentPage = page;
    goto(`${$currentPath}?page=${page}`);
  }

  async function handleActivate(id: string) {
    try {
      const response = await fetch(`${baseUrl}/api/v1/user/restore`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.jwt}`,
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        const { data } = await response.json();
        toast(data);

        // Invalidate caches
        invalidateCache();

        // Reload the current page to fetch fresh data
        goto($page.url.pathname + $page.url.search, { invalidateAll: true });
      } else {
        const { error } = await response.json();
        toast.error(error);
      }
    } catch (error: unknown) {}
  }

  function handleActiveClick(event: Event, id: string) {
    event.preventDefault();
    handleActivate(id);
    dialogStore.close(id);
  }

  async function handleRoute() {
    history.back();
  }
</script>

{#if data.unauthorized}
  <div class="flex h-screen p-6 flex-col">
    <main class="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div class="relative w-full h-screen overflow-auto">
        <h1>Unauthorized</h1>
        <p>Sorry, you don't have permission to view this page.</p>
        <button
          class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
          on:click={handleRoute}
        >
          Go Back
        </button>
      </div>
    </main>
  </div>
{:else}
  <main class="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
    <!-- <div class="flex items-center gap-4">
    <div class="relative flex-1">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500  text-gray-400"
        ><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"
        ></path></svg
      ><input
        class="flex h-10 border border-input ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full rounded-lg bg-white px-10 py-2 text-sm shadow-sm  bg-gray-950"
        type="search"
        placeholder="Search users..."
        value=""
      />
    </div>
    <div class="flex items-center gap-2"></div>
  </div> -->
    <div class="overflow-auto">
      <div class="relative w-full h-screen">
        {#if data.users.length == 0}<div
            class="flex items-center justify-center"
          >
            No Users Found
          </div>
        {:else}
          <table class="w-full caption-bottom text-sm">
            <thead class="[&amp;_tr]:border-b"
              ><tr
                class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                ><th
                  class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0"
                  >ID</th
                ><th
                  class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0"
                  >Role</th
                ><th
                  class="h-12 px-4 align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-right"
                  >Actions</th
                ></tr
              ></thead
            ><tbody class="[&amp;_tr:last-child]:border-0">
              {#each data.users as user}
                <tr
                  class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                  ><td
                    class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 font-medium"
                    >{user.id}</td
                  ><td
                    class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0"
                    ><div
                      class="inline-flex w-fit items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      data-v0-t="badge"
                    >
                      {user.role}
                    </div></td
                  ><td
                    class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 text-right"
                    ><div class="flex items-center justify-end gap-2">
                      <!-- <button
                    on:click={(event) => handleViewClick(event, user.id)}
                    class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
                    >View</button
                  > -->
                      <AlertDialog.Root open={$dialogStore.get(user.id)}>
                        <AlertDialog.Trigger
                          class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
                          >Enable</AlertDialog.Trigger
                        >
                        <AlertDialog.Content>
                          <AlertDialog.Header>
                            <AlertDialog.Title>Enable</AlertDialog.Title>
                            <AlertDialog.Description>
                              Are you sure you want to enable this account?
                            </AlertDialog.Description>
                          </AlertDialog.Header>
                          <AlertDialog.Footer>
                            <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
                            <AlertDialog.Action
                              on:click={(event) =>
                                handleActiveClick(event, user.id)}
                              >Continue</AlertDialog.Action
                            >
                          </AlertDialog.Footer>
                        </AlertDialog.Content>
                      </AlertDialog.Root>
                      <!-- <button
                    on:click={(event) => handleDisableClick(event, user.id)}
                    class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
                    >Disable</button
                  > -->
                      <!-- <button
                    class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
                    color="red">Edit</button
                  > -->
                    </div></td
                  ></tr
                >
              {/each}
            </tbody>
          </table>
        {/if}
        <div class="flex items-end justify-end w-full pt-3">
          <div class="flex items-center gap-2">
            <button
              class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-Input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
              on:click={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="h-4 w-4"
              >
                <path d="m15 18-6-6 6-6"></path>
              </svg>
            </button>
            <button
              class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-md px-3"
            >
              {currentPage}
            </button>
            <button
              class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-Input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
              on:click={() => goToPage(currentPage + 1)}
              disabled={currentPage * 10 >= total}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="h-4 w-4"
              >
                <path d="m9 18 6-6-6-6"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </main>
{/if}
