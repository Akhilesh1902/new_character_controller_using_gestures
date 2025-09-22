import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

class MultiEffectPostProcessor {
  constructor(renderer, scene, camera) {
    this.renderer = renderer;
    this.scene = scene;
    this.camera = camera;

    this.composer = new EffectComposer(this.renderer);
    this.renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(this.renderPass);

    this.effects = {
      grayscale: this.createShaderPass(this.GrayscaleShader()),
      sepia: this.createShaderPass(this.SepiaShader()),
      invert: this.createShaderPass(this.InvertShader()),
      bloom: this.createBloomPass(),
    };

    // By default add grayscale as example
    this.currentPass = null;
    this.enableEffect("bloom");
  }

  createShaderPass(shader) {
    const pass = new ShaderPass(shader);
    pass.renderToScreen = true;
    return pass;
  }

  createBloomPass() {
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.4, // strength - lower strength for less intense bloom
      0.4, // radius
      0.85 // threshold
    );
    bloomPass.renderToScreen = true;
    return bloomPass;
  }

  // Enables a named effect (grayscale, sepia, invert)
  enableEffect(effectName) {
    if (this.currentPass) {
      this.composer.removePass(this.currentPass);
    }
    if (this.effects[effectName]) {
      this.currentPass = this.effects[effectName];
      this.composer.addPass(this.currentPass);
    } else {
      // No effect = just render pass only
      this.currentPass = null;
    }
  }

  render() {
    this.composer.render();
  }

  // Grayscale shader
  GrayscaleShader() {
    return {
      uniforms: { tDiffuse: { value: null } },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        varying vec2 vUv;
        void main() {
          vec4 color = texture2D(tDiffuse, vUv);
          float gray = dot(color.rgb, vec3(0.299,0.587,0.114));
          gl_FragColor = vec4(vec3(gray), color.a);
        }
      `,
    };
  }

  // Sepia shader
  SepiaShader() {
    return {
      uniforms: { tDiffuse: { value: null } },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        varying vec2 vUv;
        void main() {
          vec4 color = texture2D(tDiffuse, vUv);
          vec3 c = color.rgb;
          color.r = dot(c, vec3(0.393, 0.769, 0.189));
          color.g = dot(c, vec3(0.349, 0.686, 0.168));
          color.b = dot(c, vec3(0.272, 0.534, 0.131));
          gl_FragColor = vec4(color.rgb, color.a);
        }
      `,
    };
  }

  // Invert color shader
  InvertShader() {
    return {
      uniforms: { tDiffuse: { value: null } },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        varying vec2 vUv;
        void main() {
          vec4 color = texture2D(tDiffuse, vUv);
          gl_FragColor = vec4(vec3(1.0) - color.rgb, color.a);
        }
      `,
    };
  }
}

export default MultiEffectPostProcessor;
