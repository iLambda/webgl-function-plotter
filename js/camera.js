function initCamera(canvas, drawScene) {
  // create camera
  canvas.camera = {
    delta: { x: 0, y: 0 },
    mousePos: { x:0, y:0 },

    angle: [0, 0],
    sensivity: 0.005
  }
  canvas.addEventListener('mousemove', function(evt) {
    // gets mouse position
    canvas.camera.mousePos = getMousePos(canvas, evt);
    canvas.camera.oldPos = canvas.camera.oldPos || canvas.camera.mousePos
    // sets delta
    var delta = {
      x: canvas.camera.mousePos.x - canvas.camera.oldPos.x,
      y: canvas.camera.mousePos.y - canvas.camera.oldPos.y
    }
    canvas.camera.delta = delta
    // compute angle
    canvas.camera.angle[0] = canvas.camera.angle[0] + delta.y * canvas.camera.sensivity
    canvas.camera.angle[1] = canvas.camera.angle[1] + delta.x * canvas.camera.sensivity
    console.log(canvas.camera.angle)

    // draw scene
    drawScene(canvas);
    // save old position
    canvas.camera.oldPos = canvas.camera.mousePos
  }, false);

}

function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect()
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  }
}
