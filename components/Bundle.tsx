"use client";

import { BundleType, decrementBundle, deleteBundle, incrementBundle } from "@/app/actions";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Button } from "./ui/button";

interface Props {
  bundle: BundleType;
}

const Bundle = ({ bundle }: Props) => {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isPending, startTransition] = useTransition();

  return (
    <div>
      <div>
        <div>
          <span key={bundle.id}>
            {bundle.name}: {bundle.qtySold}
          </span>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() =>
              startTransition(() => {
                incrementBundle(bundle).then((res) => {
                  if (!res) return;
                  router.refresh();
                });
              })
            }
          >
            Increment
          </button>
          <button
            onClick={() =>
              startTransition(() => {
                decrementBundle(bundle).then((res) => {
                  if (!res) return;
                  router.refresh();
                });
              })
            }
          >
            Decrement
          </button>
        </div>
      </div>
      <div>
        <Button onClick={() => deleteBundle(bundle)}>Delete</Button> 
      </div>
    </div>
  );
};

export default Bundle;
