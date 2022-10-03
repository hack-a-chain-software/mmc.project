/**
 * @generated SignedSource<<c277d30f855401030918bcc0152ea51e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from "relay-runtime";
export type appFacebokQuery$variables = {};
export type appFacebokQuery$data = {
  readonly repository: {
    readonly name: string;
  } | null;
};
export type appFacebokQuery = {
  response: appFacebokQuery$data;
  variables: appFacebokQuery$variables;
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
      name: "appFacebokQuery",
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
      name: "appFacebokQuery",
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
      cacheID: "60c964f5b4fe4b520315d081a2592336",
      id: null,
      metadata: {},
      name: "appFacebokQuery",
      operationKind: "query",
      text: 'query appFacebokQuery {\n  repository(owner: "1Mateus", name: "maverick") {\n    name\n    id\n  }\n}\n',
    },
  };
})();

(node as any).hash = "be6ffc8fbc783430c4b02986643f4673";

export default node;
