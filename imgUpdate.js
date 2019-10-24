var fs = require('fs');

const imgPath = './public/imgs/';
let imgObj = {};
fs.readdir(imgPath, (err, files) => {
  files.forEach(dir => {
    if (dir !== '.DS_Store') {
      imgObj[dir] = getFileNames(imgPath, dir);
    }
  });
  fs.writeFile('./src/games/meme/meme_img.json', JSON.stringify(imgObj), 'utf8', () => {});
});

function getFileNames(path, dir) {
  fileArr = [];
  fs.readdirSync(path + dir).map(fileName => {
    if (fileName !== '.DS_Store') {
      fileArr.push(fileName);
    }
  });
  return fileArr;
}
