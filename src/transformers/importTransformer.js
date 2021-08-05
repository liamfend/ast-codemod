const camelCase = require('camelcase'); 

const toCamelCase = (str) =>camelCase(str, {pascalCase: true, preserveConsecutiveUppercase: true})

const transformer = (file, api) => {
  const j = api.jscodeshift;
  const root = j(file.source)
  const importExpressions = root.find(j.ImportDeclaration, {
    source: {
      type: "Literal",
      value: "~components/svg",
    },
  });
  var importNames = new Set();
  const identifierCollection = importExpressions.find(j.Identifier);

  if (identifierCollection.size() > 0) {
    const variabeleName = identifierCollection.get(0).node.name;
    root.findJSXElements(variabeleName).map((nodePath) => {
      const { node } = nodePath;
      let params = {};
      node.openingElement.attributes.forEach((item) => {
        params[`${item.name.name}`] = item.value.value;
      });
      node.openingElement.attributes = node.openingElement.attributes.filter(
        (item) => item.name.name !== "hash"
      );
      let componentName = toCamelCase(params.hash);
      node.openingElement.name.name = `${componentName}Icon`;
      importNames.add(componentName);
    });
    //删除之前的引用
    importExpressions.replaceWith((nodePath) => {
      const { node } = nodePath;
      node.specifiers = Array.from(importNames).map((name) =>
         //svg组建的名字会和其他组建重复。。 我真的不想判断了。太累了直接用as全部重写
        //j.importSpecifier(j.identifier(name), j.identifier(name))
        j.importSpecifier(j.identifier(name), j.identifier(`${name}Icon`))
      );
      node.source.value = "~components/svgs";
      return node;
    });

    return root.toSource();
  }

  
};
module.exports = transformer