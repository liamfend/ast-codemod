
const transformer = (file, api)=>{
    const j =  api.jscodeshift
    var ast  = j(file.source)
    return j(file.source)
    .find(j.Identifier)
    .replaceWith(
      p => j.identifier(p.node.name.split('').reverse().join(''))
    )
    .toSource();
}