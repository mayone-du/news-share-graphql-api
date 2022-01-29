import { interfaceType } from "nexus";

// TODO: 使用していない。用途を確認
export const user = interfaceType({
  name: "Node",
  definition: (t) => {
    t.id("id");
  },
  resolveType: (_root, _context, _info) => {
    return "User";
  },
});
