"use client"

import Link from "next/link";
import { buttonVariants } from "./ui/button";

const CreateButtons = () => {
  return (
    <div className="flex items-center justify-center flex-row gap-4">
      <Link className={buttonVariants()} href="/">To Dashboard</Link>
      <Link className={buttonVariants()} href="/createitem">Create Item</Link>
      <Link className={buttonVariants()} href="/createbundle">Create Bundle</Link>
    </div>
  )
}

export default CreateButtons