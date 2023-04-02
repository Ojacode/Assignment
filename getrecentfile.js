const path=require('path')  
const fs=require('fs')
  
  
  //get most recent file
const getMostRecentFile = (dir) => {
     const files = orderReccentFiles(dir);
     return files.length ? files[0] : undefined;
};

const orderReccentFiles = (dir) => {
return fs.readdirSync(dir)
.filter((file) => fs.lstatSync(path.join(dir, file)).isFile())
.map((file) => ({ file, mtime: fs.lstatSync(path.join(dir, file)).mtime }))
.sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
};


module.exports={
    getMostRecentFile:getMostRecentFile
}