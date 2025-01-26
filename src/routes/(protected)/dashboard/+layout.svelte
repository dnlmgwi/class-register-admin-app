<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { enhance } from "$app/forms";
  import { derived } from "svelte/store";
  import { baseUrl } from "$lib/utils/constants";
  import * as Resizable from "$lib/components/ui/resizable";
  import CirclePlus from "lucide-svelte/icons/circle-plus";
  import Cloud from "lucide-svelte/icons/cloud";
  import CreditCard from "lucide-svelte/icons/credit-card";
  import Github from "lucide-svelte/icons/github";
  import Keyboard from "lucide-svelte/icons/keyboard";
  import LifeBuoy from "lucide-svelte/icons/life-buoy";
  import LogOut from "lucide-svelte/icons/log-out";
  import Mail from "lucide-svelte/icons/mail";
  import MessageSquare from "lucide-svelte/icons/message-square";
  import Plus from "lucide-svelte/icons/plus";
  import Settings from "lucide-svelte/icons/settings";
  import User from "lucide-svelte/icons/user";
  import UserPlus from "lucide-svelte/icons/user-plus";
  import Users from "lucide-svelte/icons/users";
  import logo from "$lib/assets/images/coat_of_arms_of_malawi.webp";
  import { Button } from "$lib/components/ui/button/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
  import { browser } from "$app/environment";
  import type { SubmitFunction } from "@sveltejs/kit";
  import { Toaster } from "$lib/components/ui/sonner";
  export const currentPath = derived(page, ($page) => $page.url.pathname);

  export const pageTitle = derived(currentPath, ($currentPath) => {
    const parts = $currentPath.split("/").filter(Boolean);
    return parts.length
      ? parts[parts.length - 1]
          .replace(/-/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase())
      : "Dashboard";
  });

  export const breadcrumbs = derived(currentPath, ($currentPath) => {
    const parts = $currentPath.split("/").filter(Boolean);
    return parts.map((part, index) => {
      return {
        name: part
          .replace(/-/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase()),
        path: "/" + parts.slice(0, index + 1).join("/"),
      };
    });
  });

  export let data;

  let isSidebarOpen = false;
</script>

<Toaster />
<Resizable.PaneGroup direction="horizontal" class="rounded-lg border w-full ">
  <Resizable.Pane defaultSize={15}>
    <div class="flex h-[60px] items-center border-b px-6">
      <a class="flex items-center gap-2 font-semibold" href="/" rel="ugc">
        <img alt="logo" src={logo} class="w-8" />
        <span>NACIT Hub</span>
      </a>
      <!-- <button
          class="ml-auto h-8 w-8 rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
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
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
          </svg>
          <span class="sr-only">Toggle notifications</span>
        </button> -->
    </div>
    <div class="flex-1 py-2">
      <nav class="grid items-start px-4 text-sm font-medium select-none">
        <a
          class="flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-gray-900"
          href="/dashboard"
          rel="ugc"
          class:active={$currentPath === "/dashboard"}
        >
          <i class="iconoir-report-columns scale-125"></i>
          Dashboard
        </a>
        <a
          class="flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-gray-900"
          href="/dashboard/attendance"
          rel="ugc"
          class:active={$currentPath === "/dashboard/attendance"}
        >
          <i class="iconoir-clipboard-check scale-125"></i>
          Attendance
        </a>
        <a
          class="flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-gray-900"
          href="/dashboard/devices"
          rel="ugc"
          class:active={$currentPath === "/dashboard/devices"}
        >
          <i class="iconoir-electronics-chip scale-125"></i>
          Devices
        </a>

        <!-- <a
          class="flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-gray-900"
          href="/dashboard/insights"
          rel="ugc"
          class:active={$currentPath === "/dashboard/insights"}
        >
          <i class="iconoir-suggestion scale-125"></i>
          Insights
        </a> -->
        <a
          class="flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-gray-900"
          href="/dashboard/modules"
          rel="ugc"
          class:active={$currentPath.includes("/dashboard/modules")}
        >
          <i class="iconoir-book-stack scale-125"></i>
          Modules
        </a>

        <p class="py-2 text-sm font-medium text-gray-600">Manage Accounts</p>
        <a
          class="flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-gray-900"
          href="/dashboard/users/active"
          rel="ugc"
          class:active={$currentPath === "/dashboard/users/active"}
        >
          <i class="iconoir-user-badge-check scale-125"></i>
          Active
        </a>
        <a
          class="flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-gray-900"
          href="/dashboard/users/inactive"
          rel="ugc"
          class:active={$currentPath === "/dashboard/users/inactive"}
        >
          <i class="iconoir-user-xmark scale-125"></i>
          Inactive
        </a>
      </nav>
    </div>
  </Resizable.Pane>
  <Resizable.Handle withHandle />
  <Resizable.Pane defaultSize={85}>
    <div class="flex h-[60px] items-center gap-4 border-b px-6">
      <!-- <a class="lg:hidden" href="/" rel="ugc">
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
          class="h-6 w-6"
        >
          <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"></path>
          <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"
          ></path>
          <path d="M12 3v6"></path>
        </svg>
        <span class="sr-only">Home</span>
      </a> -->
      <div class="flex-1">
        <h1 class="font-semibold text-lg">
          {$pageTitle}
        </h1>
        <!-- <nav class="flex space-x-2">
          {#each $breadcrumbs as { name, path }}
            <div class="flex items-center justify-center">
              <a href={path} class="text-sm text-gray-500 hover:text-gray-900"
                >{name}</a
              >
              {#if $breadcrumbs[$breadcrumbs.length - 1] === { name, path }}
                <i class="iconoir-nav-arrow-right"></i>
              {/if}
            </div>
          {/each}
        </nav> -->
      </div>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild let:builder>
          <Button builders={[builder]} variant="outline"
            ><i class="iconoir-menu-scale px-2 scale-125"></i>Menu</Button
          >
        </DropdownMenu.Trigger>
        <DropdownMenu.Content class="w-56">
          <DropdownMenu.Label>My Account</DropdownMenu.Label>
          <DropdownMenu.Separator />
          <DropdownMenu.Group>
            <DropdownMenu.Item>
              <User class="mr-2 h-4 w-4" />
              <span>Profile</span>
              <DropdownMenu.Shortcut>⇧⌘P</DropdownMenu.Shortcut>
            </DropdownMenu.Item>
            <!-- <DropdownMenu.Item>
              <CreditCard class="mr-2 h-4 w-4" />
              <span>Billing</span>
              <DropdownMenu.Shortcut>⌘B</DropdownMenu.Shortcut>
            </DropdownMenu.Item> -->
            <DropdownMenu.Item>
              <Settings class="mr-2 h-4 w-4" />
              <span>Settings</span>
              <DropdownMenu.Shortcut>⌘S</DropdownMenu.Shortcut>
            </DropdownMenu.Item>
          </DropdownMenu.Group>
          <DropdownMenu.Separator />
          <DropdownMenu.Item>
            <form method="POST" action="/dashboard?/logout">
              <button
                type="submit"
                class="flex w-full items-center gap-3 rounded-lg transition-all hover:text-gray-900"
              >
                <LogOut class="mr-2 h-4 w-4" />
                <span>Log out</span>
                <DropdownMenu.Shortcut>⇧⌘Q</DropdownMenu.Shortcut>
              </button>
            </form>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </div>
    <div class="flex h-full max-h-screen flex-col">
      <slot />
    </div>
  </Resizable.Pane>
</Resizable.PaneGroup>

<style>
  .active {
    background-color: #fee3dd;
    color: #000000;
  }
</style>
