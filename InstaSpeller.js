"use strict";

var CreateInstaSpellModule = function (){
    var OPERATOR_ONE_ANY_LETTER = "?";
    var OPERATOR_MANY_ANY_LETTERS = "%";
    var OPERATOR_ONE_RACK_LETTER = ".";
    var OPERATOR_MANY_RACK_LETTERS = "*";
    var BLANK_TILE = ".";
    

    var alphabet =  "abcdefghijklmnopqrstuvwxyz".split("");

    // Repeatedly reduce: ** -> *
    //                    *. -> .*
    //                    %% -> %
    //                    %? -> ?%
    function normalizePattern(pattern){
        var types = [[OPERATOR_ONE_ANY_LETTER,OPERATOR_MANY_ANY_LETTERS],
                     [OPERATOR_ONE_RACK_LETTER,OPERATOR_MANY_RACK_LETTERS]];
        var changed = true;
        while (changed){
            changed = false;
            var npattern = pattern;
            for (var i=0;i<types.length;++i){
                var single = types[i][0];
                var multi = types[i][1];
                npattern = npattern.replace(multi+single, single+multi);
                npattern = npattern.replace(multi+multi, multi);
            }
            if (npattern !== pattern){
                changed = true;
                pattern = npattern;
            }
        }
        return pattern;
    }

    // list of lowercase alphabetic strings -> WordMatcher
    function WordMatcher(dictionary){
        var words = dictionary.slice();

        var prefixes = {};
        for (var i=0;i<words.length;++i){
            var word = words[i];
            for (var j=0;j<=word.length;++j){
                var prefix = word.substring(0,j);
                if (!prefixes.hasOwnProperty(prefix)){
                    prefixes[prefix] = {
                        isWord : false,
                        longest : 0,//longest suffix s such that prefix+s is a word
                    };
                }
                var entry = prefixes[prefix];
                entry.longest = Math.max(entry.longest, word.length-j);
                if (j===word.length){
                    entry.isWord = true;
                }
                prefixes[prefix] = entry;
                
            }
        }  

        function isPrefix(prefix){
            return prefixes.hasOwnProperty(prefix);
        }
        function longestSuffixLength(prefix){
            return prefixes[prefix].longest;
        }
        function isWord(word){
            return prefixes.hasOwnProperty(word) && prefixes[word].isWord;
        }

        function minimumMatchLength(pattern){
            var c=0;
            for (var i=0;i<pattern.length;++i){
                var p = pattern[i];
                if (p!== OPERATOR_MANY_ANY_LETTERS && p!==OPERATOR_MANY_RACK_LETTERS){
                    c++;
                }
            }
            return c;
        }
        

        this.getMatches = function(rack,pattern){
            pattern = normalizePattern(pattern);
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
                if (longestSuffixLength(acc) < minimumMatchLength(pattern)){
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

                    if ((p===OPERATOR_ONE_RACK_LETTER || p.toLowerCase()===lt) 
                        && rackCounts[BLANK_TILE]){
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