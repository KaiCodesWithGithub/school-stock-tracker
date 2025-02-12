"use client";

import {
  BundleType,
  decrementBundle,
  deleteBundle,
  incrementBundle,
  ItemType,
} from "@/app/actions";
import { TableCell, TableRow } from "../ui/table";
import { Button } from "../ui/button";

interface Props extends BundleType {
  itemsToBundles: {
    itemId: number;
    bundleId: number;
    item: ItemType;
    quantity: number;
  }[];
}

const BundleRow = ({ bundle, edit }: { bundle: Props; edit?: boolean }) => {
  const remainingBundles = bundle.itemsToBundles.reduce(
    (minBundles, itemToBundle) => {
      const possibleBundles = Math.floor(
        itemToBundle.item.qtyRemaining / itemToBundle.quantity
      );
      return Math.min(minBundles, possibleBundles);
    },
    Infinity
  );

  const getStockStatus = (remaining: number) => {
    if (remaining <= 0) return <span className="text-red-500">Sold Out</span>;
    if (remaining <= 3)
      return <span className="text-yellow-500">Low Stock</span>;
    return <span className="text-green-500">In Stock</span>;
  };

  return (
    <TableRow className="text-xl">
      <TableCell className="flex items-center gap-4">
        {bundle.name}
        <span className="text-sm text-gray-600">
          {bundle.itemsToBundles
            .map((it) => `${it.item.name} (x${it.quantity})`)
            .join(", ")}
        </span>
      </TableCell>
      <TableCell>{getStockStatus(remainingBundles)}</TableCell>
      <TableCell>
        <span className="text-base text-gray-600">
          ({remainingBundles} possible)
        </span>
      </TableCell>
      <TableCell>{bundle.qtySold}</TableCell>
      {edit && (
        <TableCell>
          <Button onClick={() => deleteBundle(bundle)} variant={"destructive"}>
            Delete
          </Button>
        </TableCell>
      )}
      <TableCell className="flex gap-8 justify-end">
        <Button onClick={() => incrementBundle(bundle)} className="text-xl p-8">
          +1
        </Button>
        <Button onClick={() => decrementBundle(bundle)} className="text-xl p-8">
          -1
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default BundleRow;
