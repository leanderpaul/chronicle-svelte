<script lang="ts">
  import type { PageServerData } from '$routes/me/$types';

  export let data: PageServerData;
</script>

<code>
  {JSON.stringify(data)}
</code>
