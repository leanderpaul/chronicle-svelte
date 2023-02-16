<script lang="ts">
  /**
   * Importing npm packages
   */

  /**
   * Importing npm design components
   */
  import { FloatingLabelInput } from 'flowbite-svelte';

  /**
   * Importing user defined components
   */
  import Input from '@/components/input.svelte';
  import Textarea from '@/components/textarea.svelte';
  import FormField from '@/components/form-field.svelte';
  import DatePicker from '@/components/date-picker.svelte';
  import Select from '@/components/select.svelte';

  /**
   *  Importing user defined modules
   */

  /**
   * Importing types.
   */

  const currentDate = new Date();
  const today = { date: currentDate.getDate(), month: currentDate.getMonth() + 1, year: currentDate.getFullYear() % 100 };
</script>

<div>
  <h1 class="text-xl mb-5">Add Expense</h1>
  <div class="card p-3 mb-6 flex flex-col mx-auto w-3/5">
    <div class="font-medium mb-3 text-lg text-content-light">Basic Details</div>
    <div class="border-b w-full border-border mb-4" />
    <div class="grid grid-cols-4 gap-5">
      <div class="col-span-4">
        <Input label="Bill ID" name="bid" />
      </div>
      <div class="col-span-2">
        <Input label="Store Name" name="store" />
      </div>
      <div class="col-span-2">
        <Input label="Store Location" name="storeAddr" />
      </div>
      <div class="col-span-2">
        <FormField label="Date">
          <DatePicker />
        </FormField>
      </div>
      <div class="col-span-2">
        <Input label="Time" name="bid" />
      </div>
      <div class="col-span-2">
        <Select />
      </div>
      <div class="col-span-2">
        <Input label="Currency" name="bid" />
      </div>
      <div class="col-span-4">
        <Textarea label="Description" name="desc" textareaAttr={{ rows: 4 }} />
      </div>
    </div>
  </div>
  <div class="card p-3 mb-4 flex flex-col mx-auto w-3/5">
    <div class="font-medium mb-3 text-lg text-content-light">Bill Items</div>
    <div class="border-b w-full border-border mb-4" />
    <div class="grid grid-cols-12 gap-3">
      <div class="col-span-6">
        <Input label="Name" name="bid" />
      </div>
      <div class="col-span-2">
        <Input label="Quantity" name="bid" />
      </div>
      <div class="col-span-2">
        <Input label="Price" name="bid" />
      </div>
      <div class="col-span-2">
        <Input label="Total" name="bid" />
      </div>
    </div>
  </div>
</div>
