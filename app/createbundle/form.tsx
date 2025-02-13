"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { bundleSchema } from "@/utils/db/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { ItemType, onBundleSubmitForm } from "../actions";

const BundleForm = ({ items }: { items: ItemType[] }) => {
  const form = useForm<z.infer<typeof bundleSchema>>({
    resolver: zodResolver(bundleSchema),
    defaultValues: {
      name: "",
      items: [
        {
          itemId: 1,
          quantity: 1,
        },
      ],
      qtySold: 0,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((e) => {
          onBundleSubmitForm(e);
          form.reset();
        })}
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Name" />
              </FormControl>
              <FormDescription>This is the name of the item.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {fields.map((field, index) => (
          <div key={field.id}>
            <FormField
              control={form.control}
              name={`items.${index}.itemId`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Item</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value.toString()}>
                    <FormControl>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Item" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {items.map((item) => (
                        <SelectItem key={item.id} value={item.id.toString()}>{item.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>This is the ID of the item.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`items.${index}.quantity`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Quantity" type="number" />
                  </FormControl>
                  <FormDescription>
                    This is the quantity of the item.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              variant="destructive"
              onClick={() => remove(index)}
            >
              Remove
            </Button>
          </div>
        ))}
        <FormField
          control={form.control}
          name="items"
          render={() => <FormMessage />}
        ></FormField>
        <div className="flex gap-4">
          <Button
            type="button"
            onClick={() => append({ itemId: 1, quantity: 1 })}
          >
            Add Item
          </Button>
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
};

export default BundleForm;
