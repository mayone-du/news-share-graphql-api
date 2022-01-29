import { enumType } from "nexus";

export const sortOrder = enumType({
  name: "SortOrder",
  members: ["asc", "desc"],
});
