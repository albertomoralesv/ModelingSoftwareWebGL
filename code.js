var VSHADER_SOURCE =`
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  varying vec4 v_FragColor;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjMatrix;
  void main() {
    gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;
    v_FragColor = a_Color;
    gl_PointSize = 10.0;
  }`;

var FSHADER_SOURCE =`
  precision mediump float;
  varying vec4 v_FragColor;
  void main(){
    gl_FragColor = v_FragColor;
  }`;

function changeAxis() {
    var xAxis = document.getElementById("x-axis");
    var yAxis = document.getElementById("y-axis");
    var zAxis = document.getElementById("z-axis");

    if(xAxis.checked){
        kendoConsole.log("X Rotation Axis selected");
        selectedAxis = 'x';
        $("#rotationSlider").data("kendoSlider").value(figures[index].rotations[0]);
        $("#translationSlider").data("kendoSlider").value(figures[index].translations[0]);
        $("#scaleSlider").data("kendoSlider").value(figures[index].scales[0]);
    }
    if(yAxis.checked){
        kendoConsole.log("Y Rotation Axis selected");
        selectedAxis = 'y';
        $("#rotationSlider").data("kendoSlider").value(figures[index].rotations[1]);
        $("#translationSlider").data("kendoSlider").value(figures[index].translations[1]);
        $("#scaleSlider").data("kendoSlider").value(figures[index].scales[1]);
    }
    if(zAxis.checked){
        kendoConsole.log("Z Rotation Axis selected");
        selectedAxis = 'z';
        $("#rotationSlider").data("kendoSlider").value(figures[index].rotations[2]);
        $("#translationSlider").data("kendoSlider").value(figures[index].translations[2]);
        $("#scaleSlider").data("kendoSlider").value(figures[index].scales[2]);
    }
}

function restart(){
    index = 0;
    g_points = [];
    g_colors = [];
    for(var i = 0; i < figures.length; i++){
        var element = document.getElementById('button'+i);
        if(element){
            element.remove();
        }
    }
    erased = new Set();
    figures = [];
    document.getElementById('color').value = '#FFFFFF';
    $("#rotationSlider").data("kendoSlider").value(0);
    $("#translationSlider").data("kendoSlider").value(0);
    $("#scaleSlider").data("kendoSlider").value(1);
    kendoConsole.log("Restart.");
    main();
}
function rotationSliderOnSlide(e){
    kendoConsole.log("Rotation " + selectedAxis + " : " + e.value);
    var angle =  e.value;
    if(selectedAxis == 'x'){
        figures[index].rotations[0] = angle;
    }
    if(selectedAxis == 'y'){
        figures[index].rotations[1] = angle;
    }
    if(selectedAxis == 'z'){
        figures[index].rotations[2] = angle;
    }
    main();
}
function rotationSliderOnChange(e){
    kendoConsole.log("Rotation " + selectedAxis + " : " + e.value);
    var angle =  e.value;
    if(selectedAxis == 'x'){
        figures[index].rotations[0] = angle;
    }
    if(selectedAxis == 'y'){
        figures[index].rotations[1] = angle;
    }
    if(selectedAxis == 'z'){
        figures[index].rotations[2] = angle;
    }
    main();
}

function translationSliderOnSlide(e){
    kendoConsole.log("Translation " + selectedAxis + " : " + e.value);
    var translation =  e.value;
    if(selectedAxis == 'x'){
        figures[index].translations[0] = translation;
    }
    if(selectedAxis == 'y'){
        figures[index].translations[1] = translation;
    }
    if(selectedAxis == 'z'){
        figures[index].translations[2] = translation;
    }
    main();
}
function translationSliderOnChange(e){
    kendoConsole.log("Translation " + selectedAxis + " : " + e.value);
    var translation =  e.value;
    if(selectedAxis == 'x'){
        figures[index].translations[0] = translation;
    }
    if(selectedAxis == 'y'){
        figures[index].translations[1] = translation;
    }
    if(selectedAxis == 'z'){
        figures[index].translations[2] = translation;
    }
    main();
    }

function scaleSliderOnSlide(e){
    kendoConsole.log("Scale " + selectedAxis + " : " + e.value);
    var scale =  e.value;
    if(selectedAxis == 'x'){
        figures[index].scales[0] = scale;
    }
    if(selectedAxis == 'y'){
        figures[index].scales[1] = scale;
    }
    if(selectedAxis == 'z'){
        figures[index].scales[2] = scale;
    }
    main();
}
function scaleSliderOnChange(e){
    kendoConsole.log("Scale " + selectedAxis + " : " + e.value);
    var scale =  e.value;
    if(selectedAxis == 'x'){
        figures[index].scales[0] = scale;
    }
    if(selectedAxis == 'y'){
        figures[index].scales[1] = scale;
    }
    if(selectedAxis == 'z'){
        figures[index].scales[2] = scale;
    }
    main();
}

