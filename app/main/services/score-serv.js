'use strict';

(function () {

    function Score($localStorage) {
        
        this.initScore = function() {
            if (!$localStorage.scores) {
                $localStorage.scores = {};
            }

        }
        
        this.getScores = function(gameType) {
            var scores = $localStorage.scores[gameType];
            if (scores) {
                scores.sort(this.sortFunction);
            } else {
                scores = [];
            }
            return scores;
        }
        
        this.saveScore = function(gameType, score) {
            if (!$localStorage.scores[gameType]) {
                $localStorage.scores[gameType] = [];
            }
            var gameScores = $localStorage.scores[gameType];
            score.id = gameType + gameScores.length;
            
            $localStorage.scores[gameType].push(score);
            $localStorage.scores[gameType].sort(this.sortFunction);
            
            return score.id;
            
        }
        
        this.resetScores = function(gameType) {
            delete $localStorage.scores[gameType];
            
        }
        
        this.resetAllScores = function(gameType, score) {
            $localStorage.$reset();
            this.initScore();
            
        }
        
        this.sortFunction = function(a, b) {
            return b.points - a.points;
        }
        
        this.initScore();
        
        
    }

    angular.module('main')
        .service('Score', Score);
})();
