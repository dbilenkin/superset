'use strict';

(function() {
    
    function Levels() {
        this.levels = [
            {
                setType: 'Subset',
                numAttributes: 3,
                attributeKeys: ['shape', 'pattern', 'number'],
                cardsPerSet: 3,
                setsToFind: 5,
                minSets: 5,
                time: 90
            },
            {
                setType: 'Set',
                numAttributes: 4,
                attributeKeys: ['shape', 'pattern', 'number', 'color'],
                cardsPerSet: 3,
                setsToFind: 5,
                minSets: 3,
                time: 60
            },
            {
                setType: 'Superset',
                numAttributes: 5,
                attributeKeys: ['shape', 'pattern', 'number', 'color', 'background'],
                cardsPerSet: 3,
                setsToFind: 5,
                minSets: 3,
                time: 40
            },
            {
                setType: 'Subset',
                numAttributes: 3,
                attributeKeys: ['shape', 'pattern', 'number'],
                cardsPerSet: 4,
                setsToFind: 5,
                minSets: 2,
                time: 40
            },
            {
                setType: 'Set',
                numAttributes: 4,
                attributeKeys: ['shape', 'pattern', 'number', 'color'],
                cardsPerSet: 4,
                setsToFind: 5,
                minSets: 2,
                time: 40
            },
            {
                setType: 'Superset',
                numAttributes: 5,
                attributeKeys: ['shape', 'pattern', 'number', 'color', 'background'],
                cardsPerSet: 4,
                setsToFind: 5,
                minSets: 2,
                time: 30
            },
            {
                setType: 'Subset',
                numAttributes: 3,
                attributeKeys: ['shape', 'pattern', 'number'],
                cardsPerSet: 5,
                setsToFind: 5,
                minSets: 1,
                time: 30
            },
            {
                setType: 'Set',
                numAttributes: 4,
                attributeKeys: ['shape', 'pattern', 'number', 'color'],
                cardsPerSet: 5,
                setsToFind: 5,
                minSets: 1,
                time: 30
            },
            {
                setType: 'Superset',
                numAttributes: 5,
                attributeKeys: ['shape', 'pattern', 'number', 'color', 'background'],
                cardsPerSet: 5,
                setsToFind: 5,
                minSets: 1,
                time: 30
            }
        ]
        
        this.getLevels = function() {
            return this.levels;
        }
        
    }
    
    angular.module('main')
    .service('Levels', Levels);
    
})()

