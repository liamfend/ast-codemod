const  jscodeshift = require('jscodeshift')


const root = jscodeshift(`import Svg from '~components/svg';alert('a');console.log('aaaa');show();let b =  Svg.test();<Svg hash='img' className='aaa' />`)


//删除console
const callExpressions  = root.find(jscodeshift.CallExpression,{
    callee:{
        type: 'MemberExpression',
        object: { type: 'Identifier', name: 'console' },
    }
})

callExpressions.remove()

//查找导入的svg 模块 name
const importExpressions = root.find(jscodeshift.ImportDeclaration,{ 
    source:{
        type:'Literal',
        value:'~components/svg'
    }
})
const identifierCollection=importExpressions.find(jscodeshift.Identifier)
const nodePath = identifierCollection.get(0)
const variabeleName = nodePath.node.name 
 
root.find(jscodeshift.MemberExpression,{
    object:{
        name:variabeleName
    },
    property:{
        name:'test'
    }
})
.replaceWith(nodePath => {
    const { node } = nodePath
    node.property.name = 'myTest'
    return node
})
.find(jscodeshift.JSXOpeningElement,{
    
})
.replaceWith(nodePath => {
    const { node } = nodePath
    node.property.name = 'myTest'
    return node
})
.toSource()

let m = root.toSource()

console.log(m)