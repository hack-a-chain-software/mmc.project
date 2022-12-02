import {
  Environment,
  Network,
  Observable,
  RecordSource,
  Store,
} from "relay-runtime";

async function fetchGraphQL(text, variables) {
  const REACT_APP_GITHUB_AUTH_TOKEN = import.meta.env
    .VITE_REACT_APP_GITHUB_AUTH_TOKEN;

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `bearer ${REACT_APP_GITHUB_AUTH_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: text,
      variables,
    }),
  });

  return await response.json();
}

export const RelayEnvironment = new Environment({
  network: Network.create((params: any, variables: any) =>
    Observable.create((sink) => {
      fetchGraphQL(params.text, variables).then((payload) => {
        sink.next(payload);
        sink.complete();
      });
    }),
  ),
  store: new Store(new RecordSource()),
});