var minRotation = -360;
var maxRotation = 360;
var minTranslation = -1;
var maxTranslation = 1;
var minScale = 1;
var maxScale = 5;
$(document).ready(function(){
  $('#rotationSlider').kendoSlider({
    change: rotationSliderOnChange,
    slide: rotationSliderOnSlide,
    min: minRotation,
    max: maxRotation,
    smallStep: 10,
    largeStep: 60,
    value: 0
  });
  $('#translationSlider').kendoSlider({
    change: translationSliderOnChange,
    slide: translationSliderOnSlide,
    min: minTranslation,
    max: maxTranslation,
    smallStep: 0.1,
    largeStep: 0.5,
    value: 0
  });
  $('#scaleSlider').kendoSlider({
    change: scaleSliderOnChange,
    slide: scaleSliderOnSlide,
    min: minScale,
    max: maxScale,
    smallStep: 0.2,
    largeStep: 1,
    value: 1
  });
});
function main(){
  var canvas = document.getElementById('webgl');
  var gl = getWebGLContext(canvas);

  if(!gl){
    console.log('Failed to get the WebGL context');
    return;
  }

  if(!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)){
    console.log('Failed to initialize shaders');
    return;
  }

  canvas.onclick = function(ev){ click(ev, gl, canvas); }
  canvas.oncontextmenu = function(ev){ rightclick(ev, gl); return false; }

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  draw(gl);
}

function rightclick(ev, gl){
    if(figures[figures.length-1].points.length > 8){
        if(document.getElementById('button'+index)){
            document.getElementById('button'+index).disabled = false;
        }
        index = figures.length;
        $("#rotationSlider").data("kendoSlider").value(0);
        $("#translationSlider").data("kendoSlider").value(0);
        $("#scaleSlider").data("kendoSlider").value(1);
        draw(gl);
    }else{
        selectFigure(figures.length-1);
    }
}

function initVertexBuffers(gl, figure){
    var vertices = new Float32Array(figure.points);
    var colors = new Float32Array(figure.colors);
    var rotations = (figure.rotations);
    var translations = (figure.translations);
    var scales = (figure.scales);
    var n = vertices.length;
    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if(a_Position < 0){
        console.log('Failed to get location of a_Position');
        return;
    }
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    var modelMatrix = new Matrix4();
    modelMatrix.translate(translations[0], translations[1], translations[2]);
    modelMatrix.scale(scales[0], scales[1], scales[2]);
    modelMatrix.rotate(rotations[0], 1, 0, 0);
    modelMatrix.rotate(rotations[1], 0, 1, 0);
    modelMatrix.rotate(rotations[2], 0, 0, 1);

    var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if(!u_ModelMatrix){ console.log('Failed to get location of u_ModelMatrix'); }
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

    var u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
    if(!u_ViewMatrix){ console.log('Failed to get location of u_ViewMatrix'); }
    var viewMatrix = new Matrix4();
    viewMatrix.setLookAt(0.0, 0.0, 1.5,   0.0, 0.0, 0.0,   0.0, 1.0, 0.0);
    gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);

    
    var u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');
    if(!u_ProjMatrix){ console.log('Failed to get location of u_ProjMatrix'); }
    var projMatrix = new Matrix4();
    projMatrix.setPerspective(60.0, 1.0, 0.1, 5.0);
    gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.DYNAMIC_DRAW);

    var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    if(!a_Color < 0){
        console.log('Failed to get location of a_Color');
        return;
    }
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Color);

    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LESS);

    return n;
}

var index = 0;
var g_points = [];
var g_colors = [];
var z = 0;
var selectedAxis = 'x';
var figures = [];
var color = [];
var erased = new Set();
function click(ev, gl, canvas){
    var x = ev.clientX;
    var y = ev.clientY;
    var rect = ev.target.getBoundingClientRect();

    x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
    y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);

    if(g_points.length <= index){
        var arrayPoints = [];
        g_points.push(arrayPoints);
        var arrayColors = [];
        g_colors.push(arrayColors);
        color = hexToRgb(document.getElementById('color').value);
        var fig = new Figure(index, color);
        figures.push(fig);
        createButton(index);
        document.getElementById('button'+index).disabled = true;
    }
    figures[index].points.push(x);
    figures[index].points.push(y);
    z = document.getElementById('zValue').value;
    figures[index].points.push(z);

    var c = 0;
    for(var i=0; i<figures[index].colors.length; i++){
        figures[index].colors[i] = color[c];
        if(c<2){
            c += 1;
        }else{
            c = 0;
        }
    }
    figures[index].colors.push(color[0]);
    figures[index].colors.push(color[1]);
    figures[index].colors.push(color[2]);

    g_points[index].push(x);
    g_points[index].push(y);
    g_points[index].push(z);

    g_colors[index].push(Math.random());
    g_colors[index].push(Math.random());
    g_colors[index].push(Math.random());
    draw(gl);
}

