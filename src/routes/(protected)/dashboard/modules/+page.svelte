<script lang="ts">
  import { derived, writable } from "svelte/store";
  import * as AlertDialog from "$lib/components/ui/alert-dialog";
  import { format } from "timeago.js";
  import { baseUrl } from "$lib/utils/constants.js";
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  import { page } from "$app/stores";
  import { goto, invalidateAll } from "$app/navigation";
  import { invalidateCache } from "$lib/stores/cache.js";
  import { toast } from "svelte-sonner";
  import type { CreateModuleDTO } from "$lib/domain/valueObjects/CreateModuleDTO.js";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import Label from "$lib/components/ui/label/label.svelte";
  import { Input } from "$lib/components/ui/input/index.js";
  import { superForm } from "sveltekit-superforms";
  import { zod } from "sveltekit-superforms/adapters";
  import { debounce } from "throttle-debounce";
  import { createModuleSchema } from "$lib/domain/validators/Module/createModuleValidator.js";

  export let data;

  const { form, errors, constraints, validateForm } = superForm(data.form, {
    validators: zod(createModuleSchema),
  });

  const createDialogOpen = writable(false);

  let total = data.meta.total;
  let currentPage: number = 1;
  let subPage: string;

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

  function goToSubPage(page: string, id: string) {
    subPage = page;
    goto(`${$currentPath}/${page}?id=${id}`);
  }

  async function handleDelete(id: string) {
    try {
      const response = await fetch(`${baseUrl}/api/v1/module`, {
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

  async function handleEnable(id: string) {
    try {
      const response = await fetch(`${baseUrl}/api/v1/module/enable`, {
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

  const debounceCreateModuleFunc = debounce(
    5000,
    async (createModule: CreateModuleDTO) => {
      await handleCreate(createModule);
    },
    { atBegin: true }
  );

  async function handleCreateClick(event: Event, data: CreateModuleDTO) {
    event.preventDefault();
    const result = await validateForm();

    if (result.valid) {
      debounceCreateModuleFunc(data);
    } else {
      toast.error("Incomplete Form");
    }
  }

  async function handleCreate(module: CreateModuleDTO) {
    try {
      const response = await fetch(`${baseUrl}/api/v1/module`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.jwt}`,
        },
        body: JSON.stringify({ ...module }),
      });

      if (response.ok) {
        const { data } = await response.json();
        toast.success(data);
        // Invalidate all benefit caches
        invalidateCache();
        invalidateAll();
        createDialogOpen.set(false);
        // goto($page.url.pathname + $page.url.search, { invalidateAll: true });
      } else {
        const { error } = await response.json();
        toast.error(error);
      }
    } catch (error) {
      toast.error("Server Error");
    }
  }
</script>

<div class="flex justify-end">
  <form>
    <Dialog.Root bind:open={$createDialogOpen}>
      <div class="flex p-4 justify-end">
        <Dialog.Trigger class={buttonVariants({ variant: "default" })}>
          Add Module
        </Dialog.Trigger>
      </div>
      <Dialog.Content class="sm:max-w-[425px]">
        <Dialog.Header>
          <Dialog.Title>Add New Module</Dialog.Title>
          <Dialog.Description
            >Modules are completed per semester, and repeat every year.</Dialog.Description
          >
        </Dialog.Header>

        <div class="grid gap-4 py-4">
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="moduleId" class="text-right">Module ID</Label>
            <Input
              id="moduleId"
              bind:value={$form.moduleId}
              placeholder="Enter Module ID (e.g., DDW)"
              class="col-span-3"
              aria-invalid={$errors.moduleId ? "true" : undefined}
              {...$constraints.moduleId}
            />
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
            <Label for="moduleName" class="text-right">Module Name</Label>
            <Input
              id="moduleName"
              bind:value={$form.moduleName}
              placeholder="Enter Module name (e.g., Design and Developing Websites)"
              class="col-span-3"
              aria-invalid={$errors.moduleName ? "true" : undefined}
              {...$constraints.moduleName}
            />
          </div>
        </div>
        <Dialog.Footer>
          <Button
            on:click={async (event) => await handleCreateClick(event, $form)}
          >
            Add Module
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
          >
            <th
              class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0"
              >ID</th
            ><th
              class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0"
              >Name</th
            ><th
              class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0"
              >Created</th
            ><th
              class="h-12 px-4 align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-right"
              >Actions</th
            ></tr
          ></thead
        ><tbody class="[&amp;_tr:last-child]:border-0">
          {#each data.modules as module}
            <tr
              class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
              ><td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
                <div
                  class="inline-flex w-fit items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  data-v0-t="badge"
                >
                  {module.moduleId}
                </div>
              </td>
              <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0"
                ><div
                  class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 font-medium"
                >
                  {module.moduleName}
                </div></td
              >
              <td
                class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 font-medium"
                >{format(module.createdAt)}</td
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
                    on:click={() => goToSubPage("stats", module.id)}
                  >
                    <i class="iconoir-graph-up px-2 scale-125"></i>Stats</button
                  >
                  <AlertDialog.Root open={$dialogStore.get(module.id)}>
                    <AlertDialog.Trigger
                      class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
                      >Options</AlertDialog.Trigger
                    >
                    <AlertDialog.Content>
                      <AlertDialog.Header>
                        <AlertDialog.Title
                          >Review the class performance</AlertDialog.Title
                        >
                        <AlertDialog.Description>
                          download stats in your preferred format.
                        </AlertDialog.Description>
                      </AlertDialog.Header>
                      <AlertDialog.Footer>
                        <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
                        <AlertDialog.Action>Download CSV</AlertDialog.Action>
                        <AlertDialog.Action>Download PDF</AlertDialog.Action>
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
