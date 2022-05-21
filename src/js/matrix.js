//var _ = require('lodash');

const ELEMENT = "matrix";

function initElement(element) {
    let el = document.createElement("div");
    el.id = element;
    el.width = window.innerWidth;
    el.height = window.innerHeight;
    document.body.prepend(el);
    return el;
}

class Matrix {
    constructor(domElement) {
        this.domElement = domElement;
    }

    calculateMatrix() {
        this.columns = this.getColumns();
        this.rows = this.getRows();
        // this.columns = 100;
        // this.rows = 60;
        let arrayMatrix = [];

        for (let i = 0; i < this.columns; i++) {
            let arrayColumns = [];
            for (let j = 0; j < this.rows; j++) {
                arrayColumns.push(this.getRandomChar());
            }
            arrayMatrix.push(arrayColumns);
        }
        this.matrix = arrayMatrix;
        return arrayMatrix;
    }

    getColumns() {
        return Math.ceil(window.innerWidth / 27);
    }

    getRows() {
        return Math.ceil(window.innerHeight / 28);
    }

    draw() {
        let el = this.domElement;
        let array = this.calculateMatrix();
        for (var i = 0; i < array.length; i++) {
            let column = this.createColumn(i);
            let rand = Math.floor(Math.random() * this.rows);

            for (var j = 0; j < array[i].length; j++) {
                let cell = this.createCell(i, j);
                if (j == rand) {
                    // cell.classList.add("decay100");
                    // cell.classList.add("black");
                }
                cell.innerHTML = array[i][j];
                column.appendChild(cell);
            }
            el.appendChild(column);
        }
    }

    createCell(x, y) {
        let el = document.createElement("div");
        el.setAttribute("data-row", y);
        el.setAttribute("data-column", x);
        el.classList.add("cell");
        return el;
    }

    createColumn(x) {
        let el = document.createElement("div");
        el.setAttribute("data-column-id", x);
        el.classList.add("column");
        return el;
    }

    getRandomChar() {
        var hexRange = [
            [0x0020, 0x007f], // all latin
            //[0x1E00, 0x1EFF], // latin extended
            //[0x20a0, 0x20bf], // currency
            //[0x2150, 0x218F], // number
            //[0x27C0, 0x27EF], // maths symbols A
            //[0x3040, 0x309F], // hiragana
            [0x30a0, 0x30ff], // katakana
        ];
        let rand = Math.floor(Math.random() * hexRange.length);
        return String.fromCharCode(
            hexRange[rand][0] +
                Math.random() * (hexRange[rand][1] - hexRange[rand][0] + 1)
        );
    }

    getCell(x, y) {
        console.time("getCell");

        // return document.querySelector(`[data-row="${y}"][data-column="${x}"]`);
        let els = document.querySelector(`[data-column-id="${x}"]`);

        let ret = els.querySelector(`[data-row="${y}"]`);
        console.timeEnd("getCell");
        return ret;
    }

    animate() {
        //var t = this;
        console.time("Animate");

        // let rand = Math.floor(Math.random() * this.columns);
        // this.changeColumn(rand);
        // setInterval(function () {
        //     t.changeColumn(rand);
        // }, 1);

        for (let i = 0; i < 5; i++) {
            let rand = Math.floor(Math.random() * this.columns);
            this.changeColumn(rand);
        }

        // for (let i = 0; i < this.columns; i++) {
        //     this.changeColumn(i);
        // }

        console.timeEnd("Animate");
    }

    fillRandomArray(){
        let array = [];
        for (let i = 0; i < this.columns; i++) {
            array.push(i);
        }
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }

    loop() {
        console.time();
         var t = this;
        // let rand = Math.floor(Math.random() * this.columns);
        // let array = this.fillRandomArray();
        // array.forEach(index => {
        //     setInterval(function () {
        //         t.changeColumn(index);
        //     }, 16);
        // })

         setInterval(function () {
                t.animate();
            }, 1);


        // for (let i = 0; i < 32; i++) {
        //     console.time();
        //     let rand = Math.floor(Math.random() * this.columns);
        //     this.changeColumn(rand);
        //
        // }
        console.timeEnd();
    }

    changeColumn(x) {
        let cells = document.querySelector(`[data-column-id="${x}"]`);

        let y = this.getActiveCell(x);
        if (y === 0) this.resetColumn(x);
        y++;
        let nbDecay = 35;
        let end = y - nbDecay > 0 ? y - nbDecay : 0;

        // y++;
        let decay = 100;
        let j = 0;
        for (let i = y; i >= end; i--) {
            decay = 100 - Math.floor(j * (100 / nbDecay));
            let cell = cells.querySelector(`[data-row="${i}"]`);
            if (decay == 100) {
                cell.innerHTML = this.getRandomChar();
            }
            cell.className = "cell";
            cell.classList.add("decay" + decay);
            j++;
        }
    }

    resetColumn(x) {
        let els = document.querySelectorAll(`[data-column="${x}"]`);
        for (let el of els) {
            el.className = "cell";
        }
    }

    getRowsActive(x, y) {
        let nbDecay = 15;
        let end = y - nbDecay > 0 ? y - nbDecay : 0;
        let rows = [];
        for (let i = y; i >= end; i--) {
            rows.push(this.getCell(x, i));
        }
        return rows;
    }

    changeCell(x, y, decay = 0) {
        let cell = this.getCell(x, y);
        if (decay == 100) {
            cell.innerHTML = this.getRandomChar();
        }
        cell.className = "cell";
        cell.classList.add("decay" + decay);
    }

    getActiveCell(x) {
        let els = document.querySelector(`[data-column-id="${x}"]`);
        let activeCell = els.querySelector(".decay100");
        let index = 0;
        if (activeCell) {
            index = activeCell.getAttribute("data-row");
        }
        let rand = Math.floor(Math.random() * 100);
        if(rand==40){
            return 0;
        }
        if(rand==70){
            return Math.floor(Math.random() * this.rows - 1);
        }
        return parseFloat(index != this.rows - 1 ? index : 0);
    }
}

//  document.addEventListener("DOMContentLoaded", function () {
const domElement = initElement(ELEMENT);
const matrix = new Matrix(domElement);
matrix.draw();
matrix.loop();
// });

document.onkeydown = checkKey;

function checkKey(e) {
    e = e || window.event;

    if (e.keyCode == "38") {
        // up arrow
    } else if (e.keyCode == "40") {
        // down arrow
    } else if (e.keyCode == "37") {
        // left arrow
    } else if (e.keyCode == "39") {
        matrix.animate();
    }
}
