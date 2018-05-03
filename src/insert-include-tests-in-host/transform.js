const findModuleExports = (root, j) => {
  return root.find(j.ExpressionStatement, {
    expression: {
      type: 'AssignmentExpression',
      left: {
        type: 'MemberExpression',
        object: {
          type: 'Identifier',
          name: 'module',
        },
        property: {
          type: 'Identifier',
          name: 'exports',
        },
      },
    },
  });
};

const hasStrictMode = (programBody, j) =>
  programBody.some(statement =>
    j.match(statement, {
      type: 'ExpressionStatement',
      expression: {
        type: 'Literal',
        value: 'use strict',
      },
    })
  );

const getObjectProperties = moduleExport => {
  const rightNode = moduleExport.value.expression.right;
  if (rightNode.type === 'ObjectExpression') {
    return rightNode.properties;
  }
  const rightNodeArgs = rightNode.arguments.filter(
    node => node.type === 'ObjectExpression'
  );

  return rightNodeArgs[0].properties;
};

const filterByIncludesTestsInHost = props =>
  props.filter(prop => {
    return prop.key.name === 'includeTestsInHost';
  });

module.exports = (file, api) => {
  const j = api.jscodeshift;
  const root = j(file.source);
  const moduleExports = findModuleExports(root, j);
  const programBody = root.get().value.program.body;

  if (programBody.length === 0 || moduleExports.paths().length === 0) {
    return root.toSource();
  }

  const moduleExport = moduleExports.at(0).get();
  const properties = getObjectProperties(moduleExport);

  if (filterByIncludesTestsInHost(properties).length !== 0) {
    return root.toSource();
  }

  if (!hasStrictMode(programBody, j)) {
    const useStrictNode = j.expressionStatement(j.literal('use strict'));
    programBody.unshift(useStrictNode);
  }

  const includeTestsInHostObjProp = j.objectProperty(
    j.identifier('includeTestsInHost'),
    j.booleanLiteral(true)
  );

  properties.push(includeTestsInHostObjProp);
  return root.toSource({ quote: 'single' });
};
