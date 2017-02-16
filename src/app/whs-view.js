import * as WHS from 'whs';
// import * as PHYSICS from 'physics-module-ammonext';

export default class WhsView {
  construtor() {

  }

  attached() {
    this.initializeScene();
  }

  initializeScene() {
    this.app = new WHS.App([
      new WHS.app.ElementModule({
        container: this.whsContainer
      }),
      new WHS.app.SceneModule(),
      new WHS.app.CameraModule({
        position: {
          y: 10,
          z: 50
        }
      }),
      new WHS.app.RenderingModule({
        bgColor: 0x162129,

        renderer: {
          antialias: true,
          shadowmap: {
            type: THREE.PCFSoftShadowMap
          }
        }
      }, { shadow: true }),
      // new PHYSICS.WorldModule({
      //   ammo: 'https://cdn.rawgit.com/WhitestormJS/physics-module-ammonext/75634e80/vendor/ammo.js'
      // }),
      new WHS.app.ResizeModule(),
      new WHS.controls.OrbitModule()
    ]);

    // Sphere
    const sphere = new WHS.Sphere({ // Create sphere comonent.
      geometry: {
        radius: 5,
        widthSegments: 32,
        heightSegments: 32
      },

      // modules: [
      //   new PHYSICS.SphereModule({
      //     mass: 10
      //   })
      // ],

      material: new THREE.MeshPhongMaterial({
        color: 0xF2F2F2
      }),

      position: new THREE.Vector3(0, 15, 0)
    });

    sphere.addTo(this.app);

    // Plane
    new WHS.Plane({
      geometry: {
        width: 100,
        height: 100
      },

      // modules: [
      //   new PHYSICS.PlaneModule({
      //     mass: 0
      //   })
      // ],

      material: new THREE.MeshPhongMaterial({ color: 0x447F8B }),

      rotation: {
        x: -Math.PI / 2
      }
    }).addTo(this.app);

    // Lights
    new WHS.PointLight({
      light: {
        intensity: 0.5,
        distance: 100
      },

      shadow: {
        fov: 90
      },

      position: new THREE.Vector3(0, 10, 10)
    }).addTo(this.app);

    new WHS.AmbientLight({
      light: {
        intensity: 0.4
      }
    }).addTo(this.app);

    this.app.start();
  }
}
