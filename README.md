# React RBAC

> Short for **Role Based Access Control**, a type of authorization.

RBAC is a type of authorization of resources to user based on role of the user. 
Each role might have various attributes associated with them which **allow or deny** a certain **resource** on which they want to perform some **action**.

**Resource** is defined as the entity viz. a component (e.g. `action.download` or `dashboard.project.list`), a page (e.g. `dashboard` or `user_management`), etc. that the user want access to.

**Action** is defined as the type of operation (viz. `VIEW`, `GET`, `UPDATE`, `DELETE`) that the user want to perform on the given **`resource`**.

The permission rule is either `allow` or `deny` **type**.

**Resource Type** is optional meaning the type of resource (viz. `component`, `page`, `api`, `data`, etc.) that the user want to access. 
If provided, it will be considered while evaluating the permission rule.

---

You build a nice looking website with authentication for a user and role associated with the user. 
Now you want the user to be authorized to access various resources across the application. 
You no longer need to worry any longer trying out various conditional statements with user's roles and resources they can
and cannot access.

With `ImpelsysInc/react-rbac`, you get more granular control of the resources with easy to use API. After the auth flow,
send a JSON with the response in the format [**`permission.schema.json`**](./permission.schema.json) to the frontend client code.

### Example Permission JSON
```json5
[
  {
    "resource": "cart",
    "action": "update.all"
  },
  {
    "type": "deny",
    "resource": "adminPanel",
    "action": [
      "get.all",
      "update"
    ]
  },
  {
    "resourceType": "component",
    "resource": "users.all",
    "action": [
      "get",
      "create"
    ]
  }
]
```

> You may use https://json-schema-faker.js.org/ to generate sample data for the schema.
In website options, select `useExamplesValue` and click on "Generate" multiple times to generate sample data.

> You may use https://www.jsonschemavalidator.net/ to validate the schema.

## Installation

```shell
npm install --save @impelsysinc/react-rbac
```

## Usage

