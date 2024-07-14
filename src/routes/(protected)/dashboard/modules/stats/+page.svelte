<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { derived } from "svelte/store";

  export let data;

  let total = data.meta.total;
  let currentPage: number = 1;

  const currentPath = derived(page, ($page) => $page.url.pathname);

  $: $page;

  function goToPage(page: number) {
    currentPage = page;
    goto(`${$currentPath}?page=${page}`);
  }
</script>

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
              >Student ID</th
            ><th
              class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0"
              >First Name</th
            ><th
              class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0"
              >Last Name</th
            ><th
              class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0"
              >Total</th
            ><th
              class="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0"
              >Rating</th
            ></tr
          ></thead
        ><tbody class="[&amp;_tr:last-child]:border-0">
          {#each data.stats as module}
            <tr
              class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
              ><td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
                <div
                  class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 font-medium"
                >
                  {module.studentId}
                </div>
              </td>
              <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
                <div
                  class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 font-medium"
                >
                  {module.firstName}
                </div>
              </td>
              <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
                <div
                  class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 font-medium"
                >
                  {module.lastName}
                </div>
              </td>
              <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
                <div
                  class="inline-flex w-fit items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  data-v0-t="badge"
                >
                  {module.count}
                </div>
              </td>
              <td class="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
                <div
                  class="inline-flex w-fit items-center whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  data-v0-t="badge"
                >
                  {module.rating}
                </div>
              </td>
            </tr>
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
