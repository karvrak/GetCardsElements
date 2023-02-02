 const fs = require('fs');
 const readline = require('readline');
 const stream = require('stream');
 var res = '';
 var i = 1;
 var tabRarity = [];
 var tabIdCard = [];
 var tabFlavorText = [];
 var tabPT = [];
 var tabType = [];
 var tabRuleText = [];
 var tabName = [];   


 //open the readline
 function readLines({ input }) {
   const output = new stream.PassThrough({ objectMode: true });
   const rl = readline.createInterface({ input });
   rl.on("line", line => { 
     output.write(line);
   });
   rl.on("close", () => {
     output.push(null);
   }); 
   return output;
 }



 //start reading
 const input = fs.createReadStream("./index.html");
 (async () => {


   //for each type of line get them and put them in an array

    for await (const line of readLines({ input })) {
        if(line.startsWith("	     <span class='rarity'")){
            const startIndex = line.indexOf("title=") + 7;
            const endIndex = line.indexOf("></", startIndex);
            res = line.substring(startIndex, endIndex-1);
            tabRarity.push(res);

        }else if(line.startsWith("	     <span class='card-number'")){

            const startIndex = line.indexOf("'card-number'") + 16;
            const endIndex = line.indexOf("</", startIndex);
            res = line.substring(startIndex, endIndex);
            tabIdCard.push(res);

        }else if(line.startsWith("	     <span class='flavor-text'  >")){

            const startIndex = line.indexOf("<span class='flavor-text'  >")+ 28 ;
            const endIndex = line.indexOf("</", startIndex);
            res = line.substring(startIndex, endIndex).replace(/&#(\d+);/g, function(match, dec) { //replace is for this kind of text "qu&#8217;est-ce que c&#8217"
              return String.fromCharCode(dec);
            });
            tabFlavorText.push(res);

        }else if(line.startsWith("	     <span class='pt'           >")){

            const startIndex = line.indexOf("<span class='pt'           >")+ 28 ;
            const endIndex = line.indexOf("</", startIndex);
            res =line.substring(startIndex, endIndex);
            tabPT.push(res);

        }else if(line.startsWith("	     <span class='type'         >")){

            const startIndex = line.indexOf("<span class='type'         >")+ 28 ;
            const endIndex = line.indexOf("</", startIndex);     
            res =line.substring(startIndex, endIndex).replace(/&#(\d+);/g, function(match, dec) {
              return String.fromCharCode(dec);
            });
            tabType.push(res);

        }else if(line.startsWith("	     <span class='rule-text'    >")){

            const startIndex = line.indexOf("<span class='rule-text'    >")+ 28 ;
            res =line.substring(startIndex).replace(/&#(\d+);/g, function(match, dec) {
              return String.fromCharCode(dec);
            });
            tabRuleText.push(res);

        }else if(line.startsWith("	     <span class='name'    >")){

            const startIndex = line.indexOf("<span class='name'    >")+ 23 ;
            const endIndex = line.indexOf("</", startIndex);
            res =line.substring(startIndex, endIndex).replace(/&#(\d+);/g, function(match, dec) {
                return String.fromCharCode(dec);
            });
            tabName.push(res);

        }
    }

    //put everything in a json file
    const jsonData = [];
    for (let i = 0; i < tabRarity.length; i++) {
        const item = {
          id: tabIdCard[i],
          name: tabName[i],

          type: tabType[i],
          rarity: tabRarity[i],
          RuleText: tabRuleText[i],
          flavorText: tabFlavorText[i],
          pt: tabPT[i] ,

        };
        jsonData.push(item);
      }
    const data = JSON.stringify(jsonData);
    fs.writeFileSync('tab.json', data);
    
   
})();


