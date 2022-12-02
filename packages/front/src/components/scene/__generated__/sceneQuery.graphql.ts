/**
 * @generated SignedSource<<eab068f5acb14a78fb748cc4d88e192f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type sceneQuery$variables = {
  name: string;
  owner: string;
};
export type sceneQuery$data = {
  readonly repository: {
    readonly id: string;
    readonly name: string;
  } | null;
};
export type sceneQuery = {
  response: sceneQuery$data;
  variables: sceneQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "name"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "owner"
},
v2 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "name",
        "variableName": "name"
      },
      {
        "kind": "Variable",
        "name": "owner",
        "variableName": "owner"
      }
    ],
    "concreteType": "Repository",
    "kind": "LinkedField",
    "name": "repository",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "name",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "sceneQuery",
    "selections": (v2/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "sceneQuery",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "a61d83b62b46be4b15fce0492c240ef7",
    "id": null,
    "metadata": {},
    "name": "sceneQuery",
    "operationKind": "query",
    "text": "query sceneQuery(\n  $owner: String!\n  $name: String!\n) {\n  repository(owner: $owner, name: $name) {\n    name\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "94ab149095b4a77673a78f6a39d7d3bb";

export default node;
