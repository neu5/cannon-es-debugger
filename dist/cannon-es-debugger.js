import {Vec3 as $8U3xs$Vec3, Quaternion as $8U3xs$Quaternion, Shape as $8U3xs$Shape} from "cannon-es";
import {StandardMaterial as $8U3xs$StandardMaterial, Color3 as $8U3xs$Color3, MeshBuilder as $8U3xs$MeshBuilder, Quaternion as $8U3xs$Quaternion1, Vector3 as $8U3xs$Vector3} from "@babylonjs/core";



function $e0527c80eefcc548$export$2e2bcd8739ae039(scene, world, { color: color = 0x00ff00 , scale: scale = 1 , onInit: onInit , onUpdate: onUpdate  } = {}) {
    const _meshes = [];
    // const _material = new MeshBasicMaterial({ color: color ?? 0x00ff00, wireframe: true })
    const _material = new (0, $8U3xs$StandardMaterial)("myMaterial", scene);
    _material.diffuseColor = new (0, $8U3xs$Color3)(0, 1, 0);
    _material.wireframe = true;
    const _tempVec0 = new (0, $8U3xs$Vec3)();
    const _tempVec1 = new (0, $8U3xs$Vec3)();
    const _tempVec2 = new (0, $8U3xs$Vec3)();
    const _tempQuat0 = new (0, $8U3xs$Quaternion)();
    //   function createConvexPolyhedronGeometry(shape: ConvexPolyhedron): BufferGeometry {
    //     const geometry = new BufferGeometry()
    //     // Add vertices
    //     const positions = []
    //     for (let i = 0; i < shape.vertices.length; i++) {
    //       const vertex = shape.vertices[i]
    //       positions.push(vertex.x, vertex.y, vertex.z)
    //     }
    //     geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
    //     // Add faces
    //     const indices = []
    //     for (let i = 0; i < shape.faces.length; i++) {
    //       const face = shape.faces[i]
    //       const a = face[0]
    //       for (let j = 1; j < face.length - 1; j++) {
    //         const b = face[j]
    //         const c = face[j + 1]
    //         indices.push(a, b, c)
    //       }
    //     }
    //     geometry.setIndex(indices)
    //     geometry.computeBoundingSphere()
    //     geometry.computeVertexNormals()
    //     return geometry
    //   }
    //   function createTrimeshGeometry(shape: Trimesh): BufferGeometry {
    //     const geometry = new BufferGeometry()
    //     const positions = []
    //     const v0 = _tempVec0
    //     const v1 = _tempVec1
    //     const v2 = _tempVec2
    //     for (let i = 0; i < shape.indices.length / 3; i++) {
    //       shape.getTriangleVertices(i, v0, v1, v2)
    //       positions.push(v0.x, v0.y, v0.z)
    //       positions.push(v1.x, v1.y, v1.z)
    //       positions.push(v2.x, v2.y, v2.z)
    //     }
    //     geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
    //     geometry.computeBoundingSphere()
    //     geometry.computeVertexNormals()
    //     return geometry
    //   }
    //   function createHeightfieldGeometry(shape: Heightfield): BufferGeometry {
    //     const geometry = new BufferGeometry()
    //     const s = shape.elementSize || 1 // assumes square heightfield, else i*x, j*y
    //     const positions = shape.data.flatMap((row, i) => row.flatMap((z, j) => [i * s, j * s, z]))
    //     const indices = []
    //     for (let xi = 0; xi < shape.data.length - 1; xi++) {
    //       for (let yi = 0; yi < shape.data[xi].length - 1; yi++) {
    //         const stride = shape.data[xi].length
    //         const index = xi * stride + yi
    //         indices.push(index + 1, index + stride, index + stride + 1)
    //         indices.push(index + stride, index + 1, index)
    //       }
    //     }
    //     geometry.setIndex(indices)
    //     geometry.setAttribute('position', new Float32BufferAttribute(positions, 3))
    //     geometry.computeBoundingSphere()
    //     geometry.computeVertexNormals()
    //     return geometry
    //   }
    function createMesh(shape) {
        let mesh;
        const { SPHERE: SPHERE , BOX: BOX , PLANE: PLANE , CYLINDER: CYLINDER , CONVEXPOLYHEDRON: CONVEXPOLYHEDRON , TRIMESH: TRIMESH , HEIGHTFIELD: HEIGHTFIELD  } = (0, $8U3xs$Shape).types;
        switch(shape.type){
            case SPHERE:
                mesh = (0, $8U3xs$MeshBuilder).CreateSphere("sphere", {
                    segments: 16
                }, scene);
                mesh.rotationQuaternion = mesh.rotationQuaternion || new (0, $8U3xs$Quaternion1)();
                break;
            case PLANE:
                mesh = (0, $8U3xs$MeshBuilder).CreatePlane("plane", {
                    width: 10,
                    height: 10
                }, scene);
                mesh.rotation = new (0, $8U3xs$Vector3)(Math.PI / 2, 0, 0);
                break;
            case BOX:
                mesh = (0, $8U3xs$MeshBuilder).CreateBox("box", {}, scene);
                mesh.rotationQuaternion = mesh.rotationQuaternion || new (0, $8U3xs$Quaternion1)();
                break;
            case CYLINDER:
                {
                    const { height: height , radiusBottom: radiusBottom , radiusTop: radiusTop  } = shape;
                    mesh = (0, $8U3xs$MeshBuilder).CreateCylinder("cylinder", {
                        diameterTop: radiusTop * 2,
                        diameterBottom: radiusBottom * 2,
                        height: height
                    }, scene);
                    mesh.rotationQuaternion = mesh.rotationQuaternion || new (0, $8U3xs$Quaternion1)();
                    break;
                }
        }
        mesh.material = _material;
        scene.addMesh(mesh);
        return mesh;
    }
    function scaleMesh(mesh, shape) {
        const { SPHERE: SPHERE , BOX: BOX , PLANE: PLANE , CYLINDER: CYLINDER , CONVEXPOLYHEDRON: CONVEXPOLYHEDRON , TRIMESH: TRIMESH , HEIGHTFIELD: HEIGHTFIELD  } = (0, $8U3xs$Shape).types;
        switch(shape.type){
            case SPHERE:
                {
                    const { radius: radius  } = shape;
                    mesh.scalingDeterminant = radius * scale * 2;
                    break;
                }
            case BOX:
                {
                    const size = new (0, $8U3xs$Vector3)(shape.halfExtents.x * scale * 2, shape.halfExtents.y * scale * 2, shape.halfExtents.z * scale * 2);
                    mesh.scaling = size;
                    break;
                }
            case PLANE:
                break;
            case CYLINDER:
                break;
        }
    }
    function typeMatch(mesh, shape) {
        if (!mesh) return false;
        // const { geometry } = mesh
        return shape.type === (0, $8U3xs$Shape).types.SPHERE || shape.type === (0, $8U3xs$Shape).types.PLANE || shape.type === (0, $8U3xs$Shape).types.BOX || shape.type === (0, $8U3xs$Shape).types.CYLINDER;
    // geometry instanceof SphereGeometry && shape.type === Shape.types.SPHERE ||
    // (geometry instanceof BoxGeometry && shape.type === Shape.types.BOX) ||
    // (geometry instanceof PlaneGeometry && shape.type === Shape.types.PLANE) ||
    // (geometry.id === (shape as ComplexShape).geometryId && shape.type === Shape.types.CYLINDER) ||
    // (geometry.id === (shape as ComplexShape).geometryId && shape.type === Shape.types.CONVEXPOLYHEDRON) ||
    // (geometry.id === (shape as ComplexShape).geometryId && shape.type === Shape.types.TRIMESH) ||
    // (geometry.id === (shape as ComplexShape).geometryId && shape.type === Shape.types.HEIGHTFIELD)
    }
    function updateMesh(index, shape) {
        let mesh = _meshes[index];
        let didCreateNewMesh = false;
        if (!typeMatch(mesh, shape)) {
            if (mesh) scene.removeMesh(mesh);
            _meshes[index] = mesh = createMesh(shape);
            didCreateNewMesh = true;
        }
        scaleMesh(mesh, shape);
        return didCreateNewMesh;
    }
    function update() {
        const meshes = _meshes;
        const shapeWorldPosition = _tempVec0;
        const shapeWorldQuaternion = _tempQuat0;
        let meshIndex = 0;
        for (const body of world.bodies)for(let i = 0; i !== body.shapes.length; i++){
            const shape = body.shapes[i];
            const didCreateNewMesh = updateMesh(meshIndex, shape);
            const mesh = meshes[meshIndex];
            if (mesh) {
                // Get world position
                body.quaternion.vmult(body.shapeOffsets[i], shapeWorldPosition);
                body.position.vadd(shapeWorldPosition, shapeWorldPosition);
                // Get world quaternion
                body.quaternion.mult(body.shapeOrientations[i], shapeWorldQuaternion);
                // Copy to meshes
                mesh.position.set(shapeWorldPosition.x, shapeWorldPosition.y, shapeWorldPosition.z);
                if (mesh.rotationQuaternion) mesh.rotationQuaternion.set(shapeWorldQuaternion.x, shapeWorldQuaternion.y, shapeWorldQuaternion.z, shapeWorldQuaternion.w);
                if (didCreateNewMesh && onInit instanceof Function) onInit(body, mesh, shape);
                if (!didCreateNewMesh && onUpdate instanceof Function) onUpdate(body, mesh, shape);
            }
            meshIndex++;
        }
        for(let i1 = meshIndex; i1 < meshes.length; i1++){
            const mesh1 = meshes[i1];
            if (mesh1) scene.removeMesh(mesh1);
        }
        meshes.length = meshIndex;
    }
    return {
        update: update
    };
}


export {$e0527c80eefcc548$export$2e2bcd8739ae039 as default};
//# sourceMappingURL=cannon-es-debugger.js.map
