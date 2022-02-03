import type { NexusGenFieldTypes } from "../generated/nexus";

export const encodeId = (
  node: keyof Omit<NexusGenFieldTypes, "Query" | "Mutation">,
  databaseId: bigint | number,
) => {
  return Buffer.from(`${node}:${databaseId}`).toString("base64");
};

export const decodeId = (id: string) => {
  try {
    const decodedId = Buffer.from(id, "base64").toString().split(":");
    return {
      databaseId: BigInt(decodedId[1]),
      nodeName: decodedId[0],
    };
  } catch {
    throw new Error("Invalid id");
  }
};
