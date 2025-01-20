<script lang="ts">
  import { goto } from "$app/navigation";
  import Input from "$lib/components/ui/input/input.svelte";
  import { toast } from "svelte-sonner";
  import logo from "$lib/assets/images/coat_of_arms_of_malawi.webp";
  import { superForm } from "sveltekit-superforms";
  import { zod } from "sveltekit-superforms/adapters";
  import { forgotPasswordSchema } from "$lib/domain/validators/User/forgotPasswordValidator";

  let { data } = $props();
  let emailSent = $state(false);

  const {form, errors, enhance, message} = superForm(data.form, {
      validators: zod(forgotPasswordSchema),
      onResult: ({result}) => {
          if (result.type === 'failure') {
              toast.error(result.data?.message || 'Recovery Failed');
          }
          if (result.type === 'success') {
              emailSent = true;
          }
      },
      onError: ({ result }) => {
          toast.error(result.error.message);
      }
  });

</script>

<div class="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 sm:px-6 lg:px-8">
    <div class="bg-white sm:mx-auto sm:w-full sm:max-w-md rounded-lg shadow-lg p-8 space-y-8">
        {#if emailSent}
            <!-- Recovery Email Sent Content -->
            <div class="space-y-6 text-center">
                <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <h1 class="text-3xl font-extrabold text-gray-900">Recovery Email Sent</h1>
                <p class="text-gray-500">
                    We've sent password recovery instructions to<br>
                    <span class="font-medium text-primary">{$form.email}</span>
                </p>

                <div class="space-y-4">
                    <button
                            onclick={() => emailSent = false}
                            class="w-full flex justify-center py-3 px-4 rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                    >
                        Resend Email
                    </button>
                    <a
                            href="/login"
                            class="inline-block w-full text-center text-sm font-medium text-primary hover:text-primary/80"
                    >
                        Return to Login
                    </a>
                </div>
            </div>
        {:else}
            <!-- Original Forgot Password Form -->
            <div class="transform transition-all hover:scale-105">
                <!-- <img...> Keep your logo if needed -->
            </div>

            <div class="space-y-3 text-center">
                <h1 class="text-3xl font-extrabold text-gray-900">Forgot Password</h1>
                <p class="text-gray-500">Please Enter Your Email Address</p>
            </div>

            <form method="POST" class="space-y-6" use:enhance>
                <div class="space-y-2">
                    <label for="email" class="block text-sm font-medium text-gray-700">
                        Email address
                    </label>
                    <Input
                            id="email"
                            name="email"
                            type="email"
                            autocomplete="email"
                            placeholder="email@email.com"
                            class="w-full focus:ring-2 focus:ring-primary"
                            bind:value={$form.email}
                            aria-invalid={$errors.email ? 'true' : undefined}
                    />
                    {#if $errors.email}
                        <p class="text-sm text-red-500 mt-1">{$errors.email}</p>
                    {/if}
                </div>
                <button
                        type="submit"
                        class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transform transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Recover Account
                </button>
            </form>
        {/if}
    </div>
</div>