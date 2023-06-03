const fs = require("fs"); 
const path = require("path");
const { execSync } = require("child_process"); 
const { v4: uuid } = require("uuid"); 

const codedir = "/home/vivek/Desktop/codefire"
const dirCodes = path.join(codedir , "codes");
if(!fs.existsSync(dirCodes)){
    fs.mkdirSync(dirCodes,{recursive: true});
}

module.exports.generateFile = async function(lang , code){

    const JobId = uuid();
    const filename = `${JobId}.${lang}`;
    const filepath = path.join(dirCodes,filename);
     fs.writeFileSync(filepath,code);
    return filepath;
}
module.exports.generateInOutTxt = async function(inp , out ){
    try{
            const dirprob = dirCodes;
        if(!fs.existsSync(dirprob)){
            fs.mkdirSync(dirprob,{recursive: true});
        }
        
        
            
            const inputfilepath = path.join(dirprob,"input.txt");
            fs.writeFileSync(inputfilepath,inp);
            const answerfilepath = path.join(dirprob,"answer.txt");
            fs.writeFileSync(answerfilepath , out);
            console.log(inp);
            console.log(out);

        return true;

    }catch(err){
        return false;    
    }
    


}


module.exports.checkcompile = async function(filepath){
    const exec_options = {
        cwd : '/home/vivek/Desktop/codefire/codes'
    }
   
    try{
        
        let stdout = execSync(`g++ ${filepath} -o testprogram  `,exec_options);
        
        return true;
    }catch(err){
        
            console.log('err' , console.log(err.stderr.toString()));

            return false;
        
        
    }
}


module.exports.executecpp = async function(filepath){
    const exec_options = {
        cwd : '/home/vivek/Desktop/codefire/codes'
    }
   
    try{
        
        let child = execSync(`./testprogram < input.txt > output.txt && diff output.txt answer.txt`,exec_options);
        
        return true;
    }catch(err){
        if(err.status ===1){
            return false;
        }
        return {
            error : 1
        };
    }
}