The API exposes a [**`useRBAC`**](#userbac-hook) hook which optionally takes **default permissions**.
Or you can `setPermissions` from [**`useRBACContext`**](#userbaccontext-context) hook.
See example [**`Using useRBAC hook`**](#userbaccontext-context).

### Using `useRBAC` hook

<details>
<summary><code>useRBAC</code> hook returns useful methods which can be retrieved from <code>RBACContext</code> in any nested components (<u><em>click and open accordion to see usage</em></u>)</summary>

```tsx
import { FunctionComponent, ReactNode, useEffect } from "react";
import {
  useRBAC,
  RBACProvider,
  useRBACContext,
  WithPermission
} from "@impelsysinc/react-rbac";

const PrivateComponent: FunctionComponent<{ children: ReactNode }> = ({
  children
}) => {
  const { canAccess } = useRBACContext();

  const canReadResource = canAccess({
    resource: "adminPanel",
    action: "get.all"
  });

  if (canReadResource) {
    return <div>{children}</div>;
  }

  return null;
};

const Layout: FunctionComponent<{ children: ReactNode }> = ({ children }) => {
  const { setPermissions } = useRBACContext();

  useEffect(() => {
    const permissions = [
      /* FETCH PERMISSIONS */
      { resource: "cart", action: "update.all" },
      { resource: "adminPanel", action: ["get.all", "update"] },
      {
        resourceType: "component",
        resource: "users.all",
        action: ["get", "create"]
      }
    ];
    setPermissions(permissions);
  }, [setPermissions]);

  return <>{children}</>;
};

export function App() {
  const rbac = useRBAC();

  return (
    <RBACProvider rbac={rbac}>
      <Layout>
        <PrivateComponent>
          <h1>
            <code>PrivateComponent</code> will render if resource has read access.
          </h1>
        </PrivateComponent>

        <WithPermission resource="adminPanel" action="get.all">
          <h1>
            <code>WithPermission</code> will render if resource has read access.
          </h1>
        </WithPermission>
      </Layout>
    </RBACProvider>
  );
}

export default App;

```

<div align="right">
    <b><a href="https://codesandbox.io/s/react-rbac-demo1-z0200l?file=/src/App.tsx:0-1591">▶ Code Sandbox</a></b>
</div>

</details>

### Using `WithPermission` HOC

<details>
<summary><code>WithPermission</code> HOC is a ready-made component to pass the required access privileges (<u><em>click and open accordion to see usage</em></u>)</summary>

```tsx
import React, { ReactNode, FunctionComponent } from "react";
import { WithPermission, useRBAC, RBACProvider } from "@impelsysinc/react-rbac";

const App: FunctionComponent<{ children: ReactNode }> = () => {
  const rbac = useRBAC();

  return (
    <RBACProvider value={rbac}>
      <WithPermission resource="resource" action="read">
        <h1>Will render if resource has read access.</h1>
      </WithPermission>
    </RBACProvider>
  );
};
```

</details>

## API

### `useRBAC` Hook

Get a `rbac` context to pass it to `RBACProvider`.

### `RBACProvider` Context Provider

```tsx
const rbac = useRBAC();

<RBACProvider value={rbac}>
  {children}
</RBACProvider>
```

### `useRBACContext` Context

Must be in one of the nested child component of [**`RBACProvider`**](#userbaccontext-context).

#### Return Values

| Value                | Type                      | Description                                                            |
|----------------------|---------------------------|------------------------------------------------------------------------|
| `loadingPermissions` | `{boolean}`               | Async load permission.                                                 |
| `permissions`        | `{Permission}`            | List of permissions.                                                   |
| `permissionError`    | `{Error}`                 | Any errors while fetching permissions.                                 |
| `setPermissions`     | `(Permission[]) => void`  | Manually set the permissions.                                          |
| `clearPermissions`   | `{() => void}`            | Clear all permissions from state.                                      |
| `canAccess`          | `{permission => boolean}` | Is a rule valid i.e. a resource accessible for the loaded permissions. |

<!--
(generated using https://www.tablesgenerator.com/markdown_tables)
-->

```tsx
// Example 1
const { canAccess } = useRBACContext();

// Example 2
const { setPermissions, clearPermissions, permissions } = useRBACContext();
```

### `WithPermission` Higher Order Component

A useful component to wrap any other component which need fine-grained permissions.

#### Props

|    PropKey     |                Type                |     Defaults      |                                               Description                                                |
|:--------------:|:----------------------------------:|:-----------------:|:--------------------------------------------------------------------------------------------------------:|
|   `children`   |           `{ReactNode}`            |                   |                                      ReactNode children components                                       |
|     `type`     |             `{string}`             | `[default=allow]` |                          Either `allow` or `deny` permissive type of the rule.                           |
|    `action`    | `{string &VerticalLine; string[]}` |                   | The kind of action(s) allowed for the given resource e.g. "get", "get.all", "update", "update.all", etc. |
|   `resource`   |             `{string}`             |                   |         The target resource of the rule e.g. "product.description", "product.*", "product", etc.         |
| `resourceType` |             `{string}`             |   `[optional]`    |         A meta field to specify the type of resource e.g. "menu", "page", "component", "*", etc.         |
|    `record`    |             `{Object}`             |   `[optional]`    |           Context of the permission i.e. any extra metadata e.g. `{ userId: 1, groupId: 2 }`.            |

<!--
(generated using https://www.tablesgenerator.com/markdown_tables)
-->

```tsx
<WithPermission resource="product.description" action="read">
  {children}
</WithPermission>
```

## TODO

- Support for multiple resources in permissions array.
- Support for DENY permissions.
- Support for resource wildcards.


## Contribute
See [Contribute.md](./contribute.md)

## Contributors
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->

<table>
    <!-- Abhisek - start -->
    <tr>
        <td align="center">
            <a href="https://about.me/abhisekp">
                <img src="https://avatars.githubusercontent.com/u/1029200?v=4?s=100" width="100px;" alt="" /><br />
                <sub><b>Abhisek Pattnaik</b></sub>
            </a>
            <br />
            <a href="#ideas-abhisekp" title="Ideas & Planning">🤔</a>
            <a href="https://github.com/all-contributors/all-contributors/commits?author=abhisekp-impeller" title="Code">💻</a>
            <a href="https://github.com/all-contributors/all-contributors/pulls?q=is%3Apr+reviewed-by%3Aabhisekp-impeller" title="Reviewed Pull Requests">👀</a>
            <a href="#bug-abhisekp" title="Bug Reports">🐛</a>
            <a href="#maintenance-abhisekp" title="Maintenance">🚧</a>
            <a href="#tutorial-abhisekp" title="Tutorials">✅</a>
            <a href="#question-abhisekp" title="Answering Questions">💬</a>
            <a href="#talk-abhisekp" title="Talks">📢</a>
        </td>
    </tr>
    <!-- Abhisek - end -->

</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

This project follows the [all-contributors](https://allcontributors.org) specification.  
Contributions of any kind are welcome!  
See [contribute.md](./contribute.md) for more information.

## License

MIT © [Impelsys India Pvt. Ltd.](https://www.impelsys.com/)
