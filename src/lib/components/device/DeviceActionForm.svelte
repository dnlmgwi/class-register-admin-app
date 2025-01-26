<script lang="ts">
  import * as AlertDialog from "$lib/components/ui/alert-dialog";
  import { superForm } from "sveltekit-superforms";
  import { toast } from "svelte-sonner";

  export let action: string;
  export let deviceId: string;
  export let title: string;
  export let description: string;
  export let onClose: () => void;
  export let form: any;

  const { enhance } = superForm(form, {
    onResult: async ({ result }) => {
      if (result.type === "success") {
        toast.success(
          result.data?.message || "Operation completed successfully"
        );
        onClose();
      } else if (result.type === "failure") {
        toast.error(result.data?.error || "Operation failed");
      }
    },
  });
</script>

<form method="POST" action={`?/${action}`} use:enhance>
  <input type="hidden" name="id" value={deviceId} />
  <AlertDialog.Footer>
    <AlertDialog.Cancel on:click={onClose}>Cancel</AlertDialog.Cancel>
    <AlertDialog.Action type="submit">Continue</AlertDialog.Action>
  </AlertDialog.Footer>
</form>
