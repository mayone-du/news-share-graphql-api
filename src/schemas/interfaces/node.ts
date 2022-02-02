import { interfaceType } from "nexus";

export const node = interfaceType({
  name: "Node",
  definition(t) {
    t.id("id");
  },
});
