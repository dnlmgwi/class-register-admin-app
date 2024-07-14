<script lang="ts">
  export let data;
</script>

<main class="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
  <div
    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8"
  >
    <div
      class="rounded-lg border bg-card text-card-foreground shadow-sm"
      data-v0-t="card"
    >
      <div class="flex flex-col space-y-1.5 p-6">
        <h3
          class="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight"
        >
          Attendance
        </h3>
        <p class="text-sm text-muted-foreground">
          The total number of students in class.
        </p>
      </div>
      <div class="p-6">
        <div class="text-4xl font-bold">{data.stats.totalUsers}</div>
      </div>
    </div>
    <div
      class="rounded-lg border bg-card text-card-foreground shadow-sm"
      data-v0-t="card"
    >
      <div class="flex flex-col space-y-1.5 p-6">
        <h3
          class="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight"
        >
          Absent
        </h3>
        <p class="text-sm text-muted-foreground">
          The total number of absent students.
        </p>
      </div>
      <div class="p-6">
        <div class="text-4xl font-bold">{data.stats.totalBeneficiaries}</div>
      </div>
    </div>
    <div
      class="rounded-lg border bg-card text-card-foreground shadow-sm"
      data-v0-t="card"
    >
      <div class="flex flex-col space-y-1.5 p-6">
        <h3
          class="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight"
        >
          Late
        </h3>
        <p class="text-sm text-muted-foreground">
          The total number late students.
        </p>
      </div>
      <div class="p-6">
        <div class="text-4xl font-bold">{data.stats.totalBenefits}</div>
      </div>
    </div>
    <div
      class="rounded-lg border bg-card text-card-foreground shadow-sm"
      data-v0-t="card"
    >
      <div class="flex flex-col space-y-1.5 p-6">
        <h3
          class="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight"
        >
          Avg. Entry Time
        </h3>
        <p class="text-sm text-muted-foreground">
          Avg. time student enter in class.
        </p>
      </div>
      <div class="p-6">
        <div class="text-4xl font-bold">{data.stats.totalClaims}</div>
      </div>
    </div>
  </div>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
    <div
      class="rounded-lg border bg-card text-card-foreground shadow-sm"
      data-v0-t="card"
    >
      <div class="flex flex-col space-y-1.5 p-6">
        <h3
          class="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight"
        >
          Recent Check-Ins
        </h3>
        <p class="text-sm text-muted-foreground">Recent activity.</p>
      </div>
      <div class="p-6">
        <div class="w-full aspect-[4/3]">
          <div style="width: 100%; height: 100%;">
            <!-- <Map latitude={lat} longitude={long} {markers} interactive={true}
            ></Map> -->
          </div>
        </div>
      </div>
    </div>
    <div
      class="rounded-lg border bg-card text-card-foreground shadow-sm"
      data-v0-t="card"
    >
      <div class="flex flex-col space-y-1.5 p-6">
        <h3
          class="whitespace-nowrap text-2xl font-semibold leading-none tracking-tight"
        >
          Top Stats
        </h3>
        <p class="text-sm text-muted-foreground">
          An overview of the class performance.
        </p>
      </div>
      <div class="p-6">
        <div class="w-full aspect-[4/3]">
          <div style="width: 100%; height: 100%;">
            <div style="position: relative;">
              <!-- Claims By Type  -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</main>
