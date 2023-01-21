function initPositionBuffer(gl){
    const triangleVertices = [
        0.0,  1.0,  0.0,
       -1.0, -1.0,  0.0,
        1.0, -1.0,  0.0,
     ];
    const triangleVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);
    return triangleVertexBuffer;
}

const vertexShaderSource = `
        attribute vec3 aVertexPosition;

        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;

        void main() {
            gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
        }
        `;

const fragmentShaderSource = `
        precision highp float;

        void main() {
            gl_FragColor = vec4(gl_FragCoord.y/400., 0, gl_FragCoord.x/600., 1);
        }
    `;

function hex2rgb(hex) {
    const hexArr = ['0x' + hex[1] + hex[2] | 0, '0x' + hex[3] + hex[4] | 0, '0x' + hex[5] + hex[6] | 0];
    rgbArr = []
    hexArr.forEach(val => {
        rgbArr.push(val*1.0/255)
    });
    return rgbArr
}

function initVertexShader(gl){
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);
    return vertexShader;
}

function initFragmentShader(gl){
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);
    return fragmentShader;
}

function initShaderProgram(gl,fragmentShader,vertexShader){
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    return shaderProgram;
}

function initVertexPositionAttribute(gl,shaderProgram,triangleVertexBuffer){
    const vertexPositionAttribute = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
    gl.enableVertexAttribArray(vertexPositionAttribute);
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBuffer);
    gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
    return vertexPositionAttribute;
}

function initModelViewMatrix(){
    const modelViewMatrix = mat4.create();
    mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, 0.0, -5.0]);
    return modelViewMatrix;
}

function initProjectionMatrix(canvas){
    const projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, 45, canvas.width / canvas.height, 0.1, 100.0);
    return projectionMatrix;
}

function initMVMUL(gl,shaderProgram,modelViewMatrix){
    const modelViewMatrixUniformLocation = gl.getUniformLocation(shaderProgram, 'uModelViewMatrix');
    gl.uniformMatrix4fv(modelViewMatrixUniformLocation, false, modelViewMatrix);
    return modelViewMatrixUniformLocation;
}

function initPMUL(gl,shaderProgram,projectionMatrix){
    const projectionMatrixUniformLocation = gl.getUniformLocation(shaderProgram, 'uProjectionMatrix');
    gl.uniformMatrix4fv(projectionMatrixUniformLocation, false, projectionMatrix)
    return projectionMatrixUniformLocation;
}
