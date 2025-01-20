<script lang="ts">
    import {Button, buttonVariants} from "$lib/components/ui/button/index.js";
    import {toast} from "svelte-sonner";
    import {goto, invalidate, invalidateAll} from "$app/navigation";
    import {derived, get, writable} from "svelte/store";
    import {baseUrl} from "$lib/utils/constants";
    import {page} from "$app/stores";
    import {invalidateCache} from "$lib/stores/cache.js";
    import Label from "$lib/components/ui/label/label.svelte";
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import {Input} from "$lib/components/ui/input/index.js";
    import SuperDebug, {superForm} from "sveltekit-superforms";
    import {zod} from "sveltekit-superforms/adapters";
    import * as AlertDialog from "$lib/components/ui/alert-dialog";
    import {format} from "timeago.js";
    import {enhance} from '$app/forms';
    import {createDeviceSchema} from "$lib/domain/validators/Device/createDeviceValidator.js";
    import type {CreateDeviceDTO} from "$lib/domain/valueObjects/CreateDeviceDTO.js";

    export let data;

    const createDialogOpen = writable(false);
    const tokenDialogOpen = writable(false);

    const {form, errors, constraints, validateForm} = superForm(data.form, {
        validators: zod(createDeviceSchema),
        onResult: (data) => {
            tokenDialogOpen.set(true);
        }
    });

    const url = $page.url;
    let total = data.meta.total;
    let currentPage = 1;
    let token = "";

    interface DialogState {
        action: string;
        index: number;
    }

    function createDialogStore() {
        const store = writable<Map<string, DialogState>>(new Map());

        return {
            subscribe: store.subscribe,
            open: (id: string, action: string, index: number) => {
                store.update(state => {
                    const newState = new Map(state);
                    newState.set(id, {action, index});
                    return newState;
                });
            },
            close: (id: string) => {
                store.update(state => {
                    const newState = new Map(state);
                    newState.delete(id);
                    return newState;
                });
            },
            isOpen: (id: string, action: string, index: number): boolean => {
                const state = get(store);
                const entry = state.get(id);
                return entry?.action === action && entry?.index === index;
            },
            reset: () => store.set(new Map())
        };
    }

    const dialogStore = createDialogStore();
    const currentPath = derived(page, ($page) => $page.url.pathname);

    // Handler for dialog closure after action
    const handleActionComplete = async (result: any, deviceId: string, index: number) => {
        if (result.type === 'success') {
            dialogStore.close(deviceId);
            toast.success(result.data || 'Operation completed successfully');

            // Try multiple reload strategies
            window.location.reload();
        } else if (result.type === 'failure') {
            toast.error(result.data?.error || 'Operation failed');
        }
    };

    function goToPage(page: number) {
        currentPage = page;
        goto(`${$currentPath}?page=${page}`);
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
        tokenDialogOpen.set(false);
    };
</script>

<Dialog.Root bind:open={$tokenDialogOpen}>
    <Dialog.Content class="sm:max-w-[425px]">
        <Dialog.Header>
            <Dialog.Title>Device Token</Dialog.Title>
            <Dialog.Description>
                Device successfully created! Please save the token below, as it will
                not be shown again.
            </Dialog.Description>
        </Dialog.Header>
        <div>
            <Label for="token" class="text-right">Device Token</Label>
            <div class="flex items-center space-x-2 mt-4">
                <Input id="token" bind:value={token} class="flex-grow" readonly/>
            </div>
        </div>
        <Dialog.Footer>
            <Button on:click={handleDone}>
                Done <i class="iconoir-copy scale-125 ml-2"></i>
            </Button>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>

