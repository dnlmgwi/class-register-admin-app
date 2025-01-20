<script lang="ts">
  import { createStudentSchema } from "$lib/domain/validators/User/createStudentValidator.js";
  import { createUserSchema } from "$lib/domain/validators/User/createUserValidator.js";
  import type { StudentDTO } from "$lib/domain/valueObjects/StudentDTO.js";
  import { baseUrl } from "$lib/utils/constants";
  import { SelectUserRole, UserRole } from "$lib/utils/enums/UserRole.js";
  import { toast } from "svelte-sonner";
  import { superForm } from "sveltekit-superforms";
  import { zod } from "sveltekit-superforms/adapters";
  import { debounce } from "throttle-debounce";
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();



  const { form, errors, constraints, validateForm } = superForm(data.form, {
    validators: zod(createUserSchema),
  });

  let isStudent = $derived($form.role === SelectUserRole.Student);

  const {
    form: studentForm,
    errors: studentErrors,
    constraints: studentConstraints,
    validateForm: validateStudentForm,
  } = superForm(data.studentForm, {
    validators: zod(createStudentSchema),
  });

</script>

<div class="flex items-center justify-center min-h-screen bg-gray-50">
  {#if isStudent}
    <form method="POST" action="?/student" class="w-full max-w-md">
      <div class="mx-auto max-w-md space-y-6">
        <div class="space-y-2 text-center">
          <h1 class="text-3xl font-bold">Sign Up as {$form.role}</h1>
          <p class="text-gray-400">Create your student account</p>
        </div>
        <div class="space-y-4">
          <div class="space-y-2">
            <label for="role" class="text-sm font-medium leading-none"
            >Role</label
            >
            <select
                    name="role"
                    class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    id="role"
                    bind:value={$studentForm.role}
                    {...$constraints.role}
            >
              {#each Object.values(SelectUserRole) as role}
                <option value={role}>{role}</option>
              {/each}
            </select>
            {#if $errors.role}<p class="text-sm text-red-500">
              {$errors.role}
            </p>{/if}
          </div>
          <div class="space-y-2">
            <label for="studentId" class="text-sm font-medium leading-none"
            >Student ID</label
            >
            <input
                    name="studentId"
                    class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    id="studentId"
                    type="text"
                    placeholder="Enter your student ID"
                    bind:value={$studentForm.studentId}
                    {...$studentConstraints.studentId}
            />
            {#if $studentErrors.studentId}<p class="text-sm text-red-500">
              {$studentErrors.studentId}
            </p>{/if}
          </div>
          <div class="space-y-2">
            <label for="phone" class="text-sm font-medium leading-none"
            >Phone</label
            >
            <input
                    name="phone"
                    class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    id="phone"
                    type="tel"
                    placeholder="265XXXXXXXXX"
                    bind:value={$studentForm.phone}
                    {...$studentConstraints.phone}
            />
            {#if $studentErrors.phone}<p class="text-sm text-red-500">
              {$studentErrors.phone}
            </p>{/if}
          </div>
          <div class="space-y-2">
            <label for="firstName" class="text-sm font-medium leading-none"
            >First Name</label
            >
            <input
                    name="firstName"
                    class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    id="firstName"
                    type="text"
                    placeholder="John"
                    bind:value={$studentForm.firstName}
                    {...$studentConstraints.firstName}
            />
            {#if $studentErrors.firstName}<p class="text-sm text-red-500">
              {$studentErrors.firstName}
            </p>{/if}
          </div>
          <div class="space-y-2">
            <label for="lastName" class="text-sm font-medium leading-none"
            >Last Name</label
            >
            <input
                    name="lastName"
                    class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    bind:value={$studentForm.lastName}
                    {...$studentConstraints.lastName}
            />
            {#if $studentErrors.lastName}<p class="text-sm text-red-500">
              {$studentErrors.lastName}
            </p>{/if}
          </div>
          <div class="space-y-2">
            <label for="email" class="text-sm font-medium leading-none"
            >Email</label
            >
            <input
                    name="email"
                    class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    id="email"
                    type="email"
                    placeholder="john.doe@example.com"
                    bind:value={$studentForm.email}
                    {...$studentConstraints.email}
            />
            {#if $studentErrors.email}<p class="text-sm text-red-500">
              {$studentErrors.email}
            </p>{/if}
          </div>

          <button
                  class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
                  type="submit"
          >
            Sign Up
          </button>
        </div>
        <p class="text-center">
          Have an account? <a href="/auth" class="text-primary hover:underline"
        >Login</a
        >
        </p>
      </div>
    </form>
  {:else}
    <form method="POST" action="?/staff" class="w-full max-w-md">
      <div class="mx-auto max-w-md space-y-6">
        <div class="space-y-2 text-center">
          <h1 class="text-3xl font-bold">Sign Up as {$form.role}</h1>
          <p class="text-gray-400">Create your account</p>
        </div>
        <div class="space-y-4">
          <div class="space-y-2">
            <label for="role" class="text-sm font-medium leading-none"
              >Role</label
            >
            <select
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              id="role"
              name="role"
              bind:value={$form.role}
              {...$constraints.role}
            >
              {#each Object.values(SelectUserRole) as role}
                <option value={role}>{role}</option>
              {/each}
            </select>
            {#if $errors.role}<p class="text-sm text-red-500">
                {$errors.role}
              </p>{/if}
          </div>
          <div class="space-y-2">
            <label for="phone" class="text-sm font-medium leading-none"
              >Phone</label
            >
            <input
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              id="phone"
              type="tel"
              name="phone"
              placeholder="265880000000"
              bind:value={$form.phone}
              {...$constraints.phone}
            />
            {#if $errors.phone}<p class="text-sm text-red-500">
                {$errors.phone}
              </p>{/if}
          </div>
          <div class="space-y-2">
            <label for="firstName" class="text-sm font-medium leading-none"
              >First Name</label
            >
            <input
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              id="firstName"
              type="text"
              name="firstName"
              placeholder="John"
              bind:value={$form.firstName}
              {...$constraints.firstName}
            />
            {#if $errors.firstName}<p class="text-sm text-red-500">
                {$errors.firstName}
              </p>{/if}
          </div>
          <div class="space-y-2">
            <label for="lastName" class="text-sm font-medium leading-none"
              >Last Name</label
            >
            <input
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              id="lastName"
              type="text"
              name="lastName"
              placeholder="Doe"
              bind:value={$form.lastName}
              {...$constraints.lastName}
            />
            {#if $errors.lastName}<p class="text-sm text-red-500">
                {$errors.lastName}
              </p>{/if}
          </div>
          <div class="space-y-2">
            <label for="email" class="text-sm font-medium leading-none"
              >Email</label
            >
            <input
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              id="email"
              type="email"
              name="email"
              placeholder="john.doe@example.com"
              bind:value={$form.email}
              {...$constraints.email}
            />
            {#if $errors.email}<p class="text-sm text-red-500">
                {$errors.email}
              </p>{/if}
          </div>
          <button
            class="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
            type="submit"
          >
            Sign Up
          </button>
        </div>
        <p class="text-center">
          Have an account? <a href="/auth/login" class="text-primary hover:underline"
            >Login</a
          >
        </p>
      </div>
    </form>
  {/if}
</div>
