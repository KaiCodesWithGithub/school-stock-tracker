import { getItems } from "@/app/actions";
import { TableCell, TableRow } from "./ui/table";

const ItemIdRows = async () => {
  return (
    <>
      {(await getItems()).map((item) => {
        return (
          <TableRow key={item.id}>
            <TableCell className="font-medium">{item.name}</TableCell>
            <TableCell>{item.id}</TableCell>
          </TableRow>
        );
      })}
    </>
  );
};

export default ItemIdRows;
