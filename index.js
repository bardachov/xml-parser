const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');

const baseFeedUrl = '<YOUR TEAMCITY URL>';

const cleanAndParseXml = (xmlData) => {
  const cleanXmlData = xmlData.trim();
  return new Promise((resolve, reject) => {
    xml2js.parseString(cleanXmlData, { explicitArray: false }, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};


const parseXmlFile = (filePath) => {
  const xmlData = fs.readFileSync(filePath, 'utf8');
  return cleanAndParseXml(xmlData);
};


const readNamesJson = (jsonFilePath) => {
  const jsonData = fs.readFileSync(jsonFilePath, 'utf8');
  return JSON.parse(jsonData).names;
};


const generateJsonFromXml = async (xmlFilePath, namesFilePath) => {
  try {
    
    const projectsData = await parseXmlFile(xmlFilePath);
    const projectNames = readNamesJson(namesFilePath);

    const output = projectNames.map(name => ({
      feedName: name,
      feedType: 'cctray',
      feedUrl: baseFeedUrl,
      name: name
    }));

    const outputFilePath = path.join(__dirname, 'output.json');
    fs.writeFileSync(outputFilePath, JSON.stringify(output, null, 2));

    console.log(`JSON file has been successfully created at ${outputFilePath}`);
  } catch (error) {
    console.error('Error:', error.message);
  }
};

const [,, xmlFilePath, jsonFilePath] = process.argv;

if (!xmlFilePath || !jsonFilePath) {
  console.error('Please provide both XML file path and JSON file path as arguments.');
  process.exit(1);
}

generateJsonFromXml(xmlFilePath, jsonFilePath);
