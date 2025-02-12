"use client";

import { decrement, deleteItem, increment, ItemType } from "@/app/actions";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "./ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface Props {
  item: ItemType;
}

const Item = ({ item }: Props) => {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isPending, startTransition] = useTransition();

  return (
    <div>
      <div>
        <div>
          <span key={item.id}>
            {item.name}: {item.qtyRemaining}
          </span>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() =>
              startTransition(() => {
                decrement(item, item.qtyRemaining).then((res) => {
                  if (!res) return;
                  router.refresh();
                });
              })
            }
          >
            Decrement
          </button>
          <button
            onClick={() => {
              startTransition(() => {
                increment(item, item.qtyRemaining).then((res) => {
                  if (!res) return;
                  router.refresh();
                });
              });
            }}
          >
            Increment
          </button>
        </div> 
      </div>
      <div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={() => deleteItem(item)}
              >
                Delete
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>This button will be disabled when the item is part of a bundle.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default Item;
