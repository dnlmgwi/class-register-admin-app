<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
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

  import { Button } from "$lib/components/ui/button/index.js";
  import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
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

  function handleLogoutClick(event: MouseEvent) {
    event.preventDefault();
    handleLogout().catch((error) => {
      alert(error);
    });
  }

  let isSidebarOpen = false;
</script>

<Resizable.PaneGroup direction="horizontal" class="rounded-lg border w-full ">
  <Resizable.Pane defaultSize={15}>
    <div class="flex h-[60px] items-center border-b px-6">
      <a class="flex items-center gap-2 font-semibold" href="/" rel="ugc">
        <svg
          class="w-10 h-10"
          viewBox="0 0 195 160"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clip-path="url(#clip0_103_6626)">
            <path
              d="M194.255 52.3612C194.255 49.8332 193.251 47.4088 191.464 45.6212C189.677 43.8337 187.253 42.8295 184.725 42.8295C182.198 42.8295 179.774 43.8337 177.986 45.6212C176.199 47.4088 175.195 49.8332 175.195 52.3612C175.195 100.793 135.804 140.191 87.3858 140.191C69.2674 140.167 51.8981 132.957 39.0874 120.142C26.2767 107.328 19.0706 89.9541 19.0496 71.8325C19.065 57.8392 24.6297 44.4235 34.5227 34.5288C44.4157 24.634 57.8291 19.0684 71.8199 19.053C82.5076 19.0656 92.7539 23.3176 100.311 30.8762C107.868 38.4348 112.12 48.6829 112.132 59.3724C112.122 67.4209 108.92 75.1368 103.229 80.8265C97.537 86.5162 89.8208 89.7149 81.7736 89.7205C75.8426 89.7149 70.1562 87.3559 65.9623 83.1613C61.7685 78.9668 59.4099 73.2793 59.4043 67.3473C59.4099 63.1076 61.0963 59.0432 64.0937 56.0453C67.0911 53.0474 71.1548 51.3607 75.3937 51.3551C78.2804 51.3579 81.0481 52.5057 83.0897 54.5467C85.1314 56.5877 86.2803 59.3554 86.2845 62.2425C86.2845 64.7705 87.2886 67.1949 89.0758 68.9825C90.8631 70.77 93.2871 71.7743 95.8146 71.7743C98.3422 71.7743 100.766 70.77 102.553 68.9825C104.341 67.1949 105.345 64.7705 105.345 62.2425C105.335 54.3067 102.179 46.6985 96.5699 41.086C90.9604 35.4736 83.3547 32.3147 75.4202 32.3021C66.1289 32.3105 57.2204 36.0051 50.6494 42.5753C44.0785 49.1454 40.3818 58.0544 40.3706 67.3473C40.3818 78.328 44.747 88.856 52.5087 96.622C60.2704 104.388 70.7948 108.758 81.7736 108.773C94.8686 108.758 107.423 103.548 116.682 94.2872C125.942 85.026 131.151 72.4696 131.166 59.3724C131.148 43.6342 124.89 28.5456 113.765 17.4155C102.64 6.28542 87.5554 0.0224225 71.8199 0C32.2171 0 0 32.2227 0 71.8325C0 120.021 39.2058 159.244 87.3964 159.244C146.319 159.244 194.255 111.294 194.255 52.3612Z"
              fill="currentColor"
            />
            <path
              d="M194.255 52.3612C194.255 49.8332 193.251 47.4088 191.464 45.6212C189.677 43.8337 187.253 42.8295 184.725 42.8295C182.198 42.8295 179.774 43.8337 177.986 45.6212C176.199 47.4088 175.195 49.8332 175.195 52.3612C175.195 100.793 135.804 140.191 87.3858 140.191C69.2674 140.167 51.8981 132.957 39.0874 120.142C26.2767 107.328 19.0706 89.9541 19.0496 71.8325C19.065 57.8392 24.6297 44.4235 34.5227 34.5288C44.4157 24.634 57.8291 19.0684 71.8199 19.053C82.5076 19.0656 92.7539 23.3176 100.311 30.8762C107.868 38.4348 112.12 48.6829 112.132 59.3724C112.122 67.4209 108.92 75.1368 103.229 80.8265C97.537 86.5162 89.8208 89.7149 81.7736 89.7205C75.8426 89.7149 70.1562 87.3559 65.9623 83.1613C61.7685 78.9668 59.4099 73.2793 59.4043 67.3473C59.4099 63.1076 61.0963 59.0432 64.0937 56.0453C67.0911 53.0474 71.1548 51.3607 75.3937 51.3551C78.2804 51.3579 81.0481 52.5057 83.0897 54.5467C85.1314 56.5877 86.2803 59.3554 86.2845 62.2425C86.2845 64.7705 87.2886 67.1949 89.0758 68.9825C90.8631 70.77 93.2871 71.7743 95.8146 71.7743C98.3422 71.7743 100.766 70.77 102.553 68.9825C104.341 67.1949 105.345 64.7705 105.345 62.2425C105.335 54.3067 102.179 46.6985 96.5699 41.086C90.9604 35.4736 83.3547 32.3147 75.4202 32.3021C66.1289 32.3105 57.2204 36.0051 50.6494 42.5753C44.0785 49.1454 40.3818 58.0544 40.3706 67.3473C40.3818 78.328 44.747 88.856 52.5087 96.622C60.2704 104.388 70.7948 108.758 81.7736 108.773C94.8686 108.758 107.423 103.548 116.682 94.2872C125.942 85.026 131.151 72.4696 131.166 59.3724C131.148 43.6342 124.89 28.5456 113.765 17.4155C102.64 6.28542 87.5554 0.0224225 71.8199 0C32.2171 0 0 32.2227 0 71.8325C0 120.021 39.2058 159.244 87.3964 159.244C146.319 159.244 194.255 111.294 194.255 52.3612Z"
              fill="currentColor"
              fill-opacity="0.2"
            />
          </g>
          <defs>
            <clipPath id="clip0_103_6626">
              <rect width="194.255" height="159.244" fill="white" />
            </clipPath>
          </defs>
        </svg>
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

        <p class="py-2 text-sm font-medium text-gray-600">Accounts</p>
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
            <DropdownMenu.Item>
              <CreditCard class="mr-2 h-4 w-4" />
              <span>Billing</span>
              <DropdownMenu.Shortcut>⌘B</DropdownMenu.Shortcut>
            </DropdownMenu.Item>
            <DropdownMenu.Item>
              <Settings class="mr-2 h-4 w-4" />
              <span>Settings</span>
              <DropdownMenu.Shortcut>⌘S</DropdownMenu.Shortcut>
            </DropdownMenu.Item>
          </DropdownMenu.Group>
          <DropdownMenu.Separator />
          <DropdownMenu.Item>
            <button
              on:click={(event) => handleLogoutClick(event)}
              class="flex items-center gap-3 rounded-lg transition-all hover:text-gray-900"
            >
              <LogOut class="mr-2 h-4 w-4" />
              <span>Log out</span>
              <DropdownMenu.Shortcut>⇧⌘Q</DropdownMenu.Shortcut>
            </button>
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
