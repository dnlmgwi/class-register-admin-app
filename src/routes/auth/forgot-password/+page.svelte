<script lang="ts">
  import { goto } from "$app/navigation";
  import Input from "$lib/components/ui/input/input.svelte";
  import { baseUrl } from "$lib/utils/constants";
  import { toast } from "svelte-sonner";
  import { invalidateAll } from "$app/navigation";
  import logo from "$lib/assets/images/coat_of_arms_of_malawi.webp";
  import { superForm } from "sveltekit-superforms";
  import { z } from "zod";
  import { zod } from "sveltekit-superforms/adapters";
  import {loginUserSchema} from "$lib/domain/validators/User/loginUserValidator";

  let { data } = $props();
  const { form, errors, enhance } = superForm(data.form, {
    validators: zod(loginUserSchema),
    onError: ({ result }) => {
      toast.error(result.error.message);
    }
  });
</script>

<div class="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 sm:px-6 lg:px-8">
  <div class="bg-white sm:mx-auto sm:w-full sm:max-w-md rounded-lg shadow-lg p-8 space-y-8">
    <div class="transform transition-all hover:scale-105">
      <img
              alt="logo"
              src={logo}
              class="w-24 h-24 mx-auto object-contain"
              loading="lazy"
      />
    </div>

    <div class="space-y-3 text-center">
      <h1 class="text-3xl font-extrabold text-gray-900">Welcome Back</h1>
      <p class="text-gray-500">Sign in to your account</p>
    </div>

    <form
            method="POST"
            action="?/login"
            class="space-y-6"
    >
      <div class="space-y-2">
        <label
                for="phone"
                class="block text-sm font-medium text-gray-700"
        >
          Phone Number
        </label>
        <Input
                id="phone"
                name="phone"
                type="tel"
                autocomplete="mobile tel"
                placeholder="265XXXXXXXXX"
                class="w-full focus:ring-2 focus:ring-primary"
                bind:value={$form.phone}
                aria-invalid={$errors.phone ? 'true' : undefined}
        />
        {#if $errors.phone}
          <p class="text-sm text-red-500 mt-1">{$errors.phone}</p>
        {/if}
      </div>

      <div class="space-y-2">
        <label
                for="password"
                class="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <Input
                id="password"
                name="password"
                type="password"
                autocomplete="current-password"
                class="w-full focus:ring-2 focus:ring-primary"
                bind:value={$form.password}
                aria-invalid={$errors.password ? 'true' : undefined}
        />
        {#if $errors.password}
          <p class="text-sm text-red-500 mt-1">{$errors.password}</p>
        {/if}
      </div>

      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <input
                  id="remember_me"
                  name="remember_me"
                  type="checkbox"
                  class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <label for="remember_me" class="ml-2 block text-sm text-gray-700">
            Remember me
          </label>
        </div>

        <div class="text-sm">
          <a href="/auth/reset-password" class="font-medium text-primary hover:text-primary/80">
            Forgot password?
          </a>
        </div>
      </div>

      <button
              type="submit"
              class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transform transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Sign in
      </button>

      <div class="text-center text-sm">
        <p class="text-gray-600">
          Don't have an account?{" "}
          <a
                  href="/auth/signup"
                  class="font-medium text-primary hover:text-primary/80 hover:underline"
          >
            Create Account
          </a>
        </p>
      </div>
    </form>
  </div>
</div>