"use client"

import { BundleType } from "@/app/actions";
import Bundle from "./Bundle";

const BundleWrapper = ({ bundle }: { bundle: BundleType }) => {
  return (
    <Bundle bundle={bundle}  />
  );
};

export default BundleWrapper;
