import { Role, Status } from "@prisma/client";
import { enumType, objectType } from "nexus";
import { User } from "nexus-prisma";

const roleEnum = enumType({
  name: "Role",
  members: Object.values(Role),
});
const statusEnum = enumType({
  name: "Status",
  members: Object.values(Status),
});

export const userObject = objectType({
  name: User.$name,
  description: User.$description,
  definition: (t) => {
    t.field(User.id);
    t.field(User.username);
    t.field(User.nickname);
    t.field(User.email);
    t.field(User.role.name, { type: roleEnum });
    t.field(User.status.name, { type: statusEnum });
    t.field(User.createdAt);
    t.field(User.updatedAt);
  },
});
