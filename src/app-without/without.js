let app = null;
let sphere = null;

let sphereCount = 0;

function initializeWHS() {
  app = new WHS.App([
    new WHS.app.ElementModule(),
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
    new WHS.controls.OrbitModule()
  ]);

  // Sphere
  sphere = new WHS.Sphere({
    geometry: {
      radius: 5,
      widthSegments: 32,
      heightSegments: 32
    },

    material: new THREE.MeshPhongMaterial({
      color: 0xF2F2F2
    }),

    position: new THREE.Vector3(0, 15, 0),

    name: 'Sphere_' + sphereCount++
  });

  sphere.addTo(app);

  // Plane
  new WHS.Plane({
    geometry: {
      width: 100,
      height: 100
    },

    material: new THREE.MeshPhongMaterial({ color: 0x447F8B }),

    rotation: {
      x: -Math.PI / 2
    }
  }).addTo(app);

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
  }).addTo(app);

  new WHS.AmbientLight({
    light: {
      intensity: 0.4
    }
  }).addTo(app);

  app.start();
}

let stopAnimation = false;
function animate() {
  clean(true);
  initializeWHS();

  if (!stopAnimation) {
    setTimeout(function() {
      requestAnimationFrame(animate);
    }, 100);
  }
}

function disposeAll3dObjects() {
  console.debug('[DisposeSceneModule] Try to dispose %s children.', app.children.length);

  let lvl = '';
  function disposeChildren(child) {
    lvl += '  ';
    console.debug('[DisposeSceneModule]' + lvl + ' Try to dispose', child, !!child.native.geometry, !!child.native.material);

    if (child.children) {
      child.children.forEach(disposeChildren);
    }

    if (child.native.geometry) {
      console.debug('[DisposeSceneModule]' + lvl + ' geometry');
      child.native.geometry.dispose();
    }
    if (child.native.material) {
      if (child.native.material.map) {
        console.debug('[DisposeSceneModule]' + lvl + ' texture');
        child.native.material.map.dispose();
      }

      console.debug('[DisposeSceneModule]' + lvl + ' material');
      child.native.material.dispose();
    }

    child.parent.remove(child);

    lvl = lvl.slice(0, -2);
  }

  app.children.forEach(disposeChildren);
}

function clean(disposeSceneGraph) {
  if (!app) {
    console.log('Nothing to clean. Initialize scene first.');
    return;
  }

  if (disposeSceneGraph) {
    /**
     * Without calling this something throw in WHS when calling `forceContextLoss()`.
     */
    disposeAll3dObjects();
  }

  app.$rendering.forceContextLoss();
  /**
   * Seems equivalent to:
   *
   * let gl = app.$rendering.getContext('webgl');
   * gl.getExtension('WEBGL_lose_context').loseContext();
   *
   */

  sphere = null;
  app = null;

  let whsElt = document.getElementsByClassName('whs')[0];
  whsElt.parentNode.removeChild(whsElt);
}

function startAnimate() {
  if (!app) {
    initializeWHS();
  }
  stopAnimation = false;
  animate();
}

function stopAnimate() {
  stopAnimation = true;
}
