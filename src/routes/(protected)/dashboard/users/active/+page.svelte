<script lang="ts">
  import { goto } from "$app/navigation";
  import { toast } from "svelte-sonner";
  import { derived, writable } from "svelte/store";
  import { baseUrl } from "$lib/utils/constants";
  import { page } from "$app/stores";
  import { invalidateCache } from "$lib/stores/cache.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import { SelectUserRole } from "$lib/utils/enums/UserRole";
  import { onMount } from "svelte";
  import Label from "$lib/components/ui/label/label.svelte";
  import * as Dialog from "$lib/components/ui/dialog/index.js";
  import { Input } from "$lib/components/ui/input/index.js";
  import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
  import { superForm } from "sveltekit-superforms";
  import { zod } from "sveltekit-superforms/adapters";
  import * as AlertDialog from "$lib/components/ui/alert-dialog";
  import { debounce } from "throttle-debounce";
  import { createStudentSchema } from "$lib/domain/validators/User/createStudentValidator.js";
  import type { StudentDTO } from "$lib/domain/valueObjects/StudentDTO.js";

  export let data;

  const createDialogOpen = writable(false);
  let total = data.meta.total;
  let currentPage = 1;

  const dialogStore = createDialogStore();

  const {
    form: createForm,
    errors: createFormErrors,
    constraints: createFormConstraints,
    validateForm: validateCreateForm,
  } = superForm(data.form, {
    validators: zod(createStudentSchema),
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

  async function handleDeactivate(id: string) {
    try {
      const response = await fetch(`${baseUrl}/api/v1/user/deactivate`, {
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

  async function handleRoute() {
    history.back();
  }

  const currentSearchParams = derived(page, ($page) => $page.url.searchParams);

  let selectedRole: SelectUserRole = SelectUserRole.Student;

  $: if (selectedRole) {
    updateUrlAndFetch();
  }

  const updateUrlAndFetch = () => {
    url.searchParams.set("role", selectedRole);
    goto(`${$currentPath}${url.search}`, {
      replaceState: true,
    }).then(() => {
      // Invalidate all benefit caches
      invalidateCache();

      // Reload the current page to fetch fresh data
      // goto($page.url.pathname + $page.url.search, { invalidateAll: true });
    });
  };

  onMount(() => {
    url.searchParams.set("role", selectedRole);
  });

  const roles = Object.values(SelectUserRole);

  const disableDialogOpen = writable(new Array(data.users.length).fill(false));

  const claimDialogOpen = writable(new Array(data.users.length).fill(false));

  function showToast(message: string, type: "success" | "error" | "info") {
    toast[type](message);
  }

  // async function handleClaim(claimBenefit: ClaimBenefitDTO, index: number) {
  //   const response = await fetch(`${baseUrl}/api/v1/benefit/claim`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${data.jwt}`,
  //     },
  //     // credentials: "include",
  //     body: JSON.stringify({ ...claimBenefit }),
  //   });

  //   if (response.ok) {
  //     const { data } = await response.json();
  //     toast(data);
  //     // Invalidate all benefit caches
  //     invalidateCache();

  //     // Reload the current page to fetch fresh data
  //     goto($page.url.pathname + $page.url.search, { invalidateAll: true });
  //   } else {
  //     const { error } = await response.json();
  //     toast.error(error);
  //     toggleClaimDialog(index);
  //   }
  // }

  // function handleClaimClick(
  //   event: Event,
  //   data: ClaimBenefitDTO,
  //   index: number
  // ) {
  //   event.preventDefault();
  //   debounceClaimBenefitFunc(data, index);
  //   toggleClaimDialog(index);
  // }

  // const debounceClaimBenefitFunc = debounce(
  //   5000,
  //   async (data: ClaimBenefitDTO, index: number) => {
  //     await handleClaim(data, index);
  //   },
  //   { atBegin: true }
  // );

  $: $page;

  // const dialogStore = createDialogStore();

  // function createDialogStore() {
  //   const { subscribe, update } = writable(new Map<string, boolean>());

  //   return {
  //     subscribe,
  //     open: (id: string) => update((state) => new Map(state).set(id, true)),
  //     close: (id: string) => update((state) => new Map(state).set(id, false)),
  //     reset: () => update(() => new Map()),
  //   };
  // }

  const debounceCreateUserFunc = debounce(
    5000,
    async (createStudent: StudentDTO) => {
      await handleCreate(createStudent);
    },
    { atBegin: true }
  );

  async function handleCreateClick(event: Event, data: StudentDTO) {
    event.preventDefault();
    const result = await validateCreateForm();

    if (result.valid) {
      debounceCreateUserFunc(data);
      createDialogOpen.set(false);
    } else {
      toast.error("Incomplete Form");
    }
  }

  async function handleCreate(createStudent: StudentDTO) {
    const response = await fetch(`${baseUrl}/api/v1/auth/student/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.jwt}`,
      },
      body: JSON.stringify({ ...createStudent }),
    });

    if (response.ok) {
      createDialogOpen.set(false);
      const { data } = await response.json();
      toast(data);

      // Invalidate all benefit caches
      invalidateCache();

      // Reload the current page to fetch fresh data
      goto($page.url.pathname + $page.url.search, { invalidateAll: true });
    } else {
      const { error } = await response.json();
      toast.error(error);
    }
  }

  function handleDisableClick(event: Event, id: string) {
    event.preventDefault();
    handleDisable(id);
    dialogStore.close(id);
  }

  async function handleDisable(id: string) {
    const response = await fetch(`${baseUrl}/api/v1/benefit/disable`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${data.jwt}`,
      },

      body: JSON.stringify({ id }),
    });

    if (response.ok) {
      const { data } = await response.json();
      toast.success(data);

      // Invalidate all benefit caches
      invalidateCache();

      // Reload the current page to fetch fresh data
      goto($page.url.pathname + $page.url.search, { invalidateAll: true });
    } else {
      const { error } = await response.json();
      toast.error(error);
    }
  }

  function toggleDisableDialog(index: number) {
    disableDialogOpen.update((n) => {
      const updated = [...n];
      updated[index] = !updated[index];
      return updated;
    });
  }

  function toggleClaimDialog(index: number) {
    claimDialogOpen.update((n) => {
      const updated = [...n];
      updated[index] = !updated[index];
      return updated;
    });
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
    <div class="flex items-center gap-4 justify-end">
      <!-- <div class="relative flex-1">
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
          class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-50"
          ><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"
          ></path></svg
        ><input
          class="flex h-10 border border-input ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full rounded-lg bg-white px-10 py-2 text-sm shadow-sm"
          type="search"
          placeholder="Search users..."
          value=""
        />
      </div> -->
      <form>
        <Dialog.Root bind:open={$createDialogOpen}>
          <div class="flex p-4 justify-end">
            <Dialog.Trigger class={buttonVariants({ variant: "default" })}>
              Add User
            </Dialog.Trigger>
          </div>
          <Dialog.Content class="sm:max-w-[425px]">
            <Dialog.Header>
              <Dialog.Title>Adding User</Dialog.Title>
              <Dialog.Description>
                Benefits must be made available once created. Click save when
                you're done.
              </Dialog.Description>
            </Dialog.Header>

            <div class="grid gap-4 py-4">
              <div class="grid grid-cols-4 items-center gap-4">
                <Label for="firstName" class="text-right">First Name</Label>
                <Input
                  id="firstName"
                  bind:value={$createForm.firstName}
                  class="col-span-3"
                  aria-invalid={$createFormErrors.firstName
                    ? "true"
                    : undefined}
                  {...$createFormConstraints.firstName}
                />
              </div>
              <div class="grid grid-cols-4 items-center gap-4">
                <Label for="lastName" class="text-right">lastName</Label>
                <Input
                  id="lastName"
                  bind:value={$createForm.lastName}
                  class="col-span-3"
                  aria-invalid={$createFormErrors.lastName ? "true" : undefined}
                  {...$createFormConstraints.lastName}
                />
              </div>
              <!-- <div class="grid grid-cols-4 items-center gap-4">
                <Label for="type" class="text-right">Type</Label>
                <div class="col-span-3">
                  {#each roles as role}
                    <div>
                      <input
                        type="radio"
                        id={`type-${role}`}
                        name="type"
                        value={role}
                        bind:group={$createForm.role}
                      />
                      <label for={`type-${role}`}>{role}</label>
                    </div>
                  {/each}
                </div>
              </div> -->
            </div>
            <Dialog.Footer>
              <Button
                on:click={async (event) =>
                  await handleCreateClick(event, $createForm)}
              >
                Create Benefit
              </Button>
            </Dialog.Footer>
            <!-- <SuperDebug data={$form} /> -->
          </Dialog.Content>
        </Dialog.Root>
      </form>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild let:builder>
          <Button variant="outline" builders={[builder]}>Select Role</Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content class="w-56">
          <DropdownMenu.Label>User Roles</DropdownMenu.Label>
          <DropdownMenu.Separator />
          <DropdownMenu.RadioGroup bind:value={selectedRole}>
            {#each roles as role}
              <DropdownMenu.RadioItem value={role}
                >{role}</DropdownMenu.RadioItem
              >
            {/each}
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
      <div class="flex items-center gap-2"></div>
    </div>
    <div class="overflow-hidden">
      <div class="relative w-full h-screen">
        <table class="w-full caption-bottom text-sm">
          <thead class="[&amp;_tr]:border-b"
            ><tr
              class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
              ><th
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
                  >{user.profile.studentId}</td
                ><td
                  class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 font-medium"
                  >{user.profile.firstName}</td
                ><td
                  class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 font-medium"
                  >{user.profile.lastName}</td
                ><td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0"
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
                        >Disable</AlertDialog.Trigger
                      >
                      <AlertDialog.Content>
                        <AlertDialog.Header>
                          <AlertDialog.Title>Disable</AlertDialog.Title>
                          <AlertDialog.Description>
                            Are you sure you want to disable this account?
                          </AlertDialog.Description>
                        </AlertDialog.Header>
                        <AlertDialog.Footer>
                          <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
                          <AlertDialog.Action
                            on:click={(event) =>
                              handleDisableClick(event, user.id)}
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