function draw(gl){
    gl.clear(gl.COLOR_BUFFER_BIT);
    for(var i = 0; i < figures.length; i++){
        if(!erased.has(i)){
            var n = initVertexBuffers(gl, figures[i]) / 3;
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
        }
    }
}

function selectFigure(n){
    document.getElementById('color').value = rgbArrayToHex(figures[n].color);
    if(document.getElementById('button'+index)){
        document.getElementById('button'+index).disabled = false;
    }
    document.getElementById('button'+n).disabled = true;
    index = n;
    if(selectedAxis == 'x'){
        $("#rotationSlider").data("kendoSlider").value(figures[index].rotations[0]);
        $("#translationSlider").data("kendoSlider").value(figures[index].translations[0]);
        $("#scaleSlider").data("kendoSlider").value(figures[index].scales[0]);
    }
    if(selectedAxis == 'y'){
        $("#rotationSlider").data("kendoSlider").value(figures[index].rotations[1]);
        $("#translationSlider").data("kendoSlider").value(figures[index].translations[1]);
        $("#scaleSlider").data("kendoSlider").value(figures[index].scales[1]);
    }
    if(selectedAxis == 'z'){
        $("#rotationSlider").data("kendoSlider").value(figures[index].rotations[2]);
        $("#translationSlider").data("kendoSlider").value(figures[index].translations[2]);
        $("#scaleSlider").data("kendoSlider").value(figures[index].scales[2]);
    }
    main();
}

function removeFigure(){
    if(figures[index]){
        if(figures[index].points.length > 8){
            erased.add(index);
            var element = document.getElementById('button'+index);
            if(element){
                element.remove();
            }
            index = figures.length;
            main();
        }
    }
}

function createButton(i) {
    var button = $('<button>', {
        id: 'button' + i,
        class: 'btn-primary figButton',
        type: 'button',
        text: 'Fig' + i,
        click: function() {
            selectFigure(i);
        },
        style: 'background-color: rgb(' + figures[i].color[0]*255 + ',' + figures[i].color[1]*255 + ',' + figures[i].color[2]*255 + ')' // Set the background color here
    });
    $('#buttons').append(button);
}

function changeColor(){
    if(figures[index]){
        color = hexToRgb(document.getElementById('color').value);
        figures[index].color = color;
        var c = 0;
        for(var i = 0; i<figures[index].colors.length; i++){
            figures[index].colors[i] = color[c];
            if(c<2){
                c+=1;
            }else{
                c=0;
            }
        }
        document.getElementById('button' + index).style.backgroundColor = 'rgb(' + 
        Math.round(figures[index].color[0] * 255) + ',' + 
        Math.round(figures[index].color[1] * 255) + ',' + 
        Math.round(figures[index].color[2] * 255) + ')';
        main();
    }
}

//
function hexToRgb(hex) {
    var hexWithoutHash = hex.substring(1); // Remove the '#' character
    var rgbHex = hexWithoutHash.match(/.{1,2}/g);

    var r = parseInt(rgbHex[0], 16) / 255;
    var g = parseInt(rgbHex[1], 16) / 255;
    var b = parseInt(rgbHex[2], 16) / 255;
    
    // Check if there's an alpha component
    var a = 1.0;
    if (rgbHex.length === 4) {
        a = parseInt(rgbHex[3], 16) / 255;
    }

    return [r, g, b, a];
}
//
//
function rgbArrayToHex(rgbArray) {
    var [r, g, b, a] = rgbArray;

    // Ensure that the values are within the valid range [0, 1]
    r = Math.min(1, Math.max(0, r));
    g = Math.min(1, Math.max(0, g));
    b = Math.min(1, Math.max(0, b));

    // Convert decimal values to hexadecimal and ensure two-digit format
    var hexR = Math.round(r * 255).toString(16).padStart(2, '0');
    var hexG = Math.round(g * 255).toString(16).padStart(2, '0');
    var hexB = Math.round(b * 255).toString(16).padStart(2, '0');

    // Combine the components and prepend the '#' symbol
    var hexColor = '#' + hexR + hexG + hexB;

    return hexColor;
}
//

class Figure{
    constructor(index, color){
        this.index = index;
        this.color = color;
        this.colors = [];
        this.points = [];
        this.rotations = [0,0,0];
        this.translations = [0,0,0];
        this.scales = [1,1,1];
    }
}