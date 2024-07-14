<script lang="ts">
  import { goto, invalidate, invalidateAll } from "$app/navigation";
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import * as Resizable from "$lib/components/ui/resizable";
  import { baseUrl } from "$lib/utils/constants.js";
  import { derived, get } from "svelte/store";
  import { toast } from "svelte-sonner";
  import { Slider } from "$lib/components/ui/slider";
  import { debounce } from "throttle-debounce";

  export let data;

  let error = "";

  let radius = 10000;
  let sliderValue = [radius];
</script>

<main class="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
  <div class="h-screen overflow-auto w-full">
    <Resizable.PaneGroup direction="horizontal" class="rounded-lg border">
      <Resizable.Pane defaultSize={40}>
        <div class="flex h-full items-center justify-center p-6 flex-col">
          Filters
        </div>
      </Resizable.Pane>
      <Resizable.Handle withHandle />
      <Resizable.Pane defaultSize={60}>
        <div class="flex h-full items-center justify-center p-6">Data</div>
      </Resizable.Pane>
    </Resizable.PaneGroup>
  </div>
</main>
