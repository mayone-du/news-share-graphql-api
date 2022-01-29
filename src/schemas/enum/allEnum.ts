import { Prisma } from "@prisma/client";
import { enumType } from "nexus";

export const allEnum = Prisma.dmmf.datamodel.enums.map((e) => {
  return enumType({
    name: e.name,
    members: e.values,
  });
});
