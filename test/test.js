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



    it("No rack, exact word match",function(){
        _.each(words,function(w){
            var result = m("",w);
            expect(result.length).to.equal(1);
            expect(result[0]).to.equal(w);
        });
    });
});