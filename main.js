main();

function main(){

    const triangleVertices = [
        0.0,  1.0,  0.0,
       -1.0, -1.0,  0.0,
        1.0, -1.0,  0.0,
     ];

    const canvas = document.querySelector("#glCanvas");
    const gl = canvas.getContext('webgl');
    if (gl===null) {
        alert('Your browser may not support WebGl')
    }
    shaderInit(canvas,gl,triangleVertices);
}

function shaderInit(canvas,gl,triangleVertices){

    const triangleVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);

    const vertexShaderSource = `
        attribute vec3 aVertexPosition;

        uniform mat4 uModelViewMatrix;
        uniform mat4 uProjectionMatrix;

        void main() {
            gl_Position = uProjectionMatrix * uModelViewMatrix * vec4(aVertexPosition, 1.0);
        }
        `;

    const fragmentShaderSource = `
        void main() {
            gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
        }
    `;


    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    gl.useProgram(shaderProgram);

    const vertexPositionAttribute = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
    gl.enableVertexAttribArray(vertexPositionAttribute);

    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBuffer);
    gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

    const modelViewMatrix = mat4.create();
    mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, 0.0, -5.0]);

    const projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, 45, canvas.width / canvas.height, 0.1, 100.0);

    const modelViewMatrixUniformLocation = gl.getUniformLocation(shaderProgram, 'uModelViewMatrix');
    gl.uniformMatrix4fv(modelViewMatrixUniformLocation, false, modelViewMatrix);

    const projectionMatrixUniformLocation = gl.getUniformLocation(shaderProgram, 'uProjectionMatrix');
    gl.uniformMatrix4fv(projectionMatrixUniformLocation, false, projectionMatrix);
    render(gl, modelViewMatrix, modelViewMatrixUniformLocation);
}

function render(gl, modelViewMatrix, modelViewMatrixUniformLocation){
    let angle = 10.0;
    let axis = "y";

    btnX.addEventListener("click", () => {
        axis = "x";
    });

    btnY.addEventListener("click", () => {
        axis = "y";
    });

    stopBtn.addEventListener("click", () => {
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        } else {
            intervalId = setInterval(function(){
                if(axis === "x"){
                    mat4.rotateX(modelViewMatrix, modelViewMatrix, angle * Math.PI / 180);
                }
                else{
                    mat4.rotateY(modelViewMatrix, modelViewMatrix, angle * Math.PI / 180);
                }
                gl.uniformMatrix4fv(modelViewMatrixUniformLocation, false, modelViewMatrix);
                gl.clearColor(0.0, 0.0, 0.0, 1.0);
                 gl.clear(gl.COLOR_BUFFER_BIT);
                gl.drawArrays(gl.TRIANGLES, 0, 3);
                }, 30);
        }       
    });

    resetBtn.addEventListener("click", () => {
         mat4.identity(modelViewMatrix);
         mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, 0.0, -5.0]);
    });

    velocity.addEventListener("change", function(){
        angle = this.value;
    });

    intervalId = setInterval(function(){
    if(axis === "x"){
        mat4.rotateX(modelViewMatrix, modelViewMatrix, angle * Math.PI / 180);
    }
    else{
        mat4.rotateY(modelViewMatrix, modelViewMatrix, angle * Math.PI / 180);
    }
    gl.uniformMatrix4fv(modelViewMatrixUniformLocation, false, modelViewMatrix);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    }, 30);
}
