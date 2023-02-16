<script lang="ts">
  /**
   * Importing npm packages
   */

  /**
   * Importing npm design components
   */
  import { UserSolid, RightFromBracketSolid } from 'svelte-awesome-icons';
  import { Avatar } from 'flowbite-svelte';

  /**
   * Importing user defined components
   */
  import '@/app.css';
  import NavItem from '@/components/nav-item.svelte';

  /**
   *  Importing user defined modules
   */
  import type { LayoutData } from '$routes/$types';

  /**
   * Importing types.
   */

  export let data: LayoutData;

  let displayDropdown = false;

  const dropdownItemClasses = 'py-3 px-4 cursor-pointer hover:bg-neutral-700 flex items-center';
  const dropdownClasses = 'bg-paper absolute w-72 dropdown grid grid-cols-1 divide-y divide-neutral-700 border border-neutral-700 ';
  const dropdownButtonClasses = 'flex items-center text-sm font-medium cursor-pointer relative hover:bg-neutral-700 px-3 py-2 rounded';
  const navItems: NavItem['$$prop_def'][] = [
    { href: '/', icon: 'dashboard', label: 'Dashboard' },
    {
      icon: 'finance',
      label: 'Finance',
      subMenu: [
        { href: '/finance', label: 'Overview' },
        { href: '/finance/add-expense', label: 'Add Expense' },
        { href: '/finance/list', label: 'List' },
      ],
    },
    { href: '#', icon: 'health', label: 'Health', disabled: true },
  ];
</script>

<div class="flex w-screen h-screen" id="layout">
  <nav>
    <div class="h-full">
      <a href="/">
        <img src="/logo.png" alt="Chronicle Logo" width="100%" />
      </a>
      {#each navItems as navItem (navItem.label)}
        <NavItem {...navItem} />
      {/each}
    </div>
  </nav>
  <div>
    <section class="flex justify-end items-center h-14 px-6 bg-paper fixed">
      <button
        id="user"
        class={dropdownButtonClasses}
        on:click={() => (displayDropdown = !displayDropdown)}
        on:blur={() => (displayDropdown = false)}
      >
        <Avatar size="xs" src={data.imageUrl}>
          {data.name
            .split(' ')
            .map((n) => n.charAt(0))
            .join('')
            .toUpperCase()}
        </Avatar>
        <span class="ml-3">{data.name}</span>
      </button>
      <div id="user-dropdown" class={dropdownClasses} class:hidden={!displayDropdown}>
        <div class="flex p-3">
          <Avatar src={data.imageUrl}>
            {data.name
              .split(' ')
              .map((n) => n.charAt(0))
              .join('')
              .toUpperCase()}
          </Avatar>
          <div class="flex flex-col text-sm pl-4">
            <span>{data.name}</span>
            <span class="text-neutral-500">{data.email}</span>
          </div>
        </div>
        <div class="flex flex-col text-sm">
          <a class={dropdownItemClasses}>
            <UserSolid size="12px" />
            <span class="ml-3">Account Settings </span>
          </a>
          <a class={dropdownItemClasses}>
            <RightFromBracketSolid size="12px" />
            <span class="ml-3">Logout </span>
          </a>
        </div>
      </div>
    </section>
    <div class="content">
      <slot />
    </div>
  </div>
</div>

<style>
  nav {
    position: fixed;
    width: 280px;
    height: 100%;
    background-color: var(--color-paper);
    border-right: 1px solid var(--color-border);
  }

  #layout > div {
    margin-left: 280px;
    width: calc(100% - 280px);
  }

  section {
    width: calc(100% - 280px);
  }

  .content {
    margin-top: 50px;
    padding: 24px;
  }

  .dropdown {
    top: 56px;
    right: 24px;
  }
</style>
