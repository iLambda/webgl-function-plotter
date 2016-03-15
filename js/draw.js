function init() {
  // get the canvas
  var canvas = document.getElementById("glcanvas");
  // create context
  initGL(canvas)
  // if webgl is running, draw
  if (gl) {
    draw()
  }
}

function initGL(canvas) {
  // sets global var gl to null
  gl = null;
  // try to retreive standard gl context
  try { gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl"); }
  catch(e) { }
  // that feel when no GL
  if (!gl) {
      alert("Impossible d'initialiser le WebGL. Il est possible que votre navigateur ne supporte pas cette fonctionnalité.");
  }
}

function draw() {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);                      // Met la couleur d'effacement au noir et complétement opaque
  gl.enable(gl.DEPTH_TEST);                               // Active le test de profondeur
  gl.depthFunc(gl.LEQUAL);                                // Les objets proches cachent les objets lointains
  gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);      // Efface les couleurs et le buffer de profondeur.
}
