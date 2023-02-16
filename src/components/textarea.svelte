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
  import type { HTMLTextareaAttributes } from 'svelte/elements';

  export let baseClass = '';
  export let name = '';
  export let label = '';
  export let textareaAttr: HTMLTextareaAttributes = {};

  const id = generateID();
  const classList = 'form-input ' + (textareaAttr.class ?? '');
</script>

<div class={baseClass || 'flex flex-col'}>
  <label for={id} class="form-label">{label}</label>
  <textarea {id} {name} placeholder={label} {...textareaAttr} class={classList} />
</div>
