<script lang="ts">
  import { page } from "$app/stores";
  import { goto, afterNavigate } from "$app/navigation";
  import { base } from "$app/paths";

  let previousPage: string = base;

  afterNavigate(({ from }) => {
    previousPage = from?.url.pathname || previousPage;
  });

  async function handleRoute() {
    await goto(previousPage);
  }
</script>

<div
  class="flex flex-col items-center justify-center min-h-[100dvh] gap-6 px-4 md:px-6"
>
  <div class="flex flex-col items-center justify-center gap-4">
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
      class="h-12 w-12 text-red-500"
    >
      <path
        d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"
      ></path>
      <path d="M12 9v4"></path>
      <path d="M12 17h.01"></path>
    </svg>
    <h1 class="text-9xl font-bold tracking-tighter text-gray-900">
      {$page.status}
    </h1>
    <h1 class="text-2xl font-bold">Oops, something went wrong!</h1>

    <p class="text-gray-500 dark:text-gray-400">
      {$page.error?.message}
    </p>
    <p class="text-gray-500 dark:text-gray-400">
      We're sorry, but an unexpected error has occurred. Please try again later.
    </p>
  </div>
  <button
    class="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-6 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50"
    on:click|preventDefault={() => history.back()}
  >
    Go to Homepage
  </button>
</div>