<div class="flex justify-end">
    <Dialog.Root bind:open={$createDialogOpen}>
        <div class="flex p-4 justify-end">
            <Dialog.Trigger class={buttonVariants({ variant: "default" })}>
                Create Device
            </Dialog.Trigger>
        </div>
        <Dialog.Content class="sm:max-w-[425px]">
            <Dialog.Header>
                <Dialog.Title>Add New Device</Dialog.Title>
                <Dialog.Description>
                    The device name should uniquely indicate the room or location
                    where students will sign in. Name must be at least 5 characters.
                </Dialog.Description>
            </Dialog.Header>

            <form
                    method="POST"
                    action="?/create"
                    use:enhance={() => {
                    return async ({ result }) => {
                        if (result.type === 'success') {
                            createDialogOpen.set(false);
                            toast.success('Device created successfully');
                            await goto($page.url.pathname, { invalidateAll: true,
    keepFocus: true});
                        } else if (result.type === 'failure') {
                            toast.error(result.data.error || 'Failed to create device');
                        }
                    };
                }}
            >
                <div class="grid gap-4 py-4">
                    <div class="grid grid-cols-4 items-center gap-4">
                        <Label for="name" class="text-right">Name</Label>
                        <div class="col-span-3">
                            <Input
                                    id="name"
                                    name="name"
                                    bind:value={$form.name}
                                    placeholder="Enter device name (e.g., Room 101)"
                                    aria-invalid={$errors.name ? "true" : undefined}
                                    class={$errors.name ? "border-red-500" : ""}
                                    {...$constraints.name}
                            />
                            {#if $errors.name}
                                <p class="text-sm text-red-500 mt-1">{$errors.name}</p>
                            {/if}
                        </div>
                    </div>
                </div>
                <Dialog.Footer>
                    <Button type="submit">Add Device</Button>
                </Dialog.Footer>
            </form>
        </Dialog.Content>
    </Dialog.Root>
</div>

<main class="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
    <div class="overflow-auto">
        <div class="relative w-full overflow-auto h-screen">
            <table class="w-full caption-bottom text-sm">
                <thead class="[&amp;_tr]:border-b">
                <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                        Name
                    </th>
                    <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                        Status
                    </th>
                    <th class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                        Expires
                    </th>
                    <th class="h-12 px-4 align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0 text-right">
                        Actions
                    </th>
                </tr>
                </thead>
                <tbody class="[&amp;_tr:last-child]:border-0">
                {#each data.devices as device, index}
                    <tr class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
                            <div class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 font-medium">
                                {device.name}
                            </div>
                        </td>
                        <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
                            <div class="inline-flex w-fit items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                                {device.status}
                            </div>
                        </td>
                        <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 font-medium">
                            {format(device.expires)}
                        </td>
                        <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 text-right">
                            <div class="flex items-center justify-end gap-2">
                                <button class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3">
                                    <i class="iconoir-edit-pencil px-2 scale-125"></i>Edit
                                </button>

                                {#if device.status === "offline"}
                                    <AlertDialog.Root
                                            open={$dialogStore.get(device.id)?.action === 'enable' && $dialogStore.get(device.id)?.index === index}>
                                        <AlertDialog.Trigger
                                                class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
                                                on:click={() => dialogStore.open(device.id, 'enable', index)}>
                                            Enable
                                        </AlertDialog.Trigger>
                                        <AlertDialog.Content>
                                            <AlertDialog.Header>
                                                <AlertDialog.Title>Enable Device</AlertDialog.Title>
                                                <AlertDialog.Description>
                                                    Are you sure you want to enable this device?
                                                </AlertDialog.Description>
                                            </AlertDialog.Header>
                                            <form
                                                    method="POST"
                                                    action="?/enable"
                                                    use:enhance={() => {
                                                        return async ({ result }) => {
                                                            await handleActionComplete(result, device.id, index);
                                                        };
                                                    }}>
                                                <input type="hidden" name="id" value={device.id}/>
                                                <AlertDialog.Footer>
                                                    <AlertDialog.Cancel on:click={() => dialogStore.close(device.id)}>
                                                        Cancel
                                                    </AlertDialog.Cancel>
                                                    <AlertDialog.Action type="submit">Continue</AlertDialog.Action>
                                                </AlertDialog.Footer>
                                            </form>
                                        </AlertDialog.Content>
                                    </AlertDialog.Root>
                                {:else}
                                    <AlertDialog.Root
                                            open={$dialogStore.get(device.id)?.action === 'disable' &&
              $dialogStore.get(device.id)?.index === index}>
                                        <AlertDialog.Trigger
                                                class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
                                                on:click={() => dialogStore.open(device.id, 'disable',index)}>
                                            Disable
                                        </AlertDialog.Trigger>
                                        <AlertDialog.Content>
                                            <AlertDialog.Header>
                                                <AlertDialog.Title>Disable Device</AlertDialog.Title>
                                                <AlertDialog.Description>
                                                    Are you sure you want to disable this device?
                                                </AlertDialog.Description>
                                            </AlertDialog.Header>
                                            <form
                                                    method="POST"
                                                    action="?/disable"
                                                    use:enhance={() => {
                                                        return async ({ result }) => {
                                                           await handleActionComplete(result, device.id, index);
                                                        };
                                                    }}>
                                                <input type="hidden" name="id" value={device.id}/>
                                                <AlertDialog.Footer>
                                                    <AlertDialog.Cancel on:click={() => dialogStore.close(device.id)}>
                                                        Cancel
                                                    </AlertDialog.Cancel>
                                                    <AlertDialog.Action type="submit">Continue</AlertDialog.Action>
                                                </AlertDialog.Footer>
                                            </form>
                                        </AlertDialog.Content>
                                    </AlertDialog.Root>
                                {/if}

                                <AlertDialog.Root
                                        open={$dialogStore.get(device.id)?.action === 'delete' &&
              $dialogStore.get(device.id)?.index === index}>
                                    <AlertDialog.Trigger
                                            class="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3"
                                            on:click={() => dialogStore.open(device.id, 'delete',index)}>
                                        Delete
                                    </AlertDialog.Trigger>
                                    <AlertDialog.Content>
                                        <AlertDialog.Header>
                                            <AlertDialog.Title>Delete Device</AlertDialog.Title>
                                            <AlertDialog.Description>
                                                Are you sure you want to delete this device?
                                            </AlertDialog.Description>
                                        </AlertDialog.Header>
                                        <form
                                                method="POST"
                                                action="?/delete"
                                                use:enhance={() => {
                                                    return async ({ result }) => {
                                                        await handleActionComplete(result, device.id, index);
                                                    };
                                                }}>
                                            <input type="hidden" name="id" value={device.id}/>
                                            <AlertDialog.Footer>
                                                <AlertDialog.Cancel on:click={() => dialogStore.close(device.id)}>
                                                    Cancel
                                                </AlertDialog.Cancel>
                                                <AlertDialog.Action type="submit">Continue</AlertDialog.Action>
                                            </AlertDialog.Footer>
                                        </form>
                                    </AlertDialog.Content>
                                </AlertDialog.Root>
                            </div>
                        </td>
                    </tr>
                {/each}
                </tbody>
            </table>

            <!-- Pagination -->
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