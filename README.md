# RBAC

> RBAC based authentication

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
