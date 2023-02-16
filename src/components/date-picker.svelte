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

  /**
   * Importing types.
   */
  const startYear = 2000;
  const currentDate = new Date();
  const yearLen = currentDate.getFullYear() - startYear + 1;
  const years = new Array(yearLen).fill(0).map((_, index) => startYear + index);
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  let date = currentDate.getDate();
  let month = currentDate.getMonth();
  let year = currentDate.getFullYear();

  $: days = new Date(year, month + 1, 0).getDate();

  export let name = '';
</script>

<div class="grid grid-cols-3 gap-3">
  <input {name} hidden value={date + '-' + month + '-' + year} />
  <select class="form-input" name="date" bind:value={date}>
    {#each new Array(days).fill(0) as val, index (index)}
      <option value={index + 1}>{index + 1}</option>
    {/each}
  </select>
  <select class="form-input" name="month" bind:value={month}>
    {#each months as val, index (val)}
      <option value={index}>{val}</option>
    {/each}
  </select>
  <select class="form-input" name="year" bind:value={year}>
    {#each years as val (val)}
      <option value={val}>{val}</option>
    {/each}
  </select>
</div>

<style>
  select {
    cursor: pointer;
  }
</style>
