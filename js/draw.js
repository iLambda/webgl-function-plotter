planet = function (i, j) {
  var iF = i - 100/2
  var jF = j - 100/2
  var variance = 2
  var amplitude = 1.5
  return -amplitude * Math.exp(-Math.pow(iF/(2*variance), 2) - Math.pow(jF/(2*variance), 2))
}

noise = function (i, j) {
  var variance = 2
  var amplitude = 20

  return amplitude * Math.sin(i + j)
}

gravwave = function (i, j) {
  var variance = 2
  var amplitude = 1

  var r = i*i + j*j
  var cos = function (f) { return f <= 3.5 * Math.PI ? Math.cos(f) : 0 }
  return -amplitude * cos(Math.sqrt(r) / variance)
}

// picks a random value
function pick(what) {
  // what do we need
  if (what === 'number') {
    // returns a number >= 0 and < 10, w/ 2 decimals
    return (10*Math.random()).toFixed(2)
  } else if (what === 'var') {
    // return a variable
    return ['x', 'y'][Math.floor(Math.random()*2)]
  } else if (what == 'func') {
    // take a func name
    var result
    var count = 0
    for (var func in expr.operators)
        if (Math.random() < 1/++count)
           result = func
    // return it
    return result
  } else {
    // pick whaaaat ?
    return undefined
  }
}


function maketree(pfunc, pvar, end) {
  // defaulting
  pfunc = pfunc || function(n) { return Math.min(1/Math.pow(Math.max(n-1, 0), 0.90), 0.6) }
  pvar = pvar || function(n) { return 0.3 }
  end = end || function (n) { return n >= 15 }

  // recursive function
  var gen = (function(expression, n) {
    // defaulting
    expression = expression || { }
    n = n || 0
    var p = Math.random()

    // decide what we put in the tree
    if (p < pfunc(n) && !end(n)) {
      // a function
      expression.type = 'func'
      // pick a label
      expression.label = pick(expression.type)
      // we generate the children
      expression.children = Array.apply(null, Array(expr.operators[expression.label].n)).map(function() {
        return gen({ parent: expression }, n+1)
      })
    } else {
      // a value
      expression.type = p < pfunc(n) + pvar(n) ? 'var' : 'number'
      // pick a label
      expression.label = pick(expression.type)
    }
    // return the expression
    return expression
  }).bind(this)

  // generate three expressions
  var s1 = gen(), s2 = gen(), s3 = gen()

  // bind them
  var subroot = {
    type: 'func',
    label: '*',
    children: [s2, s3]
  }
  s2.parent = subroot
  s3.parent = subroot
  var root =  {
    type: 'func',
    label: '*',
    children: [s1, subroot]
  }
  s1.parent = root
  subroot.parent = root
  // return them
  return root
}

rpn = expr.toRPN(maketree())
func = expr.toFunction(rpn, ['x', 'y'])
random = function (i, j) {
  var res = func(i, j)
  return res
}


function initMesh() {
  // the vertex set
  vertices = grid(0.4 * 100, 50, random)
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
