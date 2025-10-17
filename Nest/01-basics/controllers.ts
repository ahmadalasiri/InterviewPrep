/**
 * Controllers in NestJS
 * 
 * Controllers handle incoming requests and return responses to the client.
 * They are responsible for routing and handling HTTP requests.
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Patch,
  Param,
  Query,
  Body,
  Headers,
  HttpCode,
  HttpStatus,
  Redirect,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';

// ============================================================================
// Basic Controller
// ============================================================================

@Controller('users')  // Route prefix: /users
export class UsersController {
  // GET /users
  @Get()
  findAll(): string {
    return 'This returns all users';
  }

  // GET /users/:id
  @Get(':id')
  findOne(@Param('id') id: string): string {
    return `This returns user #${id}`;
  }

  // POST /users
  @Post()
  create(@Body() body: any): string {
    return 'This creates a user';
  }

  // PUT /users/:id
  @Put(':id')
  update(@Param('id') id: string, @Body() body: any): string {
    return `This updates user #${id}`;
  }

  // DELETE /users/:id
  @Delete(':id')
  remove(@Param('id') id: string): string {
    return `This deletes user #${id}`;
  }

  // PATCH /users/:id
  @Patch(':id')
  partialUpdate(@Param('id') id: string, @Body() body: any): string {
    return `This partially updates user #${id}`;
  }
}

// ============================================================================
// Request Parameters
// ============================================================================

@Controller('examples')
export class ExamplesController {
  // Route parameters: /examples/123
  @Get(':id')
  getById(@Param('id') id: string) {
    return { id };
  }

  // Multiple route parameters: /examples/users/123/posts/456
  @Get('users/:userId/posts/:postId')
  getUserPost(
    @Param('userId') userId: string,
    @Param('postId') postId: string,
  ) {
    return { userId, postId };
  }

  // All params as object
  @Get('all/:id')
  getAllParams(@Param() params: any) {
    return params;
  }

  // Query parameters: /examples/search?name=john&age=30
  @Get('search')
  search(
    @Query('name') name: string,
    @Query('age') age: number,
  ) {
    return { name, age };
  }

  // All query params as object
  @Get('search-all')
  searchAll(@Query() query: any) {
    return query;
  }

  // Request body
  @Post('create')
  createWithBody(@Body() body: any) {
    return body;
  }

  // Specific body field
  @Post('create-specific')
  createSpecific(
    @Body('name') name: string,
    @Body('email') email: string,
  ) {
    return { name, email };
  }

  // Headers
  @Get('headers')
  getHeaders(@Headers('authorization') auth: string) {
    return { authorization: auth };
  }

  // All headers
  @Get('all-headers')
  getAllHeaders(@Headers() headers: any) {
    return headers;
  }
}

// ============================================================================
// HTTP Status Codes
// ============================================================================

@Controller('status')
export class StatusController {
  // Default: 200 for GET, 201 for POST
  @Get('default')
  getDefault() {
    return { message: 'Status: 200' };
  }

  // Custom status code
  @Post('custom')
  @HttpCode(HttpStatus.CREATED)
  createCustom() {
    return { message: 'Status: 201' };
  }

  // No content
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    // Returns 204 No Content
  }

  // Accepted
  @Post('async')
  @HttpCode(HttpStatus.ACCEPTED)
  asyncOperation() {
    return { message: 'Accepted for processing' };
  }
}

// ============================================================================
// Redirects
// ============================================================================

@Controller('redirect')
export class RedirectController {
  // Static redirect
  @Get('docs')
  @Redirect('https://docs.nestjs.com', 301)
  getDocs() {
    // Redirects to documentation
  }

  // Dynamic redirect
  @Get('version/:version')
  @Redirect()
  getVersion(@Param('version') version: string) {
    if (version === 'latest') {
      return { url: 'https://docs.nestjs.com/v10' };
    }
    return { url: `https://docs.nestjs.com/${version}` };
  }
}

// ============================================================================
// Async Controllers
// ============================================================================

@Controller('async')
export class AsyncController {
  // Promise-based
  @Get('promise')
  async getPromise(): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: 'Async data' });
      }, 1000);
    });
  }

  // Async/await
  @Get('await')
  async getAwait(): Promise<any> {
    await this.delay(1000);
    return { data: 'Async await data' };
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// ============================================================================
// Sub-domain Routing
// ============================================================================

@Controller({ host: 'admin.example.com' })
export class AdminController {
  @Get()
  getAdmin() {
    return 'Admin panel';
  }
}

// Dynamic sub-domain
@Controller({ host: ':account.example.com' })
export class AccountController {
  @Get()
  getAccount(@Param('account') account: string) {
    return { account };
  }
}

// ============================================================================
// Complete CRUD Example
// ============================================================================

interface User {
  id: number;
  name: string;
  email: string;
}

@Controller('api/users')
export class UsersApiController {
  private users: User[] = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  ];

  @Get()
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): User[] {
    const start = (page - 1) * limit;
    const end = start + limit;
    return this.users.slice(start, end);
  }

  @Get(':id')
  findOne(@Param('id') id: string): User {
    return this.users.find((user) => user.id === parseInt(id));
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() user: Omit<User, 'id'>): User {
    const newUser = {
      id: this.users.length + 1,
      ...user,
    };
    this.users.push(newUser);
    return newUser;
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() user: Partial<User>): User {
    const index = this.users.findIndex((u) => u.id === parseInt(id));
    if (index !== -1) {
      this.users[index] = { ...this.users[index], ...user };
      return this.users[index];
    }
    return null;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): void {
    const index = this.users.findIndex((u) => u.id === parseInt(id));
    if (index !== -1) {
      this.users.splice(index, 1);
    }
  }
}

// ============================================================================
// Export all controllers
// ============================================================================

export {
  UsersController,
  ExamplesController,
  StatusController,
  RedirectController,
  AsyncController,
  AdminController,
  AccountController,
  UsersApiController,
};






