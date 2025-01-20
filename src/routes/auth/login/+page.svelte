<script lang="ts">
    import { superForm } from "sveltekit-superforms";
    import { zod } from "sveltekit-superforms/adapters";
    import { toast } from "svelte-sonner";
    import { loginUserSchema } from "$lib/domain/validators/User/loginUserValidator";
    import { goto } from "$app/navigation";
    import { EyeIcon, EyeOffIcon } from "lucide-svelte";
    import { Button } from "$lib/components/ui/button";

    let { data } = $props();

    // Password visibility state
    let showPassword = $state(false);

    // Form handling
    const { form, errors, enhance, message } = superForm(data.form, {
        validators: zod(loginUserSchema),
        onResult: ({ result }) => {
            if (result.type === 'failure') {
                toast.error(result.data?.message || 'Login failed');
            }
            if (result.type === 'success') {
                goto('/dashboard');
            }
        },
    });
</script>

<div class="min-h-screen w-full bg-gray-100 h-full flex items-center justify-center p-4">
    <div class="bg-white overflow-hidden w-full h-lvh flex flex-col lg:flex-row">
        <!-- Left side - Illustration -->
        <div class="lg:w-1/2 bg-[#FCFCFD] p-12 lg:p-16 flex flex-col justify-center items-center relative">
            <div class="w-full max-w-md">
                <div class="aspect-square relative">
                    <!-- Replace this div with your actual illustration -->
                    <div class="absolute inset-0 flex items-center justify-center">

                    </div>
                </div>
            </div>
        </div>

        <!-- Right side - Login form -->
        <div class="lg:w-1/2 p-12 lg:p-16 flex flex-col justify-center">
            <div class="w-full max-w-md mx-auto">
                <!-- Header -->
                <div class="text-center mb-8">
                    <h2 class="text-2xl font-bold text-gray-900">Welcome back!</h2>
                    <p class="text-gray-600 mt-2">Please enter your details</p>
                </div>

                <!-- Form -->
                <form method="POST" action="?/login" class="space-y-6" use:enhance>
                    {#if $message}
                        <div class="text-red-500 text-sm mb-4">
                            {$message}
                        </div>
                    {/if}

                    <div class="space-y-4">
                        <!-- Phone input -->
                        <div>
                            <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number
                            </label>
                            <input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    required
                                    class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white"
                                    placeholder="265XXXXXXXXX"
                                    bind:value={$form.phone}
                                    aria-invalid={$errors.phone ? 'true' : undefined}
                            />
                            {#if $errors.phone}
                                <p class="text-sm text-red-500 mt-1">{$errors.phone}</p>
                            {/if}
                        </div>

                        <!-- Password input -->
                        <div>
                            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <div class="relative">
                                <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        class="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white"
                                        bind:value={$form.password}
                                        aria-invalid={$errors.password ? 'true' : undefined}
                                />
                                <button
                                        type="button"
                                        onclick={() => showPassword = !showPassword}
                                        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {#if showPassword}
                                        <EyeOffIcon size={20} />
                                    {:else}
                                        <EyeIcon size={20} />
                                    {/if}
                                </button>
                            </div>
                            {#if $errors.password}
                                <p class="text-sm text-red-500 mt-1">{$errors.password}</p>
                            {/if}
                        </div>
                    </div>

                    <!-- Forgot password link -->
                    <div class="flex items-center justify-between">
                        <div class="flex items-center">
                            <!-- Empty for now -->
                        </div>
                        <a href="/auth/forgot-password" class="text-sm text-gray-600 hover:text-gray-900">
                            Forgot password?
                        </a>
                    </div>

                    <!-- Submit button -->
                    <div class="space-y-4">
                        <Button
                                type="submit"
                                class="w-full py-3 px-4 rounded-lg text-white hover:prim focus:outline-none transition-all"
                        >
                            Log In
                        </Button>
                    </div>

                    <!-- Sign up link -->
                    <div class="text-center text-sm text-gray-600">
                        Don't have an account?{" "}
                        <a href="/auth/signup" class="font-medium text-primary hover:text-primary/80">
                            Sign up
                        </a>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>