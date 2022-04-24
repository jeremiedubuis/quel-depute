const Papa = require('papaparse')
const fs = require('fs')
import { writeFile } from '$helpers/writeFile';
import { slugify } from '$helpers/slugify';
import { deputeJSONPath, regionalesCSVPath, regionalesOutputPath, departementalesCSVPath, departementalesOutputPath, europeennesCSVPath, europeennesOutputPath } from './config';
import deputes from '../public/json/deputes.json';

const readCSV = async (filePath) => {
  const csvFile = fs.readFileSync(filePath)
  const csvData = csvFile.toString()  

  return new Promise(resolve => {
    Papa.parse(csvData, {
      header: true,
      delimiter: ';',
      // preview: 1,
      skipEmptyLines: true,
      complete: function(results) {
        resolve(results.data)
      }
    });
  });
};

const writeInDeputeFiles = async (json, label) => {
  for (const line of json) {
    for (const key in line){
      if (line[key] === ""){
        delete line[key];
      }
    }
    const county = line["Libellé du département"];
    const circumscription = line["Code de la circonscription"];

    if (county && circumscription) {
      const matchingDepute = deputes.find((c) => c.county.toUpperCase() == county.toUpperCase() && c.circumscription == circumscription);
      if (!matchingDepute) {
        console.log('missing', county, circumscription);
      } else {
        const slug = slugify(matchingDepute.firstname + ' ' + matchingDepute.lastname);
        const deputeFile = fs.readFileSync(deputeJSONPath + slug + '.json');
        if(deputeFile){
          
          delete line['Code du département'];
          delete line['Code de la circonscription'];
          delete line['Libellé du département'];
          let deputeFileContent = await JSON.parse(deputeFile)
          const jsonToAdd = {[label]: line}
          deputeFileContent = {...deputeFileContent, ...jsonToAdd}
          await writeFile( deputeJSONPath + slug + '.json', JSON.stringify(deputeFileContent, null, 4))
          console.log(label, slug, 'done')
      
        }
      }
    }
  }
  return json
}

export const writeJSON = async (csvFilePath, outputPath, label) => {
  let parsedData = await readCSV(csvFilePath); 
  await writeInDeputeFiles(parsedData, label)
  // writeFile( outputPath, JSON.stringify(cleanData))
  // console.log('Parsing of ', csvFilePath, 'completed with', cleanData.length, 'lines')
}

(async function(){
  await writeJSON(regionalesCSVPath, regionalesOutputPath, 'regionales')
  await writeJSON(departementalesCSVPath, departementalesOutputPath, 'departementales')
  await writeJSON(europeennesCSVPath, europeennesOutputPath, 'europeennes')
})();
