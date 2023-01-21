main();

function main(){
    const canvas = document.querySelector("#glCanvas");
    const gl = canvas.getContext('webgl2');
    if (gl===null) {
        alert('Your browser may not support WebGl')
    }
    init(canvas,gl);
}

function init(canvas,gl){
    const triangleVertexBuffer = initPositionBuffer(gl);
    const vertexShader = initVertexShader(gl);
    const fragmentShader = initFragmentShader(gl);
    const shaderProgram = initShaderProgram(gl,fragmentShader,vertexShader);
    const vertexPositionAttribute = initVertexPositionAttribute(gl,shaderProgram,triangleVertexBuffer);
    const modelViewMatrix = initModelViewMatrix();
    const projectionMatrix = initProjectionMatrix(canvas);
    //
    gl.useProgram(shaderProgram);
    //
    const modelViewMatrixUniformLocation = initMVMUL(gl,shaderProgram,modelViewMatrix);
    const projectionMatrixUniformLocation = initPMUL(gl,shaderProgram,projectionMatrix);
    draw(gl, modelViewMatrix, modelViewMatrixUniformLocation);
}
