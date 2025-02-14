import { relations, sql } from "drizzle-orm";
import { integer, pgTable, varchar, timestamp, serial, primaryKey } from "drizzle-orm/pg-core";

export const items = pgTable("items", {
  id: serial().primaryKey().notNull(),
  name: varchar({ length: 255 }).notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  qtyOptions: integer().array().default(sql`'{1}'::integer[]`).notNull(),
  qtyRemaining: integer().notNull(),
  purchasedQty: integer().notNull(),
});

export const itemsRelations = relations(items, ({ many }) => ({
  itemsToBundles: many(itemsToBundles)
}))

export const bundles = pgTable("bundles", {
  id: serial().primaryKey().notNull(),
  name: varchar({ length: 255 }).notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  qtySold: integer().notNull(),
});

export const bundlesRelations = relations(bundles, ({ many }) => ({
  itemsToBundles: many(itemsToBundles)
}))

export const itemsToBundles = pgTable("items_bundles", {
  itemId: integer().notNull().references(() => items.id),
  bundleId: integer().notNull().references(() => bundles.id),
  quantity: integer().notNull().default(1),
},
(t) => [
  primaryKey({ columns: [t.itemId, t.bundleId] }),
]);

export const itemsToBundlesRelations = relations(itemsToBundles, ({ one }) => ({
  item: one(items, {
    fields: [itemsToBundles.itemId],
    references: [items.id],
  }),
  bundle: one(bundles, {
    fields: [itemsToBundles.bundleId],
    references: [bundles.id],
  })
}))