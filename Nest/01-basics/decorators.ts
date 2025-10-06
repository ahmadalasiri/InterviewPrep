/**
 * Decorators in NestJS
 * 
 * Decorators are a fundamental feature in NestJS. They add metadata to classes,
 * methods, and properties, enabling dependency injection and other features.
 */

import {
  Controller,
  Injectable,
  Module,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Param,
  Query,
  Body,
  Headers,
  Request,
  Response,
  Session,
  Next,
  HttpCode,
  HttpStatus,
  Redirect,
  UseGuards,
  UseInterceptors,
  UsePipes,
  UseFilters,
  SetMetadata,
  Inject,
  Optional,
  Global,
  Catch,
} from '@nestjs/common';
import { createParamDecorator, ExecutionContext, applyDecorators } from '@nestjs/common';

// ============================================================================
// Class Decorators
// ============================================================================

// @Controller - Defines a controller class
@Controller('api/users')
export class UserController {
  // Methods here
}

// @Injectable - Marks a class as a provider
@Injectable()
export class UserService {
  // Service logic
}

// @Module - Defines a module
@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}

// @Global - Makes a module global
@Global()
@Module({
  providers: [UserService],
  exports: [UserService],
})
export class GlobalModule {}

// @Catch - Defines an exception filter
@Catch()
export class AllExceptionsFilter {
  // Filter logic
}

// ============================================================================
// Method Decorators (HTTP Methods)
// ============================================================================

@Controller('examples')
export class MethodDecoratorsController {
  @Get()
  getExample() {
    return 'GET request';
  }

  @Post()
  postExample() {
    return 'POST request';
  }

  @Put()
  putExample() {
    return 'PUT request';
  }

  @Delete()
  deleteExample() {
    return 'DELETE request';
  }

  @Patch()
  patchExample() {
    return 'PATCH request';
  }
}

// ============================================================================
// Method Decorators (HTTP Configuration)
// ============================================================================

@Controller('config')
export class ConfigDecoratorsController {
  // Set HTTP status code
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create() {
    return 'Created with 201 status';
  }

  // Redirect
  @Get('redirect')
  @Redirect('https://nestjs.com', 301)
  redirect() {
    // Redirects to NestJS website
  }

  // Use Guards
  @Get('protected')
  @UseGuards(AuthGuard)
  protected() {
    return 'Protected route';
  }

  // Use Interceptors
  @Get('logged')
  @UseInterceptors(LoggingInterceptor)
  logged() {
    return 'This request is logged';
  }

  // Use Pipes
  @Post('validated')
  @UsePipes(ValidationPipe)
  validated(@Body() data: any) {
    return 'Validated data';
  }

  // Use Filters
  @Get('filtered')
  @UseFilters(HttpExceptionFilter)
  filtered() {
    return 'Custom error handling';
  }

  // Set Metadata
  @Get('metadata')
  @SetMetadata('roles', ['admin'])
  withMetadata() {
    return 'Has metadata';
  }
}

// ============================================================================
// Parameter Decorators
// ============================================================================

@Controller('params')
export class ParameterDecoratorsController {
  // @Param - Route parameters
  @Get(':id')
  getById(@Param('id') id: string) {
    return { id };
  }

  // @Query - Query string parameters
  @Get()
  search(@Query('name') name: string, @Query('age') age: number) {
    return { name, age };
  }

  // @Body - Request body
  @Post()
  create(@Body() body: any) {
    return body;
  }

  // @Headers - Request headers
  @Get('headers')
  getHeaders(@Headers('authorization') auth: string) {
    return { authorization: auth };
  }

  // @Request/@Req - Full request object
  @Get('request')
  getRequest(@Request() req: any) {
    return {
      method: req.method,
      url: req.url,
      headers: req.headers,
    };
  }

  // @Response/@Res - Full response object
  @Get('response')
  getResponse(@Response() res: any) {
    res.status(200).json({ message: 'Custom response' });
  }

  // @Session - Session object
  @Get('session')
  getSession(@Session() session: any) {
    return session;
  }

  // @Next - Next function
  @Get('next')
  getNext(@Next() next: Function) {
    console.log('Before next');
    next();
  }
}

// ============================================================================
// Property Decorators
// ============================================================================

@Injectable()
export class PropertyDecoratorsService {
  // @Inject - Inject dependency by token
  @Inject('CONFIG')
  private config: any;

  // @Optional - Mark dependency as optional
  @Optional()
  @Inject('OPTIONAL_CONFIG')
  private optionalConfig?: any;

  getConfig() {
    return this.config;
  }
}

// ============================================================================
// Custom Parameter Decorator
// ============================================================================

// Extract user from request
export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);

@Controller('custom')
export class CustomDecoratorController {
  @Get('user')
  getUser(@User() user: any) {
    return user;
  }

  @Get('user-email')
  getUserEmail(@User('email') email: string) {
    return { email };
  }
}

// ============================================================================
// Custom Method Decorator
// ============================================================================

// Roles decorator
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

// Public decorator
export const Public = () => SetMetadata('isPublic', true);

// Timeout decorator
export const Timeout = (ms: number) => SetMetadata('timeout', ms);

@Controller('roles')
export class RolesController {
  @Get('admin')
  @Roles('admin')
  adminOnly() {
    return 'Admin only';
  }

