'use strict';

(function() {

  function MainCtrl($http, $scope, $rootScope, $timeout, $interval, $state, $stateParams, $window, $ionicModal, 
    Card, Draw, Score, Levels, ngProgressFactory, $ionicPlatform, $cordovaNativeAudio) {
      
    // Parse.initialize("FzVpFjAVSXFxGqwgMVUkmimSV1ABv2pKthr4fUZD");
    // Parse.serverURL = 'http://superset.parseapp.com:1337/parse'
    
    // var TestObject = Parse.Object.extend("TestObject");
    // var testObject = new TestObject();
    // testObject.save({foo: "bar"}).then(function(object) {
    //   alert("yay! it worked");
    // });
      
   
      
    var vm = this;
    vm.soundLoaded = false;
    
    $ionicPlatform.ready(function() {

        // all calls to $cordovaNativeAudio return promises
        /*

        $cordovaNativeAudio.preloadSimple('select', 'main/assets/audio/select.wav',
          function (msg) {
              vm.soundLoaded = true;
          },
          function (error) {
              vm.soundLoaded = false;
          });
        $cordovaNativeAudio.preloadSimple('success', 'main/assets/audio/success.aiff');
        $cordovaNativeAudio.preloadSimple('failure', 'main/assets/audio/failure.mp3');
        */
        
    });
    
    vm.play = function(sound) {
      if (vm.soundLoaded && $rootScope.soundOn)
        $cordovaNativeAudio.play(sound);
    };
    
    
    Score.initScore();
    vm.gridHeight = $window.innerHeight - 200;
    console.log("vm.gridHeight: ", vm.gridHeight);
    
    //attributes
    vm.allAttributes = {
        color: ['red','green','blue','#CFA900','#8600b3'],
        shape: ['ellipse','rectangle','triangle','diamond','pentagon'],
        pattern: ['empty','striped','solid','dots','plaid'],
        number: [1,2,3,4,5],
        background: ['red','green','blue','yellow','purple']
    }
    
    
    vm.toggleSelect = function(card) {
      
      if(!card.selected) {
        vm.selectedCards.push(card);
        card.selected = true;
        card.addCssClass('active');
      } else {
        card.selected = false;
        card.removeCssClass('active');
        vm.selectedCards = vm.selectedCards.filter(function( selectedCard ) {
            return selectedCard.id !== card.id;
        });
      }
      
      if (vm.selectedCards.length === vm.cardsPerSet) {
        
        var alert = {
            msg: 'That\'s not a set!',
            type: 'item-assertive'
        };
        
        var setDifficulty = vm.foundSet(vm.selectedCards);
        
        if (setDifficulty > 0) {
          
          vm.play('success');
          
          angular.forEach(vm.selectedCards, function(card) {
            card.selected = false;
            card.removeCssClass('rollIn');
            card.addCssClass('zoomOut');
          });
          
          var alert = {
              msg: 'You found a set!',
              type: 'item-balanced'
          };
          
          vm.levelSets++;
          vm.gameSets++;
          var setDifficultyBonus = setDifficulty * 20;
          var setsAvailableBonus = parseInt(100 / vm.foundSets.length);
          if (!vm.hintUsed) {
            vm.gamePoints += (100 + setDifficultyBonus + setsAvailableBonus) * (vm.currentLevelIndex + 1);
          }
          
          if (vm.levelSets === vm.setsToFind) {
            vm.endLevel();
            
          } else {
            //vm.alert = alert;
            $timeout(function(){
                vm.getNewCards();
            }, 100);
          }
          
          vm.hintUsed = false;
          
        } else {
          vm.play('failure');
          angular.forEach(vm.selectedCards, function(card) {
            card.selected = false;
            card.removeAllCssClasses();
            card.addCssClass('active');
            $timeout(function(){
                 card.addCssClass('jello');
            }, 0);
            $timeout(function(){
                 card.removeCssClass('active');
            }, 500);
           
            
          });
          
          vm.selectedCards = [];
          
        }
        
        vm.hintsDisabled = false;
        vm.hintUsed = false;
        
        
         
      } else {
        vm.play('select');
      }
      
      
    }
    
    vm.getNewCards = function() {
      
        if (vm.cards.length > 0) {
            vm.replaceFoundSet();
        } else {
          vm.endLevel();
        }
          


        
        angular.forEach(vm.selectedCards, function(card) {
          card.selected = false;
          card.removeCssClass('active');
        })
        
        vm.selectedCards = [];
        vm.alert = false;
      
    }
    
    vm.findRemainingCards = function(seedCards) {
      var foundCards = [];
      var possibleSet = seedCards.slice(0);
      var indexesFound = [];
      for (var i = 0; i < vm.cards.length; i++) {
        var foundCard = vm.cards[i];      
        possibleSet.push(foundCard);
        indexesFound.push(i);
        if (vm.foundSet(possibleSet)) {
          
          foundCards.push(foundCard);
          
          if (foundCards.length === (vm.cardsPerSet - seedCards.length)) {
            //console.log("foundCards: " + foundCards);
            for (var j = 0; j < indexesFound.length; j++) {
              //console.log("foundCard: " + vm.cards[indexesFound[j]-j]);
              vm.cards.splice(indexesFound[j]-j, 1);
            }
            return foundCards;
          }
        } else {
          possibleSet.pop(foundCard);
          indexesFound.pop(i);
        }
      }
        
      //if the right number of cards weren't found just return empty to try again with different cards.
      return [];
    }
    
    vm.getReplacementCards = function(unselectedCards, unselectedIndexes, selectedIndexes) {
      var replacedCards = [];
      var setsFound = 0;
      
      //Try to find existing subsets among cards
      for (var cardsPerSet = vm.cardsPerSet - 1; cardsPerSet >= 2; cardsPerSet--) {
        vm.findCurrentSets(unselectedCards, cardsPerSet);
        if (vm.foundSets.length > 0) {
          vm.shuffle(vm.foundSets);
          for (var i = 0; i < vm.foundSets.length; i++) {
            var foundSet = vm.foundSets[i];
            var remainingCards = vm.findRemainingCards(foundSet);
            if (remainingCards.length > 0) {
              replacedCards = replacedCards.concat(remainingCards);
              setsFound++;
            }
            console.log("setsFound: " + setsFound);
            if (setsFound >= vm.minSets) {
              if (replacedCards.length >= vm.selectedCards.length) {
                replacedCards.splice(vm.cardsPerSet);
              } else { //we found the min sets so fill rest with top of deck
                for (var j = replacedCards.length; j < vm.selectedCards.length; j++) {
                  replacedCards.push(vm.cards.splice(0,1)[0]);
                }
                
              }
              vm.shuffle(replacedCards);
              return replacedCards;
            }
            
            
            
          };
            
          
        }
        
      }
      
      
      /*vm.shuffle(unselectedIndexes);
      for (var i = 0; i < unselectedIndexes.length; i++) {
        for (var j = i + 1; j < unselectedIndexes.length; j++) {
          var card1 = vm.currentCards[unselectedIndexes[i]];
          var card2 = vm.currentCards[unselectedIndexes[j]];
          replacedCards = replacedCards.concat(vm.findRemainingCards([card1, card2]));
          if (replacedCards.length >= vm.selectedCards.length) {
            
            return replacedCards.slice(0, vm.cardsPerSet);
          }
        }
      }*/
      console.log("no more sets for remaining cards. " + vm.cards.length + " cards left.");
      vm.reshuffleAndDeal();
    }
    
    vm.reshuffleAndDeal = function() {
      console.log("reshuffling...");
      vm.cards = vm.cards.concat(vm.currentCards);
      vm.currentCards = [];
      vm.shuffle(vm.cards);
      vm.deal();
    }
   
    
    vm.replaceFoundSet = function() {
      
      if(vm.gameEnded) return;
      var unselectedCards = [];
      var replacedCards = [];
      
      var unselectedIndexes = [];
      var selectedIndexes = [];
      var selected = false;
      
      console.log("vm.selectedCards: " + vm.selectedCards);
      for (var i = 0; i < vm.currentCards.length; i++) {      
        for (var j = 0; j < vm.selectedCards.length; j++) {
          if (vm.currentCards[i].id === vm.selectedCards[j].id) {
            selected = true;
          } 
        }
        if (selected) {
          selectedIndexes.push(i);
          
          selected = false;
        } else {
          unselectedIndexes.push(i);
          //recreate current cards with just the unselected ones
          unselectedCards.push(vm.currentCards[i]);
        }
        
      }
      
      //see if adding from top satisfies min set
      var possibleReplacements = [];
      for (var i = 0; i < selectedIndexes.length; i++) {
        var replacementCard = vm.cards.splice(0,1)[0];
        possibleReplacements.push(replacementCard);
        var index = selectedIndexes[i];
        vm.addNewCardAnimation(index+1, replacementCard);
        vm.currentCards[index] = replacementCard;
      }
      
      //find currents sets in remaining unselected cards
      vm.findCurrentSets();
      
      //if we already have a set in the current cards just get random cards
      if (vm.foundSets.length < vm.minSets) {
        vm.cards = vm.cards.concat(possibleReplacements);
        replacedCards = vm.getReplacementCards(unselectedCards, unselectedIndexes, selectedIndexes);
        console.log("before vm.currentCards: " + vm.currentCards);
        console.log("selectedIndexes: " + selectedIndexes);
        console.log("replacedCards: " + replacedCards);
        for (var k = 0; k < selectedIndexes.length; k++) {
          var index = selectedIndexes[k]
          vm.addNewCardAnimation(index+1, replacedCards[k]);
          vm.currentCards[index] = replacedCards[k];
          
        }
        console.log("after vm.currentCards: " + vm.currentCards);
      } else {
        replacedCards = possibleReplacements;
      }
      
      
      
      
      vm.findCurrentSets();
      vm.updateCardRows();
      vm.selectedCards = [];
      
      $timeout( 
        function() { 
          vm.drawCards(replacedCards); 
        }, 0);

        
    }
    
    vm.createCardRows = function() {
      
      vm.currentCardRows = [];
      var rows = vm.NUMCARDS / vm.COLS;
      for (var i = 0; i < rows; i++) {
        vm.currentCardRows[i] = [];
        for (var j = 0; j < vm.COLS; j++) {
          vm.currentCardRows[i][j] = vm.currentCards[(i*vm.COLS)+j]; 
        }
      }
      
    }
    
    vm.updateCardRows = function() {
      
      var rows = vm.NUMCARDS / vm.COLS;
      for (var i = 0; i < rows; i++) {
        for (var j = 0; j < vm.COLS; j++) {
          vm.currentCardRows[i][j] = vm.currentCards[(i*vm.COLS)+j];
        }
      }
      
    }
    
    vm.foundSet = function(possibleSet) {
      
      var setDifficulty = 0;
      var foundSet = true;
      angular.forEach(vm.attributeKeys, function(attribute) {

        if (possibleSet[0][attribute] == possibleSet[1][attribute]) {
          for (var i = 1; i < possibleSet.length - 1; i++) {
            if (possibleSet[i][attribute] != possibleSet[i+1][attribute]) {
              foundSet = false;
            }
          }
          
          
        } else {
          for (var j = 0; j < possibleSet.length; j++) {
            for (var k = j + 1; k < possibleSet.length; k++) {
              if (possibleSet[j][attribute] == possibleSet[k][attribute]) {
                foundSet = false;
              }
            }
          }
          setDifficulty++;

        }
      });
      if (!foundSet) {
        setDifficulty = 0;
      }
      return setDifficulty;
    }

    vm.isSelected = function(card) {
        angular.forEach(vm.selectedCards, function(selectedCard) {
          if(card.id == selectedCard.id) {
            return true;
          }
        });
        return false;
    }
    
    vm.findSetForNewDeal = function() {
      
      var indexes = [0,1,2,3,4,5,6,7,8,9,10,11];
      
      for (var i = 0; i < vm.cardsPerSet; i++) {
        var index = Math.floor(Math.random() * indexes.length);
        var cardIndex = indexes[index];
        console.log("cardIndex: " + cardIndex);
        indexes.splice(index, 1);
        vm.selectedCards.push(vm.currentCards[cardIndex]);
      }
      
      vm.replaceFoundSet();

    }
    
    vm.shuffle = function(array) {
      var currentIndex = array.length, temporaryValue, randomIndex;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

    }
    
    vm.cycleThroughDecks = function() {
      
      $rootScope.attributeKeys = ['shape', 'pattern', 'number', 'color', 'background'];
      $rootScope.cardsPerSet = 4;
      
      var rounds = [];
      var found = 0;
      for (var i = 0; i < 1; i++) {
        var round = 0;
        console.log("Game: " + i);
        console.log("Number of attributes: " + $rootScope.attributeKeys.length);
        console.log("Cards per set: " + $rootScope.cardsPerSet);
        
        vm.startGame();
        console.log(vm.cards.length + " cards in deck at start.")
        while (vm.cards.length >= vm.NUMCARDS && !vm.gameEnded) {
          if (!rounds[round]) {
            var roundKey = 'round' + round;
            rounds[round] = {}
            rounds[round][roundKey] = 0;
          }

          rounds[round]['round' + round] += 1;
          vm.selectedCards = vm.foundSets[0];
          vm.replaceFoundSet();
          round++;

          
        }
        
        
      }
      
      angular.forEach(rounds, function(round) {
        console.log(JSON.stringify(round))
      });
    }
    
    vm.getRandomColor = function() {
        var index = Math.floor(Math.random() * 5);
        return vm.allAttributes.color[index];
    }
    
    vm.getRandomBackground = function() {
        var index = Math.floor(Math.random() * 5);
        return vm.allAttributes.background[index];
    }
    
    //recursion is so hard
    vm.generateDeck = function(args) {
      if(vm.gameEnded) return;
      //console.log(args);
      var keys = vm.attributeKeys;
      var argLength = args.length;
      if (argLength === keys.length) {
        var cardData = {}
        for (var i = 0; i < keys.length; i++) {
          cardData[keys[i]] = args[i];
        }
        cardData.id = vm.cards.length;
        cardData.cssClass = [vm.cardClass]; 
        if (!cardData.background) {
            cardData.background = '';
        } 
        if (!cardData.color) {
            cardData.color = 'blue';
        } 
        var card = new Card(cardData);
        
        vm.cards.push(card);
        //console.log(card);
      } else {
        var key = keys[argLength];
        angular.forEach(vm.attributes[key], function(attribute) {
          args[argLength] = attribute;
          var newArgs = args.slice(0);
          vm.generateDeck(newArgs);
        });
        
      }

    };
    
    vm.addNewCardAnimation = function(position, card) {
      //protect against quick clicks I guess
      if (!card) return;
      if (position <= 4) {
          card.addCssClass('fadeInDownBig');
        } else if (position <= 6) {
          card.addCssClass('fadeInLeftBig');
        } else if (position <= 8) {
          card.addCssClass('fadeInRightBig');
        } else {
          card.addCssClass('fadeInUpBig')
        }
      
    }
    
    vm.deal = function() {
      while (vm.currentCards.length < vm.NUMCARDS) {
        var card = vm.cards.splice(0,1)[0];
        //card.addCssClass('_' + (vm.currentCards.length + 1));
        var position = vm.currentCards.length + 1;
        vm.addNewCardAnimation(position, card);
        vm.currentCards.push(card);
      }
      
      vm.createCardRows();
      
      
      
      $timeout( 
        function() { 
          vm.drawCards(); 
        }, 0);
        
      vm.findCurrentSets();
      if (vm.foundSets.length < vm.minSets) {
        vm.findSetForNewDeal();
      }

    };
    
    vm.drawCards = function(cards) {
      //no need to draw cards if the game is ended
      if(vm.gameEnded) return;
      
      Draw.initDraw();
      
      if (!cards) {
        cards = vm.currentCards;
      }
      console.log("cards: " + cards);
      angular.forEach(cards, function(card) {
        Draw.drawCard(card);
        
        //g.transform('R90', 50, 45);
      });
      
      
    };
    
    //what more recursion???
    vm.findCurrentSetsRec = function(cards, cardsPerSet, possibleSet, index) {
      //dont want to get stuck in recursion if the game is ended
      if(vm.gameEnded) return;
      //var possibleSet = set.slice(0);
      if (possibleSet.length === cardsPerSet) {
        if (vm.foundSet(possibleSet) > 0) {
          vm.foundSets.push(possibleSet);
        }
      } else if (possibleSet.length === 0) {
        for (var i = 0; i < cards.length; i++) {
          var newSet = possibleSet.slice(0);
          newSet.push(cards[i]);
          vm.findCurrentSetsRec(cards, cardsPerSet, newSet, i);
        }
      } else {
        for (var j = index + 1; j < cards.length; j++) {
          var copySet = possibleSet.slice(0);
          copySet.push(cards[j]);
          vm.findCurrentSetsRec(cards, cardsPerSet, copySet, j);
        }
      }
    }
    
    vm.findCurrentSets = function(cards, cardsPerSet) {
      if (!cards) {
        cards = vm.currentCards.slice(0);
      }
      
      if (!cardsPerSet) {
        cardsPerSet = vm.cardsPerSet;
      }
      
      vm.foundSets = [];
      vm.findCurrentSetsRec(cards, cardsPerSet, []);
    };
    
    vm.showHint = function() {
      vm.hintsDisabled = true;
      vm.hintUsed = true;
      vm.hints--;
      angular.forEach(vm.selectedCards, function(card) {
        card.selected = false;
        card.removeCssClass('active');
      });
      vm.selectedCards = [];
      for (var i = 0; i < 2; i++) {
        var card = vm.foundSets[0][i];
        vm.selectedCards.push(card);
        card.selected = true;
        card.addCssClass('active');
      }
      
    }
    

    
    vm.setupAttributes = function() {
      vm.attributes = {};
      angular.forEach(vm.attributeKeys, function(attributeKey) {
        vm.attributes[attributeKey] = [];
        for (var i = 0; i < vm.cardsPerSet; i++) {
            vm.attributes[attributeKey].push(vm.allAttributes[attributeKey][i]);
        }
        
      })
      
    }
    
    vm.checkTime = function() {
      vm.levelTime--
      var progressTime = (vm.levelTime / vm.startLevelTime) * 100;
      vm.progressBar.set(progressTime);
      if (vm.levelTime < 10) {
        vm.progressBar.setColor('red');
      } else if (vm.levelTime < 20) {
        vm.progressBar.setColor('yellow');
      }
      if (vm.levelTime <= 0) {
        $interval.cancel(vm.gameTimer);
        vm.endGame();
      }
    }
    
    vm.startTimer = function() {
      $interval.cancel(vm.gameTimer);
      vm.gameTimer = $interval(function() {
        vm.checkTime();
      }, 1000)
    }
    
    vm.quitGame = function() {
      vm.gameEnded = true;
      vm.cards = [];
      vm.currentCards = [];
      vm.currentCardRows = [];
      vm.selectedCards = [];
      vm.alerts = [];
    }
    
    vm.endGame = function() {

      vm.quitGame();
      var timeBonus = vm.levelTime * 10;
      vm.gamePoints += timeBonus;
      
      var gameData = {
        points: vm.gamePoints,
        sets: vm.gameSets,
        level: vm.currentLevelIndex + 1
      }
      
      $rootScope.gameScoreId = Score.saveScore(vm.gameType, gameData);
      var params = {gameType: vm.gameType};
      $state.go('scores', params);
    }
    
    vm.endLevel = function() {
      
      $interval.cancel(vm.gameTimer);

      
      if (vm.currentLevelIndex + 1 < vm.levels.length) {
        vm.currentLevelIndex++;
        vm.currentLevel = vm.levels[vm.currentLevelIndex];
        vm.startLevel();
        
      } else {
        vm.endGame();
        
      }
      
    }
    
    vm.startLevel = function() {
      
 
      vm.levelAnimation = 'fadeInDownBig';
  
      
      
      if (vm.gameMode != 'freeplay') {
        vm.progressBar.setColor('green');
        vm.progressBar.set(100);
      }
      var currentLevel = vm.currentLevel;
      
      vm.numAttributes = currentLevel.numAttributes;
      vm.setType = currentLevel.setType;
      vm.cardsPerSet = currentLevel.cardsPerSet;
      vm.setsToFind = currentLevel.setsToFind;
      vm.levelTime = currentLevel.time + vm.levelTime;
      vm.startLevelTime = vm.levelTime;
      vm.attributeKeys = currentLevel.attributeKeys;
      
      vm.minSets = currentLevel.minSets || 1;
      
  
      vm.cards = [];
      vm.currentCards = [];
      vm.currentCardRows = [];
      vm.selectedCards = [];
      vm.alerts = [];
      
      
      vm.levelSets = 0;
      
      vm.randomBackground = vm.getRandomBackground();
      vm.randomColor = vm.getRandomColor();
      vm.setupAttributes();
      vm.generateDeck([]);
      vm.shuffle(vm.cards);
      

    }
    
    vm.closeLevelIntro = function() {
      vm.levelAnimation = 'fadeOutDownBig';
      vm.deal();
      if (vm.gameMode != 'freeplay') {
        vm.startTimer();
      }
      
    }
    
    
    vm.startGame = function() {
      
      vm.gameType = $stateParams.gameType;
      vm.gameEnded = false;

      
      vm.cards = [];
      vm.currentCards = [];
      vm.currentCardRows = [];
      vm.selectedCards = [];
      vm.alerts = [];
      
      vm.gameSets = 0;
      vm.gamePoints = 0;
      vm.levelSets = 0;
      vm.levelPoints = 0;
      vm.levelTime = 0;
      vm.hints = 3;
      vm.hintsDisabled = false;
      
      vm.NUMCARDS = $rootScope.NUMCARDS || 12;
      vm.COLS = vm.NUMCARDS === 12 ? 4 : 5;
      vm.ROWS = vm.NUMCARDS / vm.COLS;
      
      if (vm.gameType !== 'levels') {        
        vm.gameMode = $rootScope.gameMode;
        vm.levels = [{
          setType: $rootScope.setType || 'Set',
          numAttributes: $rootScope.numAttributes || 4,
          attributeKeys: $rootScope.attributeKeys,
          cardsPerSet: $rootScope.cardsPerSet || 3,
          setsToFind: 100,
          time: 180
        }]
        
      } else {
        vm.levels = Levels.getLevels();
        vm.gameMode = 'levels';
      }
      
      vm.gameModeTitle = vm.gameMode == 'timed' ? 'Time Trial' : 'Free Play';
      
      if (vm.gameMode != 'freeplay') {
        vm.progressBar = ngProgressFactory.createInstance();
        vm.progressBar.setParent(document.getElementById('gameContainer'));
        vm.progressBar.setHeight('15px');
      } else {
        vm.hints = 100;
      }
      
      
      vm.currentLevelIndex = 0;
      vm.currentLevel = vm.levels[vm.currentLevelIndex];
      vm.startLevel();
        
        
        
    };
    
    vm.startGame();

    //vm.cycleThroughDecks();
    
    $ionicModal.fromTemplateUrl('pause-modal.html', {
      scope: $scope,
      animation: 'slide-in-up'
    }).then(function(modal) {
      vm.modal = modal;
    });
    
    vm.openModal = function() {
      $interval.cancel(vm.gameTimer);
      vm.modal.show();
    };
    vm.closeModal = function() {
      vm.modal.hide();
      vm.gameTimer = $interval(function() {
        vm.checkTime();
      }, 1000)
    };
    vm.quitToMenu = function() {
      vm.modal.hide();
      vm.quitGame();
      $interval.cancel(vm.gameTimer);
      $state.go('start');
    };

  }
  
  

  angular.module('main')
    .controller('MainCtrl', MainCtrl);

})();
