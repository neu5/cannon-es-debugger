'use strict';

var cannonEs = require('cannon-es');
var core = require('@babylonjs/core');

const BABYLON_DEBUGGER = "CANNONES_DEBUGGER_BABYLONJS";

const getMeshName = (name, num) => name + "_" + BABYLON_DEBUGGER + "_" + num;

function CannonDebugger(scene, world, _temp) {
  let {
    color = {
      r: 0,
      g: 1,
      b: 0
    },
    scale = 1,
    onInit,
    onUpdate
  } = _temp === void 0 ? {} : _temp;
  const meshes = [];
  const material = new core.StandardMaterial("myMaterial", scene);
  material.diffuseColor = new core.Color3(color.r, color.g, color.b);
  material.wireframe = true;
  const tempVec0 = new cannonEs.Vec3();
  const tempQuat0 = new cannonEs.Quaternion();
  let meshCounter = 0;

  function createMesh(shape) {
    let mesh;
    const {
      SPHERE,
      BOX,
      PLANE,
      CYLINDER,
      TRIMESH
    } = cannonEs.Shape.types;

    switch (shape.type) {
      case BOX:
        {
          mesh = core.MeshBuilder.CreateBox(getMeshName("box", meshCounter), {}, scene);
          meshCounter = meshCounter + 1;
          mesh.rotationQuaternion = mesh.rotationQuaternion || new core.Quaternion();
          break;
        }

      case CYLINDER:
        {
          const {
            height,
            numSegments,
            radiusBottom,
            radiusTop
          } = shape;
          mesh = core.MeshBuilder.CreateCylinder(getMeshName("cylinder", meshCounter), {
            diameterTop: radiusTop * 2,
            diameterBottom: radiusBottom * 2,
            height,
            tessellation: numSegments
          }, scene);
          meshCounter = meshCounter + 1;
          mesh.rotationQuaternion = mesh.rotationQuaternion || new core.Quaternion();
          break;
        }

      case PLANE:
        {
          mesh = core.MeshBuilder.CreatePlane(getMeshName("plane", meshCounter), {
            width: 10,
            height: 10
          }, scene);
          meshCounter = meshCounter + 1;
          mesh.rotation = new core.Vector3(Math.PI / 2, 0, 0);
          break;
        }

      case SPHERE:
        {
          mesh = core.MeshBuilder.CreateSphere(getMeshName("sphere", meshCounter), {
            segments: 16
          }, scene);
          meshCounter = meshCounter + 1;
          mesh.rotationQuaternion = mesh.rotationQuaternion || new core.Quaternion();
          break;
        }

      case TRIMESH:
        {
          mesh = new core.Mesh(getMeshName("trimesh", meshCounter), scene);
          const vertexData = new core.VertexData();
          const {
            indices,
            vertices
          } = shape;
          const normals = [];
          vertexData.positions = vertices;
          vertexData.indices = indices;
          core.VertexData.ComputeNormals(vertices, mesh.getIndices(), normals, {
            useRightHandedSystem: true
          });
          mesh.setVerticesData(core.VertexBuffer.NormalKind, normals);
          vertexData.applyToMesh(mesh);
          meshCounter = meshCounter + 1;
          mesh.rotationQuaternion = mesh.rotationQuaternion || new core.Quaternion();
          break;
        }
    }

    if (!mesh) {
      return;
    }

    mesh.material = material;
    scene.addMesh(mesh);
    return mesh;
  }

  function scaleMesh(mesh, shape) {
    const {
      SPHERE,
      BOX,
      PLANE,
      CYLINDER,
      TRIMESH
    } = cannonEs.Shape.types;

    switch (shape.type) {
      case BOX:
        {
          const {
            halfExtents
          } = shape;
          const size = new core.Vector3(halfExtents.x * scale * 2, halfExtents.y * scale * 2, halfExtents.z * scale * 2);
          mesh.scaling = size;
          break;
        }

      case CYLINDER:
        {
          break;
        }

      case PLANE:
        {
          break;
        }

      case SPHERE:
        {
          const {
            radius
          } = shape;
          mesh.scalingDeterminant = radius * scale * 2;
          break;
        }

      case TRIMESH:
        mesh.scaling.x = scale;
        mesh.scaling.y = scale;
        mesh.scaling.z = scale;
        break;
    }
  }

  function typeMatch(mesh, shape) {
    if (!mesh) {
      return false;
    }

    return shape.type === cannonEs.Shape.types.SPHERE || shape.type === cannonEs.Shape.types.PLANE || shape.type === cannonEs.Shape.types.BOX || shape.type === cannonEs.Shape.types.CYLINDER || shape.type === cannonEs.Shape.types.TRIMESH;
  }

  function updateMesh(index, shape) {
    let mesh = meshes[index];
    let didCreateNewMesh = false;

    if (!typeMatch(mesh, shape)) {
      if (mesh) {
        scene.removeMesh(mesh);
      }

      const newMesh = createMesh(shape);

      if (newMesh) {
        meshes[index] = mesh = newMesh;
      }

      didCreateNewMesh = true;
    }

    scaleMesh(mesh, shape);
    return didCreateNewMesh;
  }

  function update() {
    const meshesCopy = meshes;
    const shapeWorldPosition = tempVec0;
    const shapeWorldQuaternion = tempQuat0;
    let meshIndex = 0;

    for (const body of world.bodies) {
      for (let i = 0; i !== body.shapes.length; i++) {
        const shape = body.shapes[i];
        const didCreateNewMesh = updateMesh(meshIndex, shape);
        const mesh = meshesCopy[meshIndex];

        if (mesh) {
          // Get world position
          body.quaternion.vmult(body.shapeOffsets[i], shapeWorldPosition);
          body.position.vadd(shapeWorldPosition, shapeWorldPosition); // Get world quaternion

          body.quaternion.mult(body.shapeOrientations[i], shapeWorldQuaternion); // Copy to meshes

          mesh.position.set(shapeWorldPosition.x, shapeWorldPosition.y, shapeWorldPosition.z);

          if (mesh.rotationQuaternion) {
            mesh.rotationQuaternion.set(shapeWorldQuaternion.x, shapeWorldQuaternion.y, shapeWorldQuaternion.z, shapeWorldQuaternion.w);
          }

          if (didCreateNewMesh && onInit instanceof Function) onInit(body, mesh, shape);
          if (!didCreateNewMesh && onUpdate instanceof Function) onUpdate(body, mesh, shape);
        }

        meshIndex++;
      }
    }

    for (let i = meshIndex; i < meshes.length; i++) {
      const mesh = meshes[i];
      if (mesh) scene.removeMesh(mesh);
    }

    meshes.length = meshIndex;
  }

  return {
    update
  };
}

module.exports = CannonDebugger;
