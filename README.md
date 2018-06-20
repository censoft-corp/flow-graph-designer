# flow-graph-designer
A react component that make flow graph by drag & drop.

## useage

**install:**

```
npm install flow-graph-designer
```

**use:**

```
import React from 'react';
import getFlowDesignerComponent from 'flow-graph-designer'
const FlowDesignerComponent = getFlowDesignerComponent({lang: 'zh_CN'});

const template={...}    // should show the structor a few days later :)
...
React.render(
  document.getElementById('app'),
  <FlowDesignerComponent
    data={{id: 'root', children: []}},
    template={template}
  />
)
```

## develop

**clone**
```
git clone https://github.com/censoft-corp/flow-graph-designer.git
```

**init**
```
yarn
```

or 

```
npm install
```

**start**
```
yarn run start
```

or 

```
npm run start
```

**watch demo**
there is a playground site.The url is  http://localhost:8080/

## publish

run once
```
npm login
...
```

everytime:
```
npm run publish-to-npm
```
