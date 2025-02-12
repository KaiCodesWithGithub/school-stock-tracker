"use client";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { insertItem } from "@/utils/db/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { onItemSubmitForm } from "../actions";
import { redirect } from "next/navigation";

const Page = () => {
  const form = useForm<z.infer<typeof insertItem>>({
    resolver: zodResolver(insertItem),
    defaultValues: {
      name: "",
      qtyOptions: [1],
      qtyRemaining: 1,
      purchasedQty: 0,
    },
  });

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((e) => {
            onItemSubmitForm(e);
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
          <FormField
            control={form.control}
            name="purchasedQty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Purchased Quantity</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Purchased Quantity"
                    type="number"
                    onChange={(e) => {
                      field.onChange(parseInt(e.target.value));
                    }}
                  />
                </FormControl>
                <FormDescription>
                  This is the purchased quantity of the item.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="qtyOptions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity Options</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="1, 5, 10"
                    value={field.value?.toString()}
                    onChange={(e) => {
                      field.onChange(
                        e.target.value.split(",").map((num) => {
                          if (num.trim().length > 0)
                            return parseInt(num.trim());
                          else return null;
                        })
                        // .filter((num) => !isNaN(num))
                      );
                    }}
                    // onSubmit={(e) => {
                    //   field.onChange(
                    //     e.currentTarget.value
                    //       .split(",")
                    //       .map((num) => parseInt(num.trim()))
                    //   );
                    // }}
                  />
                </FormControl>
                <FormDescription>
                  This is the different quantity options separated by
                  &quot;,&quot;.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
      <Button onClick={() => redirect("/edit")}>Go back home (make sure you have saved first)</Button>
    </div>
  );
};

export default Page;
