import { TypeOrmModule } from '@nestjs/typeorm'
import { Module } from '@nestjs/common'
import AdminUserEntity from './adminUser.entity'
import { LocalStrategy } from './local.strategy'
import { AdminUserController } from './adminUser.controller'
import { AdminCoreModuleFactory } from './adminCore.module'
import { injectionTokens } from './tokens'
import AdminUser from './adminUser.entity'
import { AdminUserService } from './adminUser.service'

const defaultCoreModule = AdminCoreModuleFactory.createAdminCoreModule({})

export type CredentialValidator = (
  email: string,
  pass: string,
) => object | null | Promise<object | null>

export interface CredentialValidatorProvider {
  imports?: any[]
  useFactory: (dep: any) => CredentialValidator
  inject?: any[]
}

export const AdminUserCredentialValidator = {
  imports: [TypeOrmModule.forFeature([AdminUser])],
  useFactory: (adminUserService: AdminUserService) => {
    return adminUserService.validateAdminCredentials.bind(adminUserService)
  },
  inject: [AdminUserService],
}

interface AdminAuthModuleConfig {
  adminCoreModule: any
  credentialValidator: CredentialValidatorProvider
}

@Module({
  imports: [TypeOrmModule.forFeature([AdminUserEntity])],
  providers: [LocalStrategy],
  controllers: [AdminUserController],
})
export class AdminAuthModuleFactory {
  static createAdminAuthModule({
    adminCoreModule = defaultCoreModule,
    credentialValidator = AdminUserCredentialValidator,
  }: Partial<AdminAuthModuleConfig>) {
    const credentialValidatorProvider = {
      provide: injectionTokens.ADMIN_AUTH_CREDENTIAL_VALIDATOR,
      useFactory: credentialValidator.useFactory,
      inject: credentialValidator.inject,
    }
    return {
      module: AdminAuthModuleFactory,
      imports: [adminCoreModule, ...(credentialValidator.imports || [])],
      exports: [credentialValidatorProvider],
      providers: [credentialValidatorProvider, AdminUserService],
    }
  }
}
