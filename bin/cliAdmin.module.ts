import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { getConnectionOptions } from 'typeorm'
import AdminUser from '../src/adminUser.entity'
import { AdminAuthModuleFactory } from 'src'

class AdminConnectionException extends Error {
  constructor(msg) {
    super(msg)
  }
}

@Module({
  imports: [AdminAuthModuleFactory.createAdminAuthModule({})],
})
export class CliAdminModule {
  static async getConnectionOptions() {
    try {
      return await getConnectionOptions()
    } catch (e) {
      throw new AdminConnectionException(
        `Could not connect to your database to create an admin user. Make sure you have an ormconfig file with a default connection or that your environment variables are set (see https://github.com/typeorm/typeorm/blob/master/docs/using-ormconfig.md).`,
      )
    }
  }

  static async create() {
    const connectionOptions = await this.getConnectionOptions()
    const entities = connectionOptions.entities || []

    return {
      module: CliAdminModule,
      imports: [
        TypeOrmModule.forRoot({
          ...connectionOptions,
          entities: [...entities, AdminUser],
        }),
        TypeOrmModule.forFeature([AdminUser]),
      ],
    }
  }
}
