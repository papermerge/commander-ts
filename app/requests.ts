import { BaseTreeNode } from "./types";

const HEADERS = {
  Authorization:
    'Token 0c724ad3d4101ba0b602c7fff44f4ff60c39e07d533c7eb7175c1b6d2efb47e3',
  'Content-type': 'application/vnd.api+json; charset=UTF-8',
};

const BASE_URL = 'http://127.0.0.1:8000/api';

export function rename_node(
  node: BaseTreeNode,
  new_title: string|null,
  abort_controller: AbortController
): Promise<Response> {
  return fetch(
    // PATCH <base URL>/documents/<node id>/
    // or
    // PATCH <base URL>/folders/<node id>/
    `${BASE_URL}/${node.nodeType}s/${node.id}/`,
    {
      headers: HEADERS,
      method: "PATCH",
      signal: abort_controller.signal,
      body: JSON.stringify({
        data: {
          id: node.id,
          type: `${node.nodeType}s`,
          attributes: {title: new_title}
        }
      })
    }
  );
}

export async function new_folder(
  parent_id: string,
  new_title: string|null,
  abort_controller: AbortController
): Promise<BaseTreeNode> {
  return fetch(
    // POST <base URL>/nodes/
    `${BASE_URL}/nodes/`,
    {
      headers: HEADERS,
      method: "POST",
      signal: abort_controller.signal,
      body: JSON.stringify({
        data: {
          type: 'folders',
          attributes: {
            title: new_title
          },
          relationships: {
            parent: {
              data: {
                type: 'folders',
                id: parent_id
              }
            }
          }
        }
      })
    }
  )
  .then(response => response.json())
  .then(response_json => {
    let node: BaseTreeNode;
    node = new BaseTreeNode(response_json.data);
    return node;
  });

}

