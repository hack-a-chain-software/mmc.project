/**
 * @generated SignedSource<<b70fad6a851d93cdffe69453dabe4951>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from "relay-runtime";
export type appGithubQuery$variables = {};
export type appGithubQuery$data = {
  readonly repository: {
    readonly name: string;
  } | null;
};
export type appGithubQuery = {
  response: appGithubQuery$data;
  variables: appGithubQuery$variables;
};

const node: ConcreteRequest = (function () {
  var v0 = [
      {
        kind: "Literal",
        name: "name",
        value: "maverick",
      },
      {
        kind: "Literal",
        name: "owner",
        value: "1Mateus",
      },
    ],
    v1 = {
      alias: null,
      args: null,
      kind: "ScalarField",
      name: "name",
      storageKey: null,
    };
  return {
    fragment: {
      argumentDefinitions: [],
      kind: "Fragment",
      metadata: null,
      name: "appGithubQuery",
      selections: [
        {
          alias: null,
          args: v0 /*: any*/,
          concreteType: "Repository",
          kind: "LinkedField",
          name: "repository",
          plural: false,
          selections: [v1 /*: any*/],
          storageKey: 'repository(name:"maverick",owner:"1Mateus")',
        },
      ],
      type: "Query",
      abstractKey: null,
    },
    kind: "Request",
    operation: {
      argumentDefinitions: [],
      kind: "Operation",
      name: "appGithubQuery",
      selections: [
        {
          alias: null,
          args: v0 /*: any*/,
          concreteType: "Repository",
          kind: "LinkedField",
          name: "repository",
          plural: false,
          selections: [
            v1 /*: any*/,
            {
              alias: null,
              args: null,
              kind: "ScalarField",
              name: "id",
              storageKey: null,
            },
          ],
          storageKey: 'repository(name:"maverick",owner:"1Mateus")',
        },
      ],
    },
    params: {
      cacheID: "c0d5635a72b8a67600ad6f46c522c857",
      id: null,
      metadata: {},
      name: "appGithubQuery",
      operationKind: "query",
      text: 'query appGithubQuery {\n  repository(owner: "1Mateus", name: "maverick") {\n    name\n    id\n  }\n}\n',
    },
  };
})();

(node as any).hash = "107df0388305f38e435c6963c42274a3";

export default node;
