export const runtime = "edge";

import BundleForm from "./form";
import Backbutton from "./backbutton";
import { getItems } from "../actions";

const Page = async () => {
  const items = await getItems()
  return (
    <div className="flex gap-4">
      <div className="flex justify-between">
        <BundleForm items={items} />
      </div>
      <Backbutton />
    </div>
  );
};

export default Page;
