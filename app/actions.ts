"use server";

import { db } from "@/utils/db";
import {
  items as itemsTable,
  bundles as bundlesTable,
  itemsToBundles as itemsToBundlesTable,
} from "@/utils/db/schema";
import { bundleSchema, insertItem } from "@/utils/db/zod";
import { asc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export const getItems = async () => {
  const result = db.query.items
    .findMany({
      orderBy: [asc(itemsTable.id)],
    })
    .then((items) => items);
  return result;
};

export const getBundles = async () => {
  const result = await db.query.bundles.findMany({
    orderBy: [asc(bundlesTable.id)],
    with: {
      itemsToBundles: {
        with: {
          item: true,
        }
      },
    },
  });
  return result;
};

export type ItemType = typeof itemsTable.$inferSelect;
export type BundleType = typeof bundlesTable.$inferSelect;

export const decrement = async (
  item: ItemType,
  currentQty: number,
  decrementQty: number = 1
) => {
  if (currentQty - decrementQty < 0) return;
  // Update the database here...
  const entry = await db
    .update(itemsTable)
    .set({ qtyRemaining: currentQty - decrementQty })
    .where(eq(itemsTable.id, item.id))
    .returning({ updatedQty: itemsTable.qtyRemaining });

  revalidatePath("/");
  return entry;
};

export const increment = async (item: ItemType, currentQty: number) => {
  // Update the database here...
  const entry = await db
    .update(itemsTable)
    .set({ qtyRemaining: currentQty + 1 })
    .where(eq(itemsTable.id, item.id))
    .returning({ updatedQty: itemsTable.qtyRemaining });

  revalidatePath("/");
  return entry;
};

export const incrementBundle = async (
  bundle: BundleType & { itemsToBundles?: { item: ItemType, quantity: number }[] }
) => {
  // Ensure all items have stock before proceeding
  if (bundle.itemsToBundles) {
    for (const mapping of bundle.itemsToBundles) {
      if (mapping.item.qtyRemaining <= 0) {
        return;
      }
    }
  }
  const bundleUpdate = await db
    .update(bundlesTable)
    .set({ qtySold: bundle.qtySold + 1 })
    .where(eq(bundlesTable.id, bundle.id))
    .returning({ updatedQty: bundlesTable.qtySold });

  // Decrement each associated item's qtyRemaining
  if (bundle.itemsToBundles) {
    await Promise.all(
      bundle.itemsToBundles.map(async (mapping) => {
        await db
          .update(itemsTable)
          .set({ qtyRemaining: mapping.item.qtyRemaining - mapping.quantity })
          .where(eq(itemsTable.id, mapping.item.id));
      })
    );
  }

  revalidatePath("/");
  return bundleUpdate;
};

export const decrementBundle = async (
  bundle: BundleType & { itemsToBundles?: { item: ItemType, quantity: number }[] }
) => {
  if (bundle.qtySold === 0) return;
  const bundleUpdate = await db
    .update(bundlesTable)
    .set({ qtySold: bundle.qtySold - 1 })
    .where(eq(bundlesTable.id, bundle.id))
    .returning({ updatedQty: bundlesTable.qtySold });

  // Decrement each associated item's qtyRemaining
  if (bundle.itemsToBundles) {
    await Promise.all(
      bundle.itemsToBundles.map(async (mapping) => {
        await db
          .update(itemsTable)
          .set({ qtyRemaining: mapping.item.qtyRemaining + mapping.quantity })
          .where(eq(itemsTable.id, mapping.item.id));
      })
    );
  }

  revalidatePath("/");
  return bundleUpdate;
};

export const deleteItem = async (item: ItemType) => {
  if (await checkIfItemHasRelationships(item)) {
    return;
  }
  await db.delete(itemsTable).where(eq(itemsTable.id, item.id));
  revalidatePath("/");
};

export const deleteBundle = async (bundle: BundleType) => {
  await db
    .delete(itemsToBundlesTable)
    .where(eq(itemsToBundlesTable.bundleId, bundle.id));
  await db.delete(bundlesTable).where(eq(bundlesTable.id, bundle.id));
  revalidatePath("/");
};

export const checkIfItemHasRelationships = async (item: ItemType) => {
  const hasRelationships = await db.query.itemsToBundles.findMany({
    where: eq(itemsToBundlesTable.itemId, item.id),
  });
  return hasRelationships.length > 0 ? true : false;
};

// Form functions

export async function onItemSubmitForm(data: z.infer<typeof insertItem>) {
  const processedData = {
    ...data,
    qtyOptions: (data.qtyOptions ?? [1])
      .toString()
      .split(",")
      .map((num) => parseInt(num.trim()))
      .filter((num) => !isNaN(num)),
    qtyRemaining: data.purchasedQty,
  };

  await db.insert(itemsTable).values(processedData).returning();
}

export async function onBundleSubmitForm(data: z.infer<typeof bundleSchema>) {
  
  await db.transaction(async (tx) => {
    const bundleId = await tx
      .insert(bundlesTable)
      .values(data)
      .returning({ id: bundlesTable.id });
    data.items.map(async (item) => {
      await tx.insert(itemsToBundlesTable).values({
        bundleId: bundleId[0].id,
        itemId: item.itemId,
        quantity: item.quantity
      })
    });
  });
}