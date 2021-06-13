const  j = require('jscodeshift') 

const camelCase = require('camelcase');
const fs  = require('fs');
const path = require('path');
// var describe = require('j-helper').describe;

const toCamelCase = (str) =>camelCase(str, {pascalCase: true, preserveConsecutiveUppercase: true})

var content  = fs.readFileSync(path.resolve(process.cwd(),'src/waiting.js')).toString()
var newFile   = path.resolve(process.cwd(),'src/waiting1.js')
const root = j(content)    
//查找导入的svg 模块 name
const importExpressions = root.find(j.ImportDeclaration,{ 
    source:{
        type:'Literal',
        value:'~components/svg'
    }
})
var  importNames = new Set()
const identifierCollection=importExpressions.find(j.Identifier)

if(identifierCollection.size()>0){
    const variabeleName = identifierCollection.get(0).node.name 
    const svgNodePath =root.findJSXElements(variabeleName).map((nodePath)=>{
        const {node} = nodePath
        let  params = {}
        node.openingElement.attributes.forEach(item=>{
            params[`${item.name.name}`] = item.value.value 
        })
        node.openingElement.attributes = node.openingElement.attributes.filter(item => item.name.name!=='hash')
        let componentName = toCamelCase(params.hash)
        node.openingElement.name.name = componentName
        importNames.add(componentName) 
    })
    //删除之前的引用
    importExpressions.replaceWith(nodePath => {
        const {node} = nodePath
        node.specifiers =  [...importNames].map(name => j.importSpecifier(j.identifier(name),j.identifier(name)))
        node.source.value  =  '~components/svgs' 
        return  node
    }) 

   
}
 
let m = root.toSource()
 fs.writeFileSync(newFile,m)
//console.log(m)