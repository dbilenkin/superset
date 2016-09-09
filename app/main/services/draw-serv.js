'use strict';

(function () {

    function Draw() {
        
        this.initDraw = function(cardId) {
            var cards = document.querySelectorAll(".setCard");
            var card = cards[0];
            if (cardId) {
                card = document.getElementById('card' + cardId);
            }
            
            this.cardWidth = card.clientWidth;
            this.cardHeight = card.clientHeight;
            this.xSizeConst = this.cardWidth / 170;
            this.ySizeConst = this.cardHeight / 260;
            console.log("this.xSizeConst: " + this.xSizeConst);
        }
        
        this.drawShape = function(s, card, x, y) {
            var xSizeConst = this.xSizeConst;
            var ySizeConst = this.ySizeConst;
            var shape;
            if (card.shape === 'ellipse') {
                shape = s.ellipse((x + 23) * xSizeConst, (y - 30) * ySizeConst, 30 * xSizeConst, 30 * xSizeConst);
            } else if (card.shape === 'rectangle') {
                shape = s.rect(x * xSizeConst, (y - 55) * ySizeConst, 50 * xSizeConst, 50 * ySizeConst);
            } else if (card.shape === 'triangle') {
                shape = s.polygon(
                    (x - 5) * xSizeConst, (y - 5) * ySizeConst, 
                    (x + 55) * xSizeConst, (y - 5) * ySizeConst, 
                    (x + 25) * xSizeConst, (y - 55) * ySizeConst);
            } else if (card.shape === 'diamond') {
                shape = s.polygon(
                    (x - 5) * xSizeConst, (y - 30) * ySizeConst, 
                    (x + 25) * xSizeConst, (y) * ySizeConst, 
                    (x + 55) * xSizeConst, (y - 30) * ySizeConst,
                    (x + 25) * xSizeConst, (y - 60) * ySizeConst);
            } else if (card.shape === 'pentagon') {
                shape = s.polygon(
                    (x - 5) * xSizeConst, (y - 35) * ySizeConst, 
                    (x + 25) * xSizeConst, (y - 60) * ySizeConst,
                    (x + 55) * xSizeConst, (y - 35) * ySizeConst,
                    (x + 40) * xSizeConst, (y - 5) * ySizeConst,
                    (x + 10) * xSizeConst, (y - 5) * ySizeConst);
            }
            
            return shape;
        }
        
        this.fillPattern = function(shape, p, card) {
            shape.attr({
                fill: p,
                stroke: card.color,
                strokeWidth: 2 * this.xSizeConst * 2
            })
        }
        
        this.moveCard = function(card) {
            var card = document.getElementById("card" + card.id);
            createjs.Tween.get(card).to({x:1000, alpha: 0}, 500, createjs.Ease.linear);
        }
        
        
        this.drawCard = function (card) {
            
            

            var s = Snap("#svg" + card.id);
            //pattern attribute
            if (!card.color) {
                card.color = 'blue'
            }
            var p = card.color;
            
            var pConst = this.xSizeConst * 2;

            if (card.pattern === 'empty') {
                p = 'none';
            } else if (card.pattern === 'striped') {
                p = s.rect(0,0,(3 * pConst),(6 * pConst)).attr({fill:card.color})
                    .pattern(0,0,(6 * pConst),(6 * pConst)).attr({patternTransform: 'rotate(45)'});
            } else if (card.pattern === 'dots') {
                p = s.circle((3 * pConst),(3 * pConst),(3 * pConst)).attr({fill:card.color})
                    .pattern(0,0,(8 * pConst),(8 * pConst)).attr({patternTransform: 'rotate(45)'});
            } else if (card.pattern === 'plaid') {
                p = s.rect(0,0,(2 * pConst),(2 * pConst)).attr({fill:card.color})
                    .pattern(0,0,(4 * pConst),(4 * pConst));
            }
            
            var shapes = [];
            
            var xPosConst = this.xSizeConst * 3;
            var yPosConst = this.ySizeConst * 3;

            //number attribute
            if (card.number === 1) {
                shapes.push(this.drawShape(s, card, 60, 160));
            } else if (card.number === 2) {
                shapes.push(this.drawShape(s, card, 60, 110));
                shapes.push(this.drawShape(s, card, 60, 210));
            } else if (card.number === 3) {
                shapes.push(this.drawShape(s, card, 60, 80));
                shapes.push(this.drawShape(s, card, 60, 160));
                shapes.push(this.drawShape(s, card, 60, 240));
            } else if (card.number === 4) {
                shapes.push(this.drawShape(s, card, 15, 80));
                shapes.push(this.drawShape(s, card, 105, 240));
                shapes.push(this.drawShape(s, card, 105, 80));
                shapes.push(this.drawShape(s, card, 15, 240));
            } else if (card.number === 5) {
                shapes.push(this.drawShape(s, card, 15, 80));
                shapes.push(this.drawShape(s, card, 105, 240));
                shapes.push(this.drawShape(s, card, 105, 80));
                shapes.push(this.drawShape(s, card, 15, 240));
                shapes.push(this.drawShape(s, card, 60, 160));
            }
            
            for (var i = 0; i < shapes.length; i++) {
                this.fillPattern(shapes[i], p, card);

            }

        }
    }

    angular.module('main')
        .service('Draw', Draw);
})();
