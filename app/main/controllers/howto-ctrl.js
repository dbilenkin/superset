'use strict';

(function () {

    function HowtoCtrl($timeout, $window, $ionicSlideBoxDelegate, Card, Draw) {
        
        
        var vm = this;
        vm.gridHeight = $window.innerHeight - 100;
        
        vm.examples = [
            [[
                new Card({
                    id: 0,
                    number: 1,
                    shape: 'triangle',
                    pattern: 'solid'
                }),
                new Card({
                    id: 1,
                    number: 2,
                    shape: 'triangle',
                    pattern: 'solid'
                }),
                new Card({
                    id: 2,
                    number: 3,
                    shape: 'triangle',
                    pattern: 'solid'
                })
            ]],
            [[
                new Card({
                    id: 3,
                    number: 2,
                    shape: 'ellipse',
                    pattern: 'striped',
                    color: 'red'
                }),
                new Card({
                    id: 4,
                    number: 2,
                    shape: 'triangle',
                    pattern: 'striped',
                    color: 'red'
                }),
                new Card({
                    id: 5,
                    number: 2,
                    shape: 'rectangle',
                    pattern: 'striped',
                    color: 'green'
                })
            ]],
            [[
                new Card({
                    id: 6,
                    number: 4,
                    shape: 'ellipse',
                    pattern: 'empty',
                    color: 'red'
                }),
                new Card({
                    id: 7,
                    number: 4,
                    shape: 'triangle',
                    pattern: 'striped',
                    color: 'green'
                }),
                new Card({
                    id: 8,
                    number: 4,
                    shape: 'rectangle',
                    pattern: 'solid',
                    color: 'blue'
                }),
                new Card({
                    id: 9,
                    number: 4,
                    shape: 'diamond',
                    pattern: 'dots',
                    color: '#CFA900'
                })
            ]],
            [[
                new Card({
                    id: 10,
                    number: 1,
                    shape: 'pentagon',
                    pattern: 'dots',
                    color: '#CFA900',
                    background: 'yellow'
                }),
                new Card({
                    id: 11,
                    number: 2,
                    shape: 'ellipse',
                    pattern: 'empty',
                    color: 'red',
                    background: 'green'
                }),
                new Card({
                    id: 12,
                    number: 3,
                    shape: 'rectangle',
                    pattern: 'striped',
                    color: 'green',
                    background: 'blue'
                })
            ],
            [
                new Card({
                    id: 13,
                    number: 4,
                    shape: 'triangle',
                    pattern: 'solid',
                    color: '#8600b3',
                    background: 'red'
                }),
                new Card({
                    id: 14,
                    number: 5,
                    shape: 'diamond',
                    pattern: 'plaid',
                    color: 'blue',
                    background: 'purple'
                })
            ]]
        ]
        
        
        vm.drawCards = function(cardId) {
            
            Draw.initDraw(cardId);
      
            angular.forEach(vm.examples[vm.slideIndex], function(examples) {
                angular.forEach(examples, function(card) {
                    Draw.drawCard(card);
                    
                    //g.transform('R90', 50, 45);
                });
            });
        
        
        };
        
        vm.start = function() {
            
            vm.slideIndex = 0;
            $ionicSlideBoxDelegate.slide(0);
            $timeout(function() {
                
                vm.drawCards();
            }, 0);
            
           
        }
        
        vm.next = function() {
            $ionicSlideBoxDelegate.next();
        };
        vm.previous = function() {
            $ionicSlideBoxDelegate.previous();
        };

        // Called each time the slide changes
        vm.slideChanged = function(index) {
            vm.slideIndex = index;
            $timeout(function() {
                vm.drawCards(vm.examples[vm.slideIndex][0][0].id);
            }, 0);
        };
        
        
        vm.start();

    }

    angular.module('main')
        .controller('HowtoCtrl', HowtoCtrl);

})()

