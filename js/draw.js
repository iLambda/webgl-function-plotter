planet = function (i, j) {
  var iF = i - 100/2
  var jF = j - 100/2
  var variance = 2
  var amplitude = 1.5
  return -amplitude * Math.exp(-Math.pow(iF/(2*variance), 2) - Math.pow(jF/(2*variance), 2))
}

bhole = function (i, j) {
  var iF = i - 100/2
  var jF = j - 100/2

  var variance = 2
  var amplitude = 20
  return -amplitude * Math.exp(-Math.pow(iF/(2*variance), 2) - Math.pow(jF/(2*variance), 2))

}


function initMesh() {
  // the vertex set
  vertices = grid(0.4 * 100, 100, planet)
}

function draw(canvas) {
  // blacks out the screen
  gl.clearColor(0.0, 0.0, 0.0, 1.0)
  // activate depth test
  gl.enable(gl.DEPTH_TEST)
  gl.depthFunc(gl.LEQUAL)
  // clears screen & depth buffer
  gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT)



  // creates the persp. matrix
  perspectiveMatrix = makePerspective(45, 1.0, 0.1, 100.0)
  // load identity
  mvMatrix = Matrix.I(4)
  mvTranslate([-0.0, 0.0, -6.0])
  mvScale([canvas.camera.zoom, canvas.camera.zoom, canvas.camera.zoom])
  mvRotate([-1.4, 0, 0])
  mvRotate(canvas.camera.angle)
  // bind buffer
  gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0)
  setMatrixUniforms()
  // draw
  gl.drawArrays(gl.LINE_STRIP, 0, vertices.length/3)
}
