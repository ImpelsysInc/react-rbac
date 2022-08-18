# RBAC

> RBAC based authentication

You build a nice looking website with authentication for a user and role associated with the user. 
Now you want the user to be authorized to access various resources across the application. 
You no longer need to worry any longer trying out various conditional statements with user's roles and resources they can
and cannot access.

With `ImpelsysInc/react-rbac`, you get more granular control of the resources with easy to use API. After the auth flow,
send a JSON with the response in the format [**`permission.schema.json`**](./permission.schema.json) to the frontend client code.

## Installation

```shell
npm install --save ImpelsysInc/react-rbac
```

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

Must be in one of the nested child component of `RBACProvider`.

#### Values

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
const { canAccess } = useRBACContext();
const { setPermissions, clearPermissions, permissions } = useRBACContext();
```

### `WithPermission` Higher Order Component

A useful component to wrap any other component which need fine-grained permissions.

#### Props

|     PropKey    |          Type          |      Defaults     |                                                Description                                               |
|:--------------:|:----------------------:|:-----------------:|:--------------------------------------------------------------------------------------------------------:|
| `children`     | `{ReactNode}`          |                   | ReactNode children components                                                                            |
| `type`         | `{string}`             | `[default=allow]` | Either `allow` or `deny` permissive type of the rule.                                                    |
| `action`       | `{string \| string[]}` |                   | The kind of action(s) allowed for the given resource e.g. "get", "get.all", "update", "update.all", etc. |
| `resource`     | `{string}`             |                   | The target resource of the rule e.g. "product.description", "product.*", "product", etc.                 |
| `resourceType` | `{string}`             | `[optional]`      | A meta field to specify the type of resource e.g. "menu", "page", "component", "*", etc.                 |
| `record`       | `{Object}`             | `[optional]`      | Context of the permission i.e. any extra metadata e.g. `{ userId: 1, groupId: 2 }`.                      |

<!--
(generated using https://www.tablesgenerator.com/markdown_tables)
-->

```tsx
<WithPermission resource="product.description" action="read">
  {children}
</WithPermission>
```

## Usage

### Using `useRBAC` hook

```tsx
import React, { ReactNode, FunctionComponent } from "react";
import { useRBAC, RBACProvider, useRBACContext } from "@impelsysinc/react-rbac";

const PrivateComponent: FunctionComponent<{ children: ReactNode }> = ({
  children,
}) => {
  const { canAccess } = useRBACContext();

  const canReadResource = canAccess({ resource: "resource", action: "read" });

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
      { action: "", resource: "" },
      { resource: "", action: ["", ""] },
      { resourceType: "", resource: "", action: ["", ""] },
    ];
    setPermissions(permissions);
  }, [setPermissions]);
};

const App: FunctionComponent<{ children: ReactNode }> = () => {
  const rbac = useRBAC();

  return (
    <RBACProvider value={rbac}>
      <Layout>
        <PrivateComponent>
          <h1>Will render if resource has read access.</h1>
        </PrivateComponent>
      </Layout>
    </RBACProvider>
  );
};
```

### Using `WithPermission` HOC

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
