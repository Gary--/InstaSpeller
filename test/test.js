"use strict";

var expect = chai.expect;

describe("Correctness", function() {
    var words =["aa",
                "aas",
                "and",
                "android",
                "androids",
                "art",
                "artistic",
                "arts",
                "base",
                "basic",
                "dog",
                "moon",
                "mooned",
                "moons",
                "quick",
                "quickly",
                "silient",
                "siliently",
                "tale",
                "teal",
                "zeal",
                "zealot",
                "zed",
                "zeds",];
    var module = CreateInstaSpellModule();
    var matcher = new module.WordMatcher(words);
    
    function m(rack,pattern){
        return matcher.getMatches(rack,pattern);
    }
    function t(rack,pattern,expectedResult){
        var result = m(rack,pattern);
        result.sort();
        expectedResult.sort();
        expect(result.length).to.equal(expectedResult.length);

        _.each(result,function(w,i){
            expect(w).to.equal(expectedResult[i]);
        });
    }

    it("No rack, exact word match",function(){
        _.each(words,function(w){
            t("",w,[w]);
        });
        var notWords=["xkcd","zedss","atale"];
        _.each(notWords,function(w){
            t("",w,[]);
        });
    });


});