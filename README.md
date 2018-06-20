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