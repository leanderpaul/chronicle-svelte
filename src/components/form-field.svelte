<script lang="ts">
  /**
   * Importing npm packages
   */

  /**
   * Importing npm design components
   */

  /**
   * Importing user defined components
   */

  /**
   *  Importing user defined modules
   */
  import { generateID } from '@/utils/helpers';

  /**
   * Importing types.
   */

  export let baseClass = '';
  export let label = '';

  const id = generateID();
</script>

<div class={baseClass || 'flex flex-col'}>
  <label for={id} class="form-label">{label}</label>
  <slot {id} />
</div>
