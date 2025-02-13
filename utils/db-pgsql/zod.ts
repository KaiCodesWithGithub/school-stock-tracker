import { createInsertSchema } from 'drizzle-zod'
import { bundles, items } from './schema'
import { z } from 'zod';

export const insertItem = createInsertSchema(items)
export const insertBundle = createInsertSchema(bundles)

export const bundleSchema = z.object({
  ...insertBundle.shape,
  // items: z.number().array().length(2),
  items: z.array(z.object({
    itemId: z.coerce.number(),
    quantity: z.coerce.number(),
  })).min(2).refine((items) => {
    const itemIds = items.map(item => item.itemId);
    const uniqueItemIds = new Set(itemIds);
    return itemIds.length === uniqueItemIds.size;
  }, {
    message: "Bundle cannot contain duplicate items"
  }),
})

