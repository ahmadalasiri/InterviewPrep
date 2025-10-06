/**
 * Modules in NestJS
 * 
 * Modules are used to organize the application structure. Each module
 * encapsulates a set of related capabilities (controllers, providers, etc.)
 */

import { Module, Global, DynamicModule } from '@nestjs/common';
import { UsersController } from './controllers';
import { UsersService, LoggerService, PostsService } from './providers';

// ============================================================================
// Basic Module
// ============================================================================

@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}

// ============================================================================
// Module with Imports and Exports
// ============================================================================

@Module({
  providers: [LoggerService],
  exports: [LoggerService], // Make available to other modules
})
export class LoggerModule {}

@Module({
  imports: [LoggerModule], // Import LoggerModule
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Export for other modules
})
export class UsersModuleWithDeps {}

// ============================================================================
// Module with Multiple Dependencies
// ============================================================================

@Module({
  imports: [UsersModuleWithDeps, LoggerModule],
  controllers: [],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}

// ============================================================================
// Global Module
// ============================================================================

@Global() // Makes providers available globally
@Module({
  providers: [LoggerService],
  exports: [LoggerService],
})
export class GlobalLoggerModule {}

// ============================================================================
// Dynamic Module
// ============================================================================

interface ConfigModuleOptions {
  folder: string;
  isGlobal?: boolean;
}

@Module({})
export class ConfigModule {
  // Static method to create dynamic module
  static forRoot(options: ConfigModuleOptions): DynamicModule {
    return {
      module: ConfigModule,
      global: options.isGlobal ?? false,
      providers: [
        {
          provide: 'CONFIG_OPTIONS',
          useValue: options,
        },
        {
          provide: 'CONFIG_SERVICE',
          useFactory: (configOptions: ConfigModuleOptions) => {
            return {
              get: (key: string) => {
                // Load config from folder
                return `Value from ${configOptions.folder}/${key}`;
              },
            };
          },
          inject: ['CONFIG_OPTIONS'],
        },
      ],
      exports: ['CONFIG_SERVICE'],
    };
  }

  // Async configuration
  static forRootAsync(options: {
    useFactory: (...args: any[]) => Promise<ConfigModuleOptions>;
    inject?: any[];
  }): DynamicModule {
    return {
      module: ConfigModule,
      providers: [
        {
          provide: 'CONFIG_OPTIONS',
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
        {
          provide: 'CONFIG_SERVICE',
          useFactory: (configOptions: ConfigModuleOptions) => {
            return {
              get: (key: string) => {
                return `Value from ${configOptions.folder}/${key}`;
              },
            };
          },
          inject: ['CONFIG_OPTIONS'],
        },
      ],
      exports: ['CONFIG_SERVICE'],
    };
  }
}

// ============================================================================
// Feature Module Pattern
// ============================================================================

@Module({
  imports: [LoggerModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersFeatureModule {}

// ============================================================================
// Shared Module Pattern
// ============================================================================

@Module({
  providers: [
    LoggerService,
    {
      provide: 'SHARED_CONFIG',
      useValue: {
        apiUrl: 'https://api.example.com',
        timeout: 5000,
      },
    },
  ],
  exports: [LoggerService, 'SHARED_CONFIG'],
})
export class SharedModule {}

// ============================================================================
// Core Module Pattern (Application-wide services)
// ============================================================================

@Global()
@Module({
  providers: [
    {
      provide: 'APP_CONFIG',
      useValue: {
        appName: 'My NestJS App',
        version: '1.0.0',
      },
    },
    LoggerService,
  ],
  exports: ['APP_CONFIG', LoggerService],
})
export class CoreModule {}

// ============================================================================
// Root Module (Application Entry Point)
// ============================================================================

@Module({
  imports: [
    CoreModule,
    SharedModule,
    UsersModule,
    PostsModule,
    // Dynamic module usage
    ConfigModule.forRoot({
      folder: './config',
      isGlobal: true,
    }),
  ],
})
export class AppModule {}

// ============================================================================
// Module with Custom Providers
// ============================================================================

@Module({
  providers: [
    // Class provider (default)
    UsersService,
    
    // Value provider
    {
      provide: 'API_KEY',
      useValue: 'your-api-key-here',
    },
    
    // Factory provider
    {
      provide: 'DATABASE_CONNECTION',
      useFactory: async () => {
        // Simulate async connection
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return {
          host: 'localhost',
          port: 5432,
          database: 'mydb',
        };
      },
    },
    
    // Factory with dependencies
    {
      provide: 'USER_REPOSITORY',
      useFactory: (connection: any) => {
        return {
          find: () => connection.query('SELECT * FROM users'),
        };
      },
      inject: ['DATABASE_CONNECTION'],
    },
    
    // Existing provider (alias)
    {
      provide: 'LOGGER_ALIAS',
      useExisting: LoggerService,
    },
  ],
  exports: [
    UsersService,
    'API_KEY',
    'DATABASE_CONNECTION',
    'USER_REPOSITORY',
  ],
})
export class DatabaseModule {}

// ============================================================================
// Module Organization Best Practices
// ============================================================================

/**
 * Recommended folder structure:
 * 
 * src/
 * ├── modules/
 * │   ├── users/
 * │   │   ├── dto/
 * │   │   ├── entities/
 * │   │   ├── users.controller.ts
 * │   │   ├── users.service.ts
 * │   │   └── users.module.ts
 * │   ├── posts/
 * │   └── auth/
 * ├── common/
 * │   ├── decorators/
 * │   ├── filters/
 * │   ├── guards/
 * │   └── interceptors/
 * ├── config/
 * ├── app.module.ts
 * └── main.ts
 */

// ============================================================================
// Lazy Loading Modules
// ============================================================================

@Module({
  imports: [], // Modules are loaded on-demand
})
export class LazyModule {
  // This module can be loaded dynamically when needed
}

// ============================================================================
// Module with Lifecycle Hooks
// ============================================================================

import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';

@Module({
  providers: [UsersService],
})
export class UsersModuleWithHooks implements OnModuleInit, OnModuleDestroy {
  onModuleInit() {
    console.log('UsersModule initialized');
  }

  onModuleDestroy() {
    console.log('UsersModule destroyed');
  }
}

// ============================================================================
// Export all modules
// ============================================================================

export {
  UsersModule,
  UsersModuleWithDeps,
  LoggerModule,
  PostsModule,
  GlobalLoggerModule,
  ConfigModule,
  UsersFeatureModule,
  SharedModule,
  CoreModule,
  AppModule,
  DatabaseModule,
  LazyModule,
  UsersModuleWithHooks,
};


