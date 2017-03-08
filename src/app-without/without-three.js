let container = document.createElement('div');
document.body.appendChild(container);

let camera = null;
let scene = null;
let renderer = null;

function initializeTHREE() {
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.z = 200;

  scene = new THREE.Scene();

  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(0xffffff);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  let geometry = new THREE.SphereBufferGeometry(50, Math.random() * 64, Math.random() * 32);
  let texture = new THREE.CanvasTexture(createImage());
  let material = new THREE.MeshBasicMaterial({ map: texture, wireframe: true });
  let mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
}

function createImage() {
  let canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  let context = canvas.getContext('2d');
  context.fillStyle = 'rgb(' + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ',' + Math.floor(Math.random() * 256) + ')';
  context.fillRect(0, 0, 256, 256);
  return canvas;
}

function animate() {
  clean(false);
  initializeTHREE();
  renderer.render(scene, camera);

  setTimeout(function() {
    requestAnimationFrame(animate);
  }, 10);
}

function disposeAll3dObjects() {
  console.debug('[DisposeSceneModule] Try to dispose %s children.', scene.children.length);

  let lvl = '';
  function disposeChildren(child) {
    lvl += '  ';
    console.debug(lvl + '[DisposeSceneModule] Try to dispose', child, !!child.geometry, !!child.material);

    if (child.children) {
      child.children.forEach(disposeChildren);
    }

    /**
     * Even material and geometry seems to not leaking when we remove the context and not dispose them.
     */
    if (child.geometry) {
      console.debug(lvl + '[DisposeSceneModule] geometry');
      child.geometry.dispose();
    }
    if (child.material) {
      if (child.material.map) {
        console.debug(lvl + '[DisposeSceneModule] texture');
        child.material.map.dispose();
      }

      console.debug(lvl + '[DisposeSceneModule] material');
      child.material.dispose();
    }

    child.parent.remove(child);

    lvl = lvl.slice(0, -2);
  }

  scene.children.forEach(disposeChildren);
}

function clean(disposeSceneGraph) {
  if (disposeSceneGraph) {
    /**
     * Strangely, it seems that calling this is unecessary while it is mandatory for WHS.
     */
    disposeAll3dObjects();
  }

  /**
   * This prevents from getting warning when Chrome dispose webgl context itself since too many are opened.
   */
  renderer.context.getExtension('WEBGL_lose_context').loseContext();

  container.removeChild(renderer.domElement);

  /**
   * Seems that this is not making any change:
   *
   * renderer.dispose();
   * renderer.canvas = null;
   * renderer.domElement = null;
   * renderer._gl = null;
   */

  camera = scene = renderer = null;
}

initializeTHREE();
animate();
