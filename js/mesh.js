function abstract1(size, n) {
  // creating the mesh
  var mesh = []
  var step = size/n
  var half = size/2
  for (var i = 0; i < n; i++) {
    mesh.push(i * step - half, step - half, 0)
    mesh.push(i * step + half, step - half, 0)

    mesh.push(step - half, i * step - half, 0)
    mesh.push(step - half, i * step + half, 0)
  }

  //return mesh
  return mesh
}

function grid(size, n, heightFunc) {
  // creating the mesh
  var mesh = []
  var step = size/n
  var half = size/2
  var hf = heightFunc
  heightFunc = heightFunc ? function(i,j) { return hf(i - n/2, j - n/2) } : function (i,j) { return 0 }
  for (var i = 0; i < n; i++) {
    for (var j = 0; j < n; j++) {
      mesh.push(i*step - half, j*step - half, heightFunc(i,j))
      mesh.push((i+1)*step - half, j*step - half, heightFunc(i+1,j))
      mesh.push((i+1)*step - half, (j+1)*step - half, heightFunc(i+1,j+1))
      mesh.push(i*step - half, (j+1)*step - half, heightFunc(i,j+1))
      mesh.push(i*step - half, j*step - half, heightFunc(i,j))
      mesh.push(i*step - half,(j+1)*step -half, heightFunc(i,j+1))
    }
    mesh.push((i+1)*step - half, j*step -half, heightFunc(i+1,j))
    for (var j = n-1; j >= 0; j--) {
      mesh.push(i*step - half, j*step - half, heightFunc(i,j))
      mesh.push(i*step - half,(j+1)*step -half, heightFunc(i,j+1))
      mesh.push(i*step - half, (j+1)*step - half, heightFunc(i,j+1))
      mesh.push((i+1)*step - half, (j+1)*step - half, heightFunc(i+1,j+1))
      mesh.push((i+1)*step - half, j*step - half, heightFunc(i+1,j))
      mesh.push(i*step - half, j*step - half, heightFunc(i,j))
    }
  }
  return mesh

}
