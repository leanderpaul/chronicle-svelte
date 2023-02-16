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
  import type { HTMLInputAttributes } from 'svelte/elements';

  export let baseClass = '';
  export let name = '';
  export let label = '';
  export let inputAttr: HTMLInputAttributes = {};

  const id = generateID();
  const classList = 'form-input ' + (inputAttr.class ?? '');
</script>

<div class={baseClass || 'flex flex-col'}>
  <label for={id} class="form-label">{label}</label>
  <input {id} {name} type="text" placeholder={label} {...inputAttr} class={classList} />
</div>
