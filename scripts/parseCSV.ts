const Papa = require('papaparse')
const fs = require('fs')
import { writeFile } from '$helpers/writeFile';
import { regionalesCSVPath, regionalesOutputPath, departementalesCSVPath, departementalesOutputPath, europeennesCSVPath, europeennesOutputPath } from './config';

const readCSV = async (filePath) => {
  const csvFile = fs.readFileSync(filePath)
  const csvData = csvFile.toString()  

  return new Promise(resolve => {
    Papa.parse(csvData, {
      header: true,
      delimiter: ';',
      skipEmptyLines: true,
      complete: function(results) {
        resolve(results.data)
      }
    });
  });
};

const removeUnwantedData = (json) => {
  json.forEach((line)=> {
    for (const key in line){
      if (line[key] === ""){
        delete line[key]; 
      }
    }
  })
  return json
}

export const writeJSON = async (csvFilePath, outputPath) => {
  let parsedData = await readCSV(csvFilePath); 
  let cleanData = await removeUnwantedData(parsedData)
  writeFile( outputPath, JSON.stringify(cleanData))
  console.log('Parsing of ', csvFilePath, 'completed with', cleanData.length, 'lines')
}

writeJSON(regionalesCSVPath, regionalesOutputPath)
writeJSON(departementalesCSVPath, departementalesOutputPath)
writeJSON(europeennesCSVPath, europeennesOutputPath)