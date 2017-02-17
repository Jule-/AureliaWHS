import * as WHS from 'whs';

export default class DisposeSceneModule {
  integrate() {
    if (!this instanceof WHS.App) {
      throw new Error('DisposeSceneModule is only designed to be used on WHS.App instance.');
    }

    this.dispose = function() {
      console.debug('[DisposeSceneModule] Try to dispose %s children.', this.children.length);

      let lvl = '';
      const disposeChildren = child => {
        lvl += '  ';
        console.debug(lvl + '[DisposeSceneModule] Try to dispose', child, !!child.native.geometry, !!child.native.material);

        if (child.native.children) {
          child.native.children.forEach(disposeChildren);
        }

        if (child.native.geometry) {
          child.native.geometry.dispose();
        }
        if (child.native.material) {
          child.native.material.dispose();
        }

        while (child.children.length) {
          child.children.remove(child.children[0]);
        }

        lvl = lvl.slice(0, -2);
      };

      this.children.forEach(disposeChildren);
    };
  }
}
