"use client";

import { decrement, deleteItem, increment, ItemType } from "@/app/actions";
import { TableCell, TableRow } from "../ui/table";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { useOptimistic, useTransition } from "react";

const ItemRow = ({ item, edit }: { item: ItemType; edit?: boolean }) => {
  const [optimisticQty, addOptimisticQty] = useOptimistic(
    { qtyRemaining: item.qtyRemaining, sending: false },
    (state, newQty: number) => ({
      ...state,
      qtyRemaining: newQty,
      sending: true,
    })
  );

  const [, startTransition] = useTransition();

  return (
    <TableRow className="text-xl">
      <TableCell>{item.name}</TableCell>
      <TableCell>
        {item.qtyRemaining <= 0 ? (
          <span className="text-red-500">Sold Out</span>
        ) : item.qtyRemaining <= 20 ? (
          <span className="text-yellow-500">Low Stock</span>
        ) : (
          <span className="text-green-500">In Stock</span>
        )}
      </TableCell>
      <TableCell>
        {optimisticQty.qtyRemaining}
        <span className="text-base text-gray-600">/{item.purchasedQty}</span>
      </TableCell>
      {edit && (
        <TableCell>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => deleteItem(item)}
                  variant={"destructive"}
                >
                  Delete
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  This button will be disabled when the item is part of a
                  bundle.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </TableCell>
      )}
      <TableCell className="flex gap-8 justify-end">
        {item.qtyOptions.map((qty) => (
          <Button
            key={qty}
            onClick={() => {
              startTransition(async () => {
                addOptimisticQty(item.qtyRemaining - qty);
                await decrement(item, item.qtyRemaining, qty);
              });
            }}
            className="text-xl p-8"
          >
            -{qty}
          </Button>
        ))}
        <Button
          onClick={() => {
            startTransition(async () => {
              addOptimisticQty(item.qtyRemaining + 1);
              await increment(item, item.qtyRemaining);
            });
          }}
          className="text-xl p-8"
        >
          +1
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default ItemRow;