  @Get('public')
  @Public()
  publicRoute() {
    return 'Public route';
  }

  @Get('slow')
  @Timeout(5000)
  slowRoute() {
    return 'Slow route with timeout';
  }
}

// ============================================================================
// Combining Decorators
// ============================================================================

export function Auth(...roles: string[]) {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(AuthGuard, RolesGuard),
    UseInterceptors(LoggingInterceptor),
  );
}

@Controller('combined')
export class CombinedDecoratorController {
  @Get('admin')
  @Auth('admin')
  adminRoute() {
    return 'Admin route with combined decorators';
  }
}

// ============================================================================
// API Documentation Decorators (Swagger)
// ============================================================================

import { ApiTags, ApiOperation, ApiResponse, ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'User email', example: 'user@example.com' })
  email: string;

  @ApiProperty({ description: 'User name', example: 'John Doe' })
  name: string;
}

@ApiTags('users')
@Controller('api/users')
export class SwaggerController {
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Return all users' })
  findAll() {
    return [];
  }

  @Post()
  @ApiOperation({ summary: 'Create a user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createUserDto: CreateUserDto) {
    return createUserDto;
  }
}

// ============================================================================
// Validation Decorators
// ============================================================================

import {
  IsString,
  IsEmail,
  IsInt,
  Min,
  Max,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsOptional,
  IsEnum,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
  GUEST = 'guest',
}

export class CreateUserValidatedDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(50)
  name: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsInt()
  @Min(18)
  @Max(100)
  @IsOptional()
  age?: number;

  @IsEnum(UserRole)
  role: UserRole;

  @IsArray()
  @IsString({ each: true })
  tags: string[];
}

export class CreateProfileDto {
  @IsString()
  bio: string;

  @ValidateNested()
  @Type(() => CreateAddressDto)
  address: CreateAddressDto;
}

export class CreateAddressDto {
  @IsString()
  street: string;

  @IsString()
  city: string;
}

// ============================================================================
// Decorator Factories
// ============================================================================

// Custom decorator factory for API response
export function ApiPaginatedResponse(model: any) {
  return applyDecorators(
    ApiResponse({
      status: 200,
      description: 'Paginated results',
      schema: {
        properties: {
          data: {
            type: 'array',
            items: { $ref: `#/components/schemas/${model.name}` },
          },
          meta: {
            type: 'object',
            properties: {
              total: { type: 'number' },
              page: { type: 'number' },
              limit: { type: 'number' },
            },
          },
        },
      },
    }),
  );
}

@Controller('paginated')
export class PaginatedController {
  @Get()
  @ApiPaginatedResponse(CreateUserDto)
  findAll() {
    return {
      data: [],
      meta: { total: 0, page: 1, limit: 10 },
    };
  }
}

// ============================================================================
// Mock Implementations for Examples
// ============================================================================

class AuthGuard {}
class RolesGuard {}
class LoggingInterceptor {}
class ValidationPipe {}
class HttpExceptionFilter {}

// ============================================================================
// Summary of Common Decorators
// ============================================================================

/**
 * Class Decorators:
 * - @Controller(prefix?) - Define controller
 * - @Injectable() - Define provider
 * - @Module(options) - Define module
 * - @Global() - Make module global
 * - @Catch(exception?) - Define exception filter
 * 
 * Method Decorators:
 * - @Get(path?) - HTTP GET
 * - @Post(path?) - HTTP POST
 * - @Put(path?) - HTTP PUT
 * - @Delete(path?) - HTTP DELETE
 * - @Patch(path?) - HTTP PATCH
 * - @HttpCode(code) - Set status code
 * - @Redirect(url, statusCode?) - Redirect
 * - @UseGuards(...guards) - Apply guards
 * - @UseInterceptors(...interceptors) - Apply interceptors
 * - @UsePipes(...pipes) - Apply pipes
 * - @UseFilters(...filters) - Apply filters
 * - @SetMetadata(key, value) - Set metadata
 * 
 * Parameter Decorators:
 * - @Param(key?) - Route parameter
 * - @Query(key?) - Query parameter
 * - @Body(key?) - Request body
 * - @Headers(name?) - Request headers
 * - @Request/@Req() - Request object
 * - @Response/@Res() - Response object
 * - @Session() - Session object
 * - @Next() - Next function
 * 
 * Property Decorators:
 * - @Inject(token) - Inject dependency
 * - @Optional() - Optional dependency
 * 
 * Validation Decorators:
 * - @IsString(), @IsNumber(), @IsBoolean()
 * - @IsEmail(), @IsUrl()
 * - @IsNotEmpty(), @IsOptional()
 * - @Min(value), @Max(value)
 * - @MinLength(value), @MaxLength(value)
 * - @IsArray(), @IsEnum(entity)
 * - @ValidateNested()
 */

// Export all examples
export {
  UserController,
  UserService,
  UserModule,
  GlobalModule,
  AllExceptionsFilter,
  MethodDecoratorsController,
  ConfigDecoratorsController,
  ParameterDecoratorsController,
  PropertyDecoratorsService,
  CustomDecoratorController,
  RolesController,
  CombinedDecoratorController,
  SwaggerController,
  CreateUserDto,
  CreateUserValidatedDto,
  PaginatedController,
};


