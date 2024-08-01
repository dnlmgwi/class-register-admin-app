<script lang="ts">
  import { derived, writable } from "svelte/store";
  import * as AlertDialog from "$lib/components/ui/alert-dialog";
  import { format } from "timeago.js";
  import { baseUrl } from "$lib/utils/constants.js";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { invalidateCache } from "$lib/stores/cache.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  import { toast } from "svelte-sonner";
  import { debounce } from "throttle-debounce";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import Label from "$lib/components/ui/label/label.svelte";
  import { Input } from "$lib/components/ui/input/index.js";

  export let data;

  const dialogOpen = writable(false);

  const approveDialogOpen = writable(false);

  let total = data.meta.total;
  let currentPage = 1;

  let selectedModule: string;

  let selectedDuration: string;

  let durations = ["10", "30", "45"];

  const dialogStore = createDialogStore();

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

  $: $page;

  function goToPage(page: number) {
    currentPage = page;
    goto(`${$currentPath}?page=${page}`);
  }

  async function handleApprove(id: string, moduleId: string) {
    try {
      const response = await fetch(`${baseUrl}/api/v1/attendance/approve`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.jwt}`,
        },
        body: JSON.stringify({ id, moduleId }),
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
    } catch (error: unknown) {
      if (error) {
        toast.error("Server Error");
      }
    }
  }

  const debounceApproveFunc = debounce(
    5000,
    async (id: string, moduleId: string) => {
      await handleApprove(id, moduleId);
    },
    { atBegin: true }
  );

  function handleApproveClick(event: Event, id: string, moduleId: string) {
    event.preventDefault();
    debounceApproveFunc(id, moduleId);
    dialogStore.close(id);
  }

  async function handleEnable(id: string) {
    try {
      const response = await fetch(`${baseUrl}/api/v1/device/enable`, {
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
    } catch (error: unknown) {
      if (error) {
        toast.error("Server Error");
      }
    }
  }

  function handleEnableClick(event: Event, id: string) {
    event.preventDefault();
    handleEnable(id);
    dialogStore.close(id);
  }
</script>

<div class="flex justify-end">
  <form>
    <Dialog.Root bind:open={$approveDialogOpen}>
      <div class="flex p-4 justify-end">
        <Dialog.Trigger class={buttonVariants({ variant: "default" })}>
          Auto Approve
        </Dialog.Trigger>
      </div>
      <Dialog.Content class="sm:max-w-[425px]">
        <Dialog.Header>
          <Dialog.Title>Auto Approve Timer</Dialog.Title>
          <Dialog.Description
            >Check-ins will be approved automatically for the set duration.</Dialog.Description
          >
        </Dialog.Header>

        <div class="grid gap-4 py-4">
          <div class="grid grid-cols-4 items-center gap-4">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild let:builder>
                <Button variant="outline" class="px-2" builders={[builder]}
                  >Duration</Button
                >
              </DropdownMenu.Trigger>
              <DropdownMenu.Content class="w-56">
                <DropdownMenu.Label>Duration</DropdownMenu.Label>
                <DropdownMenu.Separator />
                <DropdownMenu.RadioGroup bind:value={selectedDuration}>
                  {#each durations as duration}
                    <DropdownMenu.RadioItem value={duration}
                      >{duration} min</DropdownMenu.RadioItem
                    >
                  {/each}
                </DropdownMenu.RadioGroup>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          </div>
        </div>
        <Dialog.Footer>
          <Button on:click={async (event) => {}}>Start Timer</Button>
        </Dialog.Footer>
        <!-- <SuperDebug data={$form} /> -->
      </Dialog.Content>
    </Dialog.Root>
  </form>
</div>
<main class="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
  <div class="overflow-auto">
    <div class="relative w-full overflow-auto h-screen">
      {#if data.attendance.length == 0}<div
          class="flex items-center justify-center h-dvh"
        >
          No Check-Ins Found
        </div>
      {:else}
        <table class="w-full caption-bottom text-sm">
          <thead class="[&amp;_tr]:border-b"
            ><tr
              class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
            >
              <th
                class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0"
                >Student ID</th
              ><th
                class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0"
                >First Name</th
              ><th
                class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0"
                >Last Name</th
              ><th
                class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0"
                >Checked In</th
              ><th
                class="h-12 px-4 align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-right"
                >Actions</th
              ></tr
            ></thead
          ><tbody class="[&amp;_tr:last-child]:border-0">
            {#each data.attendance as record}
              <tr
                class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                ><td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
                  <div
                    class="inline-flex w-fit items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    data-v0-t="badge"
                  >
                    {record.studentId}
                  </div>
                </td>
                <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0"
                  ><div
                    class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 font-medium"
                  >
                    {record.firstName}
                  </div></td
                >
                <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0"
                  ><div
                    class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 font-medium"
                  >
                    {record.lastName}
                  </div></td
                >
                <td
                  class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 font-medium"
                  >{format(record.checkInDate)}</td
                >
                <td
                  class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 text-right"
                  ><div class="flex items-center justify-end gap-2">
                    <!-- <button
                    class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
                    >Disable</button
                  > -->
                    <!-- <button
                    class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
                    color="red"
                  >
                    <i class="iconoir-edit-pencil px-2 scale-125"
                    ></i>Edit</button
                  > -->
                    <AlertDialog.Root open={$dialogStore.get(record.id)}>
                      <AlertDialog.Trigger
                        class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
                        >Approve</AlertDialog.Trigger
                      >
                      <AlertDialog.Content>
                        <AlertDialog.Header>
                          <AlertDialog.Title>Approve Check-In</AlertDialog.Title
                          >
                          <AlertDialog.Description>
                            Are you sure you want to approve this check-In?
                          </AlertDialog.Description>
                          <DropdownMenu.Root>
                            <DropdownMenu.Trigger asChild let:builder>
                              <Button variant="outline" builders={[builder]}
                                >Select Module</Button
                              >
                            </DropdownMenu.Trigger>
                            <DropdownMenu.Content class="w-56">
                              <DropdownMenu.Label>Modules</DropdownMenu.Label>
                              <DropdownMenu.Separator />
                              <DropdownMenu.RadioGroup
                                bind:value={selectedModule}
                              >
                                {#each data.modules as module}
                                  <DropdownMenu.RadioItem value={module.id}
                                    >{module.moduleId}</DropdownMenu.RadioItem
                                  >
                                {/each}
                              </DropdownMenu.RadioGroup>
                            </DropdownMenu.Content>
                          </DropdownMenu.Root>
                        </AlertDialog.Header>
                        <AlertDialog.Footer>
                          <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
                          <AlertDialog.Action
                            on:click={(event) =>
                              handleApproveClick(
                                event,
                                record.id,
                                selectedModule
                              )}>Continue</AlertDialog.Action
                          >
                        </AlertDialog.Footer>
                      </AlertDialog.Content>
                    </AlertDialog.Root>
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
