// import express module
import express from 'express';
import fs from "node:fs/promises";
const app = express();

const port = process.env.PORT || 3000;

// Define the public dir to serve static files
const PUBLIC_DIR = 'public';
const DATA_DIR = PUBLIC_DIR + '/presets';

// Serve static files from the public directory
app.use(express.static(PUBLIC_DIR));

// Define routes to serve specific files
app.get('/api/presets', async (req, res) => {
  // 1 Read the files located in the DATA_DIR directory
    const files = await fs.readdir(DATA_DIR);
    // 2 Keep only the .json files
    let filesSorted = [];
    filesSorted = files.filter(file => file.endsWith('.json'));

    // Read all files and build the results array
    let results = [];

    /*
    // 3 For each file, read its content and parse it as JSON
    for(let i=0; i<filesSorted.length; i++) {
        // turn the file name into a full path
        const filePath = DATA_DIR + '/' + filesSorted[i];
        // read the file content
        const fileContent = await fs.readFile(filePath, 'utf-8');
        // The fileContent is a string, we need to parse it as JSON and turn it into
        // a JS object in order to push it into the results array
        const jsonData = JSON.parse(fileContent);

        // push the jsonData into the results array
        results.push(jsonData);
    }
*/
    // Using Promise.all to read files in parallel
    results = await Promise.all(filesSorted.map(async (file) => {
        const filePath = DATA_DIR + '/' + file;
        const fileContent = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(fileContent);
    }
    ));
    
    // 3 For each file, read its content and parse it as JSON
    // Send the results as JSON
    res.json(results);
});


// start the Express server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});