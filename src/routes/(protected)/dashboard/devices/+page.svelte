<script lang="ts">
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  import { toast } from "svelte-sonner";
  import { goto, invalidateAll } from "$app/navigation";
  import { derived, writable } from "svelte/store";
  import { baseUrl } from "$lib/utils/constants";
  import { page } from "$app/stores";
  import { invalidateCache } from "$lib/stores/cache.js";
  import Label from "$lib/components/ui/label/label.svelte";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { superForm } from "sveltekit-superforms";
  import { zod } from "sveltekit-superforms/adapters";
  import * as AlertDialog from "$lib/components/ui/alert-dialog";
  import { format } from "timeago.js";
  import { debounce } from "throttle-debounce";
  import { createDeviceSchema } from "$lib/domain/validators/Device/createDeviceValidator.js";
  import type { CreateDeviceDTO } from "$lib/domain/valueObjects/CreateDeviceDTO.js";

  export let data;

  const createDialogOpen = writable(false);
  const tokenDialogOpen = writable(false);

  const { form, errors, constraints, validateForm } = superForm(data.form, {
    validators: zod(createDeviceSchema),
  });

  const url = $page.url;

  const dialogOpen = writable(false);

  $: tokenGenerated = false;
  $: token = "";

  let total = data.meta.total;
  let currentPage = 1;

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

  async function handleDelete(id: string) {
    try {
      const response = await fetch(`${baseUrl}/api/v1/device`, {
        method: "DELETE",
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
        invalidateAll();

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

  function handleDeleteClick(event: Event, id: string) {
    event.preventDefault();
    handleDelete(id);
    dialogStore.close(id);
  }

  async function handleDisable(id: string) {
    try {
      const response = await fetch(`${baseUrl}/api/v1/device/disable`, {
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
        invalidateAll();

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

  function handleDisableClick(event: Event, id: string) {
    event.preventDefault();
    handleDisable(id);
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

  const debounceCreateDeviceFunc = debounce(
    5000,
    async (createDevice: CreateDeviceDTO) => {
      await handleCreate(createDevice);
    },
    { atBegin: true }
  );

  async function handleCreateClick(event: Event, data: CreateDeviceDTO) {
    event.preventDefault();
    const result = await validateForm();

    if (result.valid) {
      debounceCreateDeviceFunc(data);
    } else {
      toast.error("Incomplete Form");
    }
  }

  async function handleCreate(device: CreateDeviceDTO) {
    try {
      const response = await fetch(`${baseUrl}/api/v1/device`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.jwt}`,
        },
        body: JSON.stringify({ ...device }),
      });

      if (response.ok) {
        const { data } = await response.json();
        token = data;
        // Invalidate all benefit caches
        invalidateCache();
        invalidateAll();
        createDialogOpen.set(false);
        // goto($page.url.pathname + $page.url.search, { invalidateAll: true });
        tokenDialogOpen.set(true);
      } else {
        const { error } = await response.json();
        toast.error(error);
      }
    } catch (error) {
      toast.error("Server Error");
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success("Token copied to clipboard!");
      })
      .catch((err) => {
        toast.error(`Failed to copy: ${err}`);
      });
  };

  const handleDone = () => {
    copyToClipboard(token);
    invalidateCache();
    invalidateAll();
    // goto($page.url.pathname + $page.url.search, { invalidateAll: true });
    tokenDialogOpen.set(false);
  };
</script>

<Dialog.Root bind:open={$tokenDialogOpen}>
  <!-- <div class="flex p-4 justify-end">
        <Dialog.Trigger class={buttonVariants({ variant: "default" })}>
          Device Token Created
        </Dialog.Trigger>
      </div> -->
  <Dialog.Content class="sm:max-w-[425px]">
    <Dialog.Header>
      <Dialog.Title>Device Token</Dialog.Title>
      <Dialog.Description
        >Device successfully created! Please save the token below, as it will
        not be shown again.</Dialog.Description
      >
      <div>
        <Label for="token" class="text-right">Device Token</Label>
        <div class="flex items-center space-x-2 mt-4">
          <Input id="token" bind:value={token} class="flex-grow" readonly />
          <!-- <Button
            on:click={() => copyToClipboard(token)}
            aria-label="Copy to clipboard"
          >
            <i class="iconoir-copy scale-125"></i>
          </Button> -->
        </div>
      </div>
    </Dialog.Header>
    <Dialog.Footer>
      <Button on:click={handleDone}
        >Done <i class="iconoir-copy scale-125 ml-2"></i></Button
      >
    </Dialog.Footer>
    <!-- <SuperDebug data={$form} /> -->
  </Dialog.Content>
</Dialog.Root>

<div class="flex justify-end">
  <form>
    <Dialog.Root bind:open={$createDialogOpen}>
      <div class="flex p-4 justify-end">
        <Dialog.Trigger class={buttonVariants({ variant: "default" })}>
          Create Device
        </Dialog.Trigger>
      </div>
      <Dialog.Content class="sm:max-w-[425px]">
        <Dialog.Header>
          <Dialog.Title>Add New Device</Dialog.Title>
          <Dialog.Description
            >The device name should uniquely to indicate the room or location
            where students will sign in.</Dialog.Description
          >
        </Dialog.Header>

        <div class="grid gap-4 py-4">
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="name" class="text-right">Name</Label>
            <Input
              id="name"
              bind:value={$form.name}
              placeholder="Enter device name (e.g., Room 101)"
              class="col-span-3"
              aria-invalid={$errors.name ? "true" : undefined}
              {...$constraints.name}
            />
          </div>
        </div>
        <Dialog.Footer>
          <Button
            on:click={async (event) => await handleCreateClick(event, $form)}
          >
            Add Device
          </Button>
        </Dialog.Footer>
        <!-- <SuperDebug data={$form} /> -->
      </Dialog.Content>
    </Dialog.Root>
  </form>
</div>
<main class="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
  <div class="overflow-auto">
    <div class="relative w-full overflow-auto h-screen">
      <table class="w-full caption-bottom text-sm">
        <thead class="[&amp;_tr]:border-b"
          ><tr
            class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
            ><th
              class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0"
              >Name</th
            ><th
              class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0"
              >Status</th
            ><th
              class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0"
              >Expires</th
            ><th
              class="h-12 px-4 align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-right"
              >Actions</th
            ></tr
          ></thead
        ><tbody class="[&amp;_tr:last-child]:border-0">
          {#each data.devices as device}
            <tr
              class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
              ><td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0"
                ><div
                  class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 font-medium"
                >
                  {device.name}
                </div></td
              ><td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
                <div
                  class="inline-flex w-fit items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  data-v0-t="badge"
                >
                  {device.status}
                </div>
              </td>
              <td
                class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 font-medium"
                >{format(device.expires)}</td
              >
              <td
                class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 text-right"
                ><div class="flex items-center justify-end gap-2">
                  <!-- <button
                    class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
                    >Disable</button
                  > -->
                  <button
                    class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
                    color="red"
                  >
                    <i class="iconoir-edit-pencil px-2 scale-125"
                    ></i>Edit</button
                  >

                  {#if device.status == "offline"}
                    <AlertDialog.Root open={$dialogStore.get(device.id)}>
                      <AlertDialog.Trigger
                        class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
                        >Enable</AlertDialog.Trigger
                      >
                      <AlertDialog.Content>
                        <AlertDialog.Header>
                          <AlertDialog.Title>Enable</AlertDialog.Title>
                          <AlertDialog.Description>
                            Are you sure you want to enable this device?
                          </AlertDialog.Description>
                        </AlertDialog.Header>
                        <AlertDialog.Footer>
                          <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
                          <AlertDialog.Action
                            on:click={(event) =>
                              handleEnableClick(event, device.id)}
                            >Continue</AlertDialog.Action
                          >
                        </AlertDialog.Footer>
                      </AlertDialog.Content>
                    </AlertDialog.Root>
                  {:else}
                    <AlertDialog.Root open={$dialogStore.get(device.id)}>
                      <AlertDialog.Trigger
                        class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
                        >Disable</AlertDialog.Trigger
                      >
                      <AlertDialog.Content>
                        <AlertDialog.Header>
                          <AlertDialog.Title>Disable Device</AlertDialog.Title>
                          <AlertDialog.Description>
                            Are you sure you want to disable this device?
                          </AlertDialog.Description>
                        </AlertDialog.Header>
                        <AlertDialog.Footer>
                          <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
                          <AlertDialog.Action
                            on:click={(event) =>
                              handleDisableClick(event, device.id)}
                            >Continue</AlertDialog.Action
                          >
                        </AlertDialog.Footer>
                      </AlertDialog.Content>
                    </AlertDialog.Root>
                  {/if}
                  <AlertDialog.Root open={$dialogStore.get(device.id)}>
                    <AlertDialog.Trigger
                      class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
                      >Delete</AlertDialog.Trigger
                    >
                    <AlertDialog.Content>
                      <AlertDialog.Header>
                        <AlertDialog.Title>Delete Device</AlertDialog.Title>
                        <AlertDialog.Description>
                          Are you sure you want to delete this device?
                        </AlertDialog.Description>
                      </AlertDialog.Header>
                      <AlertDialog.Footer>
                        <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
                        <AlertDialog.Action
                          on:click={(event) =>
                            handleDeleteClick(event, device.id)}
                          >Continue</AlertDialog.Action
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
            disabled={currentPage * 5 >= total}
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
