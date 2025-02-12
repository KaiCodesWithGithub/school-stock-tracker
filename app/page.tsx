import { getBundles, getItems } from "./actions";
import { redirect } from "next/navigation";
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ItemRow from "@/components/item/ItemRow";
import BundleRow from "@/components/bundle/BundleRow";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default async function Home() {
  const items = await getItems();
  const bundles = await getBundles();
  if (items.length === 0) {
    redirect("/createitem");
  }
  return (
    <>
      <div className="flex items-center flex-row justify-between">
        <div>
          <h1 className="text-4xl font-bold">Stall Stock</h1>
        </div>
        <div>
          <Link className={buttonVariants()} href="/edit">
            Edit
          </Link>
        </div>
      </div>
      <Table>
        <TableCaption>View Stall Stock Above</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Item Name</TableHead>
            <TableHead></TableHead>
            <TableHead>Stock Remaining</TableHead>
            <TableHead className="flex items-center justify-end">
              Controls
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <ItemRow key={item.id} item={item} />
          ))}
        </TableBody>
      </Table>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Bundle Name</TableHead>
            <TableHead></TableHead>
            <TableHead>Stock Remaining</TableHead>
            <TableHead>Bundles Sold</TableHead>
            <TableHead>Controls</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bundles.map((bundle) => (
            <BundleRow key={bundle.id} bundle={bundle} />
          ))}
        </TableBody>
      </Table>
    </>
  );
}
