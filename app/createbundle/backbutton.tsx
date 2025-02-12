"use client"

import { Button } from "@/components/ui/button";
import { redirect } from "next/navigation";

const Backbutton = () => {
  return (
    <Button onClick={() => redirect("/edit")}>
      Go back home (make sure you have saved first)
    </Button>
  );
};

export default Backbutton;
