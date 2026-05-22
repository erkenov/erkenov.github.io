import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import { KHRONOS_EXTENSIONS } from "@gltf-transform/extensions";

const io = new NodeIO().registerExtensions(KHRONOS_EXTENSIONS);
const doc = await io.read("./public/macbook.glb");
const root = doc.getRoot();

const nodes = root.listNodes();
console.log(`Total nodes: ${nodes.length}\n`);
nodes.forEach((n, i) => {
  const mesh = n.getMesh();
  const children = n.listChildren();
  console.log(`#${i}  "${n.getName()}"  ${mesh ? `(mesh: ${mesh.getName()})` : ""}  ${children.length ? `children=[${children.map(c => '"' + c.getName() + '"').join(",")}]` : ""}`);
});

console.log(`\nTotal meshes: ${root.listMeshes().length}`);
root.listMeshes().forEach((m, i) => {
  console.log(`Mesh #${i}: "${m.getName()}"`);
});
