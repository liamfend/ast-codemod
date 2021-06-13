const  j = require('jscodeshift')
var describe = require('j-helper').describe;


const root = j(`import Svg from '~components/svg';alert('a');console.log('aaaa');show();let b =  Svg.test();<Svg hash='img' className='aaa' />; <Ks />`)


//删除console
const callExpressions  = root.find(j.CallExpression,{
    callee:{
        type: 'MemberExpression',
        object: { type: 'Identifier', name: 'console' },
    }
})

callExpressions.remove()

//查找导入的svg 模块 name
const importExpressions = root.find(j.ImportDeclaration,{ 
    source:{
        type:'Literal',
        value:'~components/svg'
    }
})
const identifierCollection=importExpressions.find(j.Identifier)
const nodePath = identifierCollection.get(0)
const variabeleName = nodePath.node.name 
// 替换 <Svg
const svgNodePath =root.findJSXElements('Svg').map((nodePath)=>{
    const {node} = nodePath
     let  params = {}
    node.openingElement.attributes.forEach(item=>{
        params[`${item.name.name}`] = item.value.value 
        item.value.value = 'cclllllc'
    }) 
    //let newAttribute = j.jsxAttribute(j.jsxIdentifier('myname'),j.literal('myvalue ~'))
    //node.openingElement.attributes.push(newAttribute)
    console.log(params)
})

//.replaceWith
// .replaceWith(nodePath => {
//     const { node } = nodePath
//     console.log(node)
//     node.openingElement.name.name = 'MySvg'
//     return node
// })
// .replaceWith()
// .toSource()
let myAttribute = j.jsxAttribute(j.jsxIdentifier('myname'),j.literal('myvalue ~'))

let myNewElement = j.jsxElement(j.jsxOpeningElement(
    j.jsxIdentifier('Test')
),j.jsxClosingElement(j.jsxIdentifier('Test')))

myNewElement.attributes.push(myAttribute)

 
console.log(svgNodePath.paths)

root.find(j.Program).get(0).node.body.push( j.expressionStatement(myNewElement) )
// root.insertAfter(myNewElement)
let m = root.toSource()

console.log(m)