## Registering entities on the admin site

There are two ways you can display an entity on the admin site using `DefaultAdminSite.register`.

In both cases, the first parameter defines the name of the section on the admin site where the entity is registered.

#### 1. Registering entities directly

Registering an entity directly will use the default [configuration options](./adminentity-options), and is good enough for most cases.

```typescript
// user.module.ts
import { DefaultAdminSite } from 'nestjs-admin'
import { User } from './user.entity'
import { Group } from './group.entity'

@Module({...})
export class UserModule {
  constructor(private readonly adminSite: DefaultAdminSite) {
    adminSite.register('User', User)
    adminSite.register('User', Group)
    ...
  }
}
```

#### 2. Registering entities using the `AdminEntity` class

If you want to add some [configuration options](./adminentity-options), you will need to extend the `AdminEntity` class.

The only required property is `entity` which needs to be [typeorm entity](https://github.com/typeorm/typeorm/blob/master/docs/entities.md) class.

```typescript
// user.admin.ts
import { AdminEntity, DefaultAdminSite } from 'nestjs-admin'
import { User } from './user.entity'
import { Group } from './group.entity'

export class UserAdmin extends AdminEntity {
  entity = User
  // Configuration options go here
}

// user.module.ts
@Module({...})
export class UserModule {
  constructor(private readonly adminSite: DefaultAdminSite) {
    adminSite.register('User', UserAdmin)
    adminSite.register('User', Group)
    ...
  }
}
```

See the supported options [here](./adminentity-options).