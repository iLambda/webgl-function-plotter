function init() {
  // get the canvas
  var canvas = document.getElementById("glcanvas")
  // create context
  initGL(canvas)
  // init shaders
  initShaders()
  // init mesh & buffers
  initMesh()
  initBuffers()
  // if webgl is running, draw
  if (gl) {
    draw()
  }
}

function initGL(canvas) {
  // sets global var gl to null
  gl = null
  // try to retreive standard gl context
  try { gl = canvas.getContext("webgl", {antialias: false}) || canvas.getContext("experimental-webgl", {antialias: false}) }
  catch(e) { }
  // that feel when no GL
  if (!gl) {
      alert("Impossible d'initialiser le WebGL. Il est possible que votre navigateur ne supporte pas cette fonctionnalité.")
  }
}

function initShaders() {
  var fragmentShader = getShader(gl, "shader-fs")
  var vertexShader = getShader(gl, "shader-vs")

  // create the shader
  shaderProgram = gl.createProgram()
  gl.attachShader(shaderProgram, vertexShader)
  gl.attachShader(shaderProgram, fragmentShader)
  gl.linkProgram(shaderProgram)

  // an error occured
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Impossible d'initialiser le shader.")
  }

  // use the shader
  gl.useProgram(shaderProgram)
  vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition")
  gl.enableVertexAttribArray(vertexPositionAttribute)
}

function getShader(gl, id) {
  // retrieve the dom element
  var shaderScript, theSource, currentChild, shader
  shaderScript = document.getElementById(id)
  if (!shaderScript) { return null }
  theSource = ""
  currentChild = shaderScript.firstChild

  // find the node
  while(currentChild) {
    if (currentChild.nodeType == currentChild.TEXT_NODE) {
      theSource += currentChild.textContent
    }
    currentChild = currentChild.nextSibling
  }

  // create the shader
  if (shaderScript.type == "x-shader/x-fragment") {
    shader = gl.createShader(gl.FRAGMENT_SHADER)
  } else if (shaderScript.type == "x-shader/x-vertex") {
    shader = gl.createShader(gl.VERTEX_SHADER)
  } else {
     // unrecognized shader
     return null
  }

  // compile the shader
  gl.shaderSource(shader, theSource)
  gl.compileShader(shader)

  // check if compilation is successful
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert("Une erreur est survenue au cours de la compilation des shaders: " + gl.getShaderInfoLog(shader))
      return null
  }

  // return the shader
  return shader
}

function initBuffers() {
  // initialize the buffer
  squareVerticesBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, squareVerticesBuffer)
  // bind the buffer
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)
}

function multMatrix(m) {
  mvMatrix = mvMatrix.x(m)
}

function mvTranslate(v) {
  multMatrix(Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4())
}

function setMatrixUniforms() {
  var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix")
  gl.uniformMatrix4fv(pUniform, false, new Float32Array(perspectiveMatrix.flatten()))

  var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix")
  gl.uniformMatrix4fv(mvUniform, false, new Float32Array(mvMatrix.flatten()))
}
