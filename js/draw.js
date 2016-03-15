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

function initShaders() {
  var fragmentShader = getShader(gl, "shader-fs");
  var vertexShader = getShader(gl, "shader-vs");

  // create the shader
  var shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // an error occured
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Impossible d'initialiser le shader.");
  }

  // use the shader
  gl.useProgram(shaderProgram)
  vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
  gl.enableVertexAttribArray(vertexPositionAttribute);
}

function getShader(gl, id) {
  // retrieve the dom element
  var shaderScript, theSource, currentChild, shader;
  shaderScript = document.getElementById(id);
  if (!shaderScript) { return null; }
  theSource = "";
  currentChild = shaderScript.firstChild;

  // find the node
  while(currentChild) {
    if (currentChild.nodeType == currentChild.TEXT_NODE) {
      theSource += currentChild.textContent;
    }
    currentChild = currentChild.nextSibling;
  }

  // create the shader
  if (shaderScript.type == "x-shader/x-fragment") {
    shader = gl.createShader(gl.FRAGMENT_SHADER);
  } else if (shaderScript.type == "x-shader/x-vertex") {
    shader = gl.createShader(gl.VERTEX_SHADER);
  } else {
     // unrecognized shader
     return null;
  }

  // compile the shader
  gl.shaderSource(shader, theSource);
  gl.compileShader(shader);

  // check if compilation is successful
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert("Une erreur est survenue au cours de la compilation des shaders: " + gl.getShaderInfoLog(shader));
      return null;
  }

  // return the shader
  return shader;
}

function initBuffers() {
  // initialize the buffer
  squareVerticesBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);
  // the vertex set
  var vertices = [
    1.0,  1.0,  0.0,
    -1.0, 1.0,  0.0,
    1.0,  -1.0, 0.0,
    -1.0, -1.0, 0.0
  ];
  // bind the buffer
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
}

function multMatrix(m) {
  mvMatrix = mvMatrix.x(m);
}

function mvTranslate(v) {
  multMatrix(Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4());
}

function setMatrixUniforms() {
  var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
  gl.uniformMatrix4fv(pUniform, false, new Float32Array(perspectiveMatrix.flatten()));

  var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
  gl.uniformMatrix4fv(mvUniform, false, new Float32Array(mvMatrix.flatten()));
}

function draw() {
  // blacks out the screen
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // activate depth test
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);
  // clears screen & depth buffer
  gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

  // creates the persp. matrix
  perspectiveMatrix = makePerspective(45, 1.0, 0.1, 100.0);
  // load identity
  mvMatrix = Matrix.I(4);
  mvTranslate([-0.0, 0.0, -6.0]);
  // bind buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer);
  gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
  setMatrixUniforms();
  // draw
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}
