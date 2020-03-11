import fs from 'fs';
import * as util from 'util';


const readFile = util.promisify(fs.readFile);


interface Data {
  lines: string[];
}

const searchInFile = async (path: string, pattern: string): Promise<Data | null> =>
  readFile(path, { encoding: 'UTF-8' })
    .then((content) => {
      const regex = new RegExp(`.*\\b${pattern}\\b.*`, 'g');
      const match = content.match(regex);

      if (match) {
        return { lines: match };
      }
      return null;
    });


export default searchInFile;
