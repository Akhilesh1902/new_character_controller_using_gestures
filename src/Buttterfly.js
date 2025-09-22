import * as THREE from "three";
import ButterflyVertexShader from "./shaders/bv.js";
import ButterflyFragmentShader from "./shaders/bf.js";

import butterflyTexture from "./textures/butterFlyTexture/butterfly-old.png";

function rand(co) {
  return Math.fract(Math.sin(dot(co, [12.9898, 78.233])) * 43758.5453);
}

function dot(a, b) {
  return a[0] * b[0] + a[1] * b[1];
}

Math.fract = function (x) {
  return x - Math.floor(x);
};

export default class Butterflies {
  constructor(scene) {
    this.scene = scene;
    this.speed = 0.02;
    this.quantity = 50;
    this.yboundary = 1;
    this.parameters = {
      quantity: 20,
      boundary: 10,
      yboundary: 1,
    };

    //get butterfly texture
    // this.butterflyTexture = this.resources.items.butterflyTexture;
    this.butterflyTexture = new THREE.TextureLoader().load(butterflyTexture);

    this.geometry = new THREE.PlaneGeometry(1, 1, 2, 1);
    this.material = new THREE.ShaderMaterial({
      vertexShader: ButterflyVertexShader,
      fragmentShader: ButterflyFragmentShader,
      transparent: true,
      // opacity: 0.5,
      side: THREE.DoubleSide,
      uniforms: {
        uTime: { value: 0.0 },
        texture1: { value: this.butterflyTexture },
      },
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    //rotate the mesh
    this.mesh.rotation.x = -Math.PI * 0.5;
    this.mesh.position.y += 0.001;
    this.mesh.scale.set(0.1, 0.1, 0.1);

    this.butterflies = new THREE.Group();
    this.populate();

    this.scene.add(this.butterflies);
  }
  populate() {
    for (let i = 0; i < this.parameters.quantity; i++) {
      let butterflyGeometry = this.geometry.clone(); // Clone geometry
      let displacement = new Float32Array(
        butterflyGeometry.attributes.position.count
      );
      for (let j = 0; j < displacement.length; j++) {
        displacement[j] = i;
      }

      let displacementAttribute = new THREE.BufferAttribute(displacement, 1);
      displacementAttribute.setUsage(THREE.DynamicDrawUsage); // Set to dynamic if needed
      butterflyGeometry.setAttribute("displacement", displacementAttribute);

      let butterfly = new THREE.Mesh(butterflyGeometry, this.material); // Use the cloned geometry
      //scale to 0.1
      butterfly.scale.set(0.1, 0.1, 0.1);
      //rotate
      butterfly.rotation.x = -Math.PI * 0.5;
      // slight variation in rotation
      butterfly.rotation.y = Math.random() * Math.PI * 0.1;
      butterfly.rotation.z = Math.random() * Math.PI;

      butterfly.position.x = (Math.random() - 0.5) * this.parameters.boundary;
      butterfly.position.y = Math.random() - 0.5;
      butterfly.position.z = (Math.random() - 0.5) * this.parameters.boundary;
      this.butterflies.add(butterfly);
    }
  }
  depopulate() {
    const group = this.butterflies;
    if (!(group instanceof THREE.Group)) {
      console.error("Provided object is not a THREE.Group");
      return;
    }

    group.children.forEach((child) => {
      if (child instanceof THREE.Mesh) {
        // Dispose geometry
        if (child.geometry) {
          child.geometry.dispose();
        }

        // Dispose materials
        if (Array.isArray(child.material)) {
          child.material.forEach((material) => {
            if (material.dispose) {
              material.dispose();
            }
          });
        } else if (child.material && child.material.dispose) {
          child.material.dispose();
        }

        // Remove child from the group
        group.remove(child);
      }
    });
  }
  update(clock) {
    this.material.uniforms.uTime.value = clock.getElapsedTime() * 0.2;
    // iterate through every butterfly with a forEach loop, increment the position vector of the butterfly by 0.01 in the orientation direciton
    this.butterflies.children.forEach((butterfly) => {
      // get the vector of the butterflies orientation
      let vector = new THREE.Vector3(0, 1, 0);
      vector.applyQuaternion(butterfly.quaternion);
      vector.normalize();
      // increment the position vector of the butterfly by 0.01 in the orientation direciton
      butterfly.position.add(
        vector.multiplyScalar(
          this.speed *
            (0.5 +
              1.0 *
                rand([
                  //butterfly attribute displacement
                  butterfly.geometry.attributes.displacement.array[0],
                  0.0,
                ]))
        )
      );
      // reset the position if the butterfly is too far away
      if (butterfly.position.x > this.parameters.boundary) {
        butterfly.position.x = -1 * this.parameters.boundary;
      }
      if (butterfly.position.x < -1 * this.parameters.boundary) {
        butterfly.position.x = this.parameters.boundary;
      }
      if (butterfly.position.y > this.parameters.yboundary) {
        butterfly.position.y = -1 * this.parameters.yboundary;
      }
      if (butterfly.position.y < 0) {
        butterfly.position.y = this.parameters.yboundary;
      }
      if (butterfly.position.z > this.parameters.boundary) {
        butterfly.position.z = -1 * this.parameters.boundary;
      }
      if (butterfly.position.z < -1 * this.parameters.boundary) {
        butterfly.position.z = this.parameters.boundary;
      }
    });
  }
}
