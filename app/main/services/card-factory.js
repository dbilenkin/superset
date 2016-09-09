'use strict';

(function() {
    
    function CardFactory() {
        
        /**
         * The Card class
         */
        function Card(cardData) {
            
            
  
            this.id = cardData.id;
            this.color = cardData.color;
            this.shape = cardData.shape;
            this.pattern = cardData.pattern;
            this.number = cardData.number
            this.background = cardData.background;
            
            this.cssClass = cardData.cssClass;
            
            
            
            this.addCssClass = function(cssClass) {
                var index = this.cssClass.indexOf(cssClass);
                if (index === -1) {
                    this.cssClass.push(cssClass);
                }
                
            }
            
            this.removeCssClass = function(cssClass) {
                var index = this.cssClass.indexOf(cssClass);
                if (index !== -1) {
                    this.cssClass.splice(index, 1);;
                }
            }
            
            this.removeAllCssClasses = function() {
                this.cssClass = [];
            }


        }
        
        Card.prototype.toString = function() {
            var card = '' 
                + this.number +' '
                + this.color + ' '
                + this.pattern + ' '
                + this.shape;
            if (this.background) {
                card += ' with a ' + this.background + ' background';
            }
            
            return card;
        }
        
        return Card;
            
    }


    

  angular.module('main')
    .factory('Card', CardFactory);
})();
