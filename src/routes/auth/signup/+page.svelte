<!-- <script lang="ts">
  import { goto } from "$app/navigation";
  import { createUserSchema } from "$lib/domain/validators/User/createUserValidator.js";
  import { baseUrl } from "$lib/utils/constants";
  import { toast } from "svelte-sonner";
  import { superForm } from "sveltekit-superforms";
  import { zod } from "sveltekit-superforms/adapters";

  export let data;

  const { form, errors, constraints, validateForm } = superForm(data.form, {
    validators: zod(createUserSchema),
  });

  async function handleLogin(event: Event) {
    event.preventDefault();

    const response = await fetch(`${baseUrl}/api/v1/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...$form }),
      // credentials: "include",
    });

    if (response.ok) {
      goto("/auth");
    } else {
      const { error } = await response.json();
      toast.error(error);
    }
  }
</script>

<div class="flex items-center justify-center min-h-screen bg-gray-50">
  <form on:submit|preventDefault={handleLogin} class="w-full max-w-md">
    <div class="mx-auto max-w-md space-y-6">
      <div class="space-y-2 text-center">
        <h1 class="text-3xl font-bold">Sign Up</h1>
        <p class="text-gray-400"></p>
      </div>
      <div class="space-y-4">
        <div class="space-y-2">
          <label
            class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            for="phone"
          >
            Phone
          </label>
          <input
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            id="phone"
            placeholder="123-456-7890"
            required
            type="tel"
            bind:value={$form.phone}
          />
        </div>
        <div class="space-y-2">
          <label
            class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            for="password"
          >
            Password
          </label>
          <input
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            id="password"
            required
            type="password"
            bind:value={$form.password}
          />
        </div>
        <div class="space-y-2">
          <label
            class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            for="password"
          >
            Gender
          </label>
          <select
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            id="gender"
            required
            bind:value={$form.gender}
            ><option value="male">male</option>
            <option value="female">female</option>
            <option value="other">other</option>
          </select>
        </div>
        <div class="space-y-2">
          <label
            class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            for="password"
          >
            Role
          </label>
          <select
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            id="role"
            required
            bind:value={$form.role}
            >
            <option value="admin">Admin</option>
            <option value="benefactor">Benefactor</option>
            <option value="auditor">Auditor</option>
          </select>
        </div>
        <div class="space-y-2">
          <label
            class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            for="password"
          >
            Age Group
          </label>
          <select
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            id="ageGroup"
            required
            bind:value={$form.ageGroup}
            ><option value="child">child </option>
            <option value="adolescent">adolescent </option>
            <option value="adult">adult </option>
            <option value="senior">senior</option>
          </select>
        </div>
        <div class="space-y-2">
          <label
            class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            for="password"
          >
            Country
          </label>
          <select
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            id="country"
            required
            bind:value={$form.country}
            ><option value="MW">MW</option>
          </select>
        </div>
        <button
          class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
          type="submit"
        >
          Sign Up
        </button>
      </div>
      <p>
        Have an account? <span><a href="/auth">Login</a></span>
      </p>
    </div>
  </form>
</div> -->
<div class="flex items-center justify-center min-h-screen bg-gray-50">
  <h1>Coming Soon</h1>
</div>
