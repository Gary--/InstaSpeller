"use strict";

var CreateInstaSpellModule = function (){
    var OPERATOR_ONE_ANY_LETTER = "?";
    var OPERATOR_MANY_ANY_LETTERS = "%";
    var OPERATOR_ONE_RACK_LETTER = ".";
    var OPERATOR_MANY_RACK_LETTERS = "*";
    var BLANK_TILE = ".";
    

    var alphabet =  "abcdefghijklmnopqrstuvwxyz".split("");

    // list of lowercase alphabetic strings -> WordMatcher
    function WordMatcher(dictionary){
        var words = dictionary.slice();

        var prefixes = {};
        for (var i=0;i<words.length;++i){
            var word = words[i];
            for (var j=1;j<=word.length;++j){
                prefixes[word.substring(0,j)] = false;
            }
        }  
        for (var i=0;i<words.length;++i){
            var word = words[i];
            prefixes[word] = true;
        }  



        function isPrefix(word){
            return prefixes.hasOwnProperty(word);
        }

        function isWord(word){
            return prefixes[word] === true;
        }

        

        this.getMatches = function(rack,pattern){
            var results = [];
            var rackCounts = {};
            for (var i=0;i<rack.length;++i){
                var r = rack[i];
                if (!rackCounts.hasOwnProperty(r)){
                    rackCounts[r] = 0;
                }
                rackCounts[r]++;
            }
            function matchesImpl(acc,pattern){
                if (pattern===""){
                    if (isWord(acc)){
                        results.push(acc);
                    }
                    return;
                }

                var p = pattern[0];
                if (p === OPERATOR_MANY_RACK_LETTERS){
                    matchesImpl(acc,OPERATOR_ONE_RACK_LETTER+pattern);
                    matchesImpl(acc,pattern.substring(1));
                    return;
                }
                if (p === OPERATOR_MANY_ANY_LETTERS){
                    matchesImpl(acc,OPERATOR_ONE_ANY_LETTER+pattern);
                    matchesImpl(acc,pattern.substring(1));
                    return;
                }

                // next letter
                for (var i=0;i<alphabet.length;++i){
                    var lt = alphabet[i];
                    var nextAcc = acc+lt;
                    if (! isPrefix(nextAcc)){
                        continue;
                    }

                    if (p === lt ||p===OPERATOR_ONE_ANY_LETTER){
                        matchesImpl(nextAcc,pattern.substring(1));
                        continue;
                    }

                    if ((p === OPERATOR_ONE_RACK_LETTER || p.toLowerCase()===lt)  && rackCounts[lt]){
                        rackCounts[lt]--;
                        matchesImpl(nextAcc,pattern.substring(1));
                        rackCounts[lt]++;
                        continue;
                    }

                    if (p===OPERATOR_ONE_RACK_LETTER && rackCounts[BLANK_TILE]){
                        rackCounts[BLANK_TILE]--;
                        matchesImpl(nextAcc,pattern.substring(1));
                        rackCounts[BLANK_TILE]++;
                        continue;
                    }
                }
            }
            matchesImpl("",pattern);
            return results;
        };
    }

    return {
        WordMatcher : WordMatcher,
        OPERATOR_ONE_RACK_LETTER : OPERATOR_ONE_RACK_LETTER,
        OPERATOR_ONE_ANY_LETTER : OPERATOR_ONE_ANY_LETTER,
        OPERATOR_MANY_RACK_LETTERS : OPERATOR_MANY_RACK_LETTERS,
        OPERATOR_MANY_ANY_LETTERS : OPERATOR_MANY_ANY_LETTERS,
        BLANK_TILE : BLANK_TILE,
    };
};