function draw(gl, modelViewMatrix, modelViewMatrixUniformLocation){
    let angle = 10.0;
    let axis = "y";
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    stopBtn.addEventListener("click", () => {
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        } else {
            intervalId = setInterval(function(){
                if(axis === "x"){
                    mat4.rotateX(modelViewMatrix, modelViewMatrix, angle * Math.PI / 180);
                }
                else if (axis === "z"){
                    mat4.rotateZ(modelViewMatrix, modelViewMatrix, angle * Math.PI / 180);
                }
                else{
                    mat4.rotateY(modelViewMatrix, modelViewMatrix, angle * Math.PI / 180);
                }
                gl.uniformMatrix4fv(modelViewMatrixUniformLocation, false, modelViewMatrix);
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

    bgColor.addEventListener("change", function(){
        let rgbArr = hex2rgb(this.value);
        gl.clearColor(rgbArr[0], rgbArr[1], rgbArr[2], 1.0);
    });
    btnX.addEventListener("click", () => {
        axis = "x";
    });

    btnY.addEventListener("click", () => {
        axis = "y";
    });
    btnZ.addEventListener("click", () => {
        axis = "z";
    });
    intervalId = setInterval(function(){
    if(axis === "x"){
        mat4.rotateX(modelViewMatrix, modelViewMatrix, angle * Math.PI / 180);
    }
    else if (axis === "z"){
        mat4.rotateZ(modelViewMatrix, modelViewMatrix, angle * Math.PI / 180);
    }
    else{
        mat4.rotateY(modelViewMatrix, modelViewMatrix, angle * Math.PI / 180);
    }
    gl.uniformMatrix4fv(modelViewMatrixUniformLocation, false, modelViewMatrix);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    }, 30);
}
