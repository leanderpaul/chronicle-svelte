<script lang="ts">
  import { page } from '$app/stores';
  import {
    HouseSolid,
    FileInvoiceDollarSolid,
    HeartPulseSolid,
    ChevronRightSolid,
    ChevronDownSolid,
    CircleSolid,
  } from 'svelte-awesome-icons';

  interface SubMenuItem {
    href: string;
    label: string;
  }

  const icons = { dashboard: HouseSolid, finance: FileInvoiceDollarSolid, health: HeartPulseSolid };

  export let href = '';
  export let icon: keyof typeof icons;
  export let label: string;
  export let disabled = false;
  export let subMenu: SubMenuItem[] = [];

  const Icon = icons[icon];

  let openSubMenu = subMenu.some((item) => item.href === $page.route.id);
  const toggleSubMenu = () => (openSubMenu = !openSubMenu);
</script>

<div class:opacity={disabled}>
  {#if subMenu.length === 0}
    <a {href} class:selected={$page.route.id === href} class:disabled>
      <Icon size="16px" color={$page.route.id === href ? '#9e77ed' : '#7a7a7a'} />
      <span>{label}</span>
    </a>
  {:else}
    <button class="w-full cursor-pointer" on:click={toggleSubMenu} class:selected={subMenu.some((item) => item.href === $page.route.id)}>
      <Icon size="16px" color={$page.route.id === href ? '#9e77ed' : '#7a7a7a'} />
      <span>{label}</span>
      <span style="margin-left: auto;">
        {#if openSubMenu}
          <ChevronDownSolid size="10px" color="#63737f" />
        {:else}
          <ChevronRightSolid size="10px" color="#63737f" />
        {/if}
      </span>
    </button>
    {#if openSubMenu}
      {#each subMenu as item (item.label)}
        <a href={item.href} style="padding-left: 25px;">
          <CircleSolid size="6px" color={$page.route.id === item.href ? '#9e77ed' : '#1e1e1e'} />
          <span>{item.label}</span>
        </a>
      {/each}
    {/if}
  {/if}
</div>

<style>
  div {
    padding: 5px 20px;
  }

  div.opacity {
    opacity: 0.38;
  }

  button {
    background-color: inherit;
    border: none;
  }

  a,
  button {
    color: #7a7a7a;
    border-radius: 10px;
    display: flex;
    align-items: center;
    padding: 10px 20px;
    font-size: 14px;
  }

  a:hover:not(.disabled),
  button:hover {
    background-color: #292929;
  }

  .disabled {
    cursor: default;
  }

  .selected {
    background-color: #292929;
    color: #ffffffde;
  }

  span {
    margin-left: 20px;
    font-weight: 500;
    line-height: 24px;
  }
</style>
