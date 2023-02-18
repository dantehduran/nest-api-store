import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../src/prisma/prisma.service';
import { AppModule } from '../src/app.module';
import * as pactum from 'pactum';
import { AuthDto } from '../src/auth/dto';
import { EditDto } from '../src/user/dto';
import { CreateProductDto, EditProductDto } from 'src/product/dto';
import { CreateCategoryDto } from 'src/category/dto';
describe('App e2e test', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
    await app.listen(3333);
    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl('http://localhost:3333');
  });
  afterAll(async () => {
    app.close();
  });
  describe('Auth', () => {
    const dto: AuthDto = { email: 'test@test.com', password: 'test' };
    describe('Signup', () => {
      it('should throw if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ password: dto.password })
          .expectStatus(400);
      });
      it('should throw if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({ email: dto.email })
          .expectStatus(400);
      });
      it('should throw if no body provided', () => {
        return pactum.spec().post('/auth/signup').expectStatus(400);
      });
      it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
    });
    describe('Signin', () => {
      it('should throw if email is empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ password: dto.password })
          .expectStatus(400);
      });
      it('should throw if password is empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({ email: dto.email })
          .expectStatus(400);
      });
      it('should throw if no body provided', () => {
        return pactum.spec().post('/auth/signin').expectStatus(400);
      });
      it('should signin', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAccessToken', 'access_token');
      });
    });
  });
  describe('User', () => {
    describe('Get me', () => {
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .expectStatus(200);
      });
    });
    describe('Edit user by id', () => {
      it('should edit user', () => {
        const dto: EditDto = {
          firstName: 'test edited',
          email: 'testedited@test.com',
        };
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.firstName)
          .expectBodyContains(dto.email);
      });
    });
  });
  describe('Categories', () => {
    describe('Get empty categories', () => {
      it('should get empty categories', () => {
        return pactum
          .spec()
          .get('/categories')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .expectStatus(200)
          .expectBody([]);
      });
    });
    describe('Create category', () => {
      const dto: CreateCategoryDto = {
        name: 'test category',
      };
      it('should create category', () => {
        return pactum
          .spec()
          .post('/categories')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .withBody(dto)
          .expectStatus(201)
          .expectBodyContains(dto.name)
          .stores('categoryId', 'id');
      });
    });
    describe('Get categories', () => {
      it('should get categories', () => {
        return pactum
          .spec()
          .get('/categories')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .expectStatus(200)
          .expectJsonLength(1);
      });
    });
    describe('Get category by id', () => {
      it('should get category by id', () => {
        return pactum
          .spec()
          .get('/categories/{id}')
          .withPathParams('id', '$S{categoryId}')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .expectStatus(200);
      });
    });
    describe('Edit category by id', () => {
      const dto: CreateCategoryDto = {
        name: 'category edited',
      };
      it('should edit category by id', () => {
        return pactum
          .spec()
          .patch('/categories/{id}')
          .withPathParams('id', '$S{categoryId}')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.name);
      });
    });
  });
  describe('Products', () => {
    describe('Get empty products', () => {
      it('should get empty products', () => {
        return pactum
          .spec()
          .get('/products')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .expectStatus(200)
          .expectBody([]);
      });
    });
    describe('Create product', () => {
      const dto: CreateProductDto = {
        name: 'test product',
        price: '100.5',
      };
      it('should create product', () => {
        return pactum
          .spec()
          .post('/products')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .withBody(dto)
          .expectStatus(201)
          .expectBodyContains(dto.name)
          .expectBodyContains(dto.price)
          .stores('productId', 'id')
          .inspect();
      });
    });
    describe('Get products', () => {
      it('should get products', () => {
        return pactum
          .spec()
          .get('/products')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .expectStatus(200)
          .expectJsonLength(1);
      });
    });
    describe('Get product by id', () => {
      it('should get product by id', () => {
        return pactum
          .spec()
          .get('/products/{id}')
          .withPathParams('id', '$S{productId}')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .expectStatus(200);
      });
    });
    describe('Edit product by id', () => {
      const dto: EditProductDto = {
        name: 'test product edited',
        price: '10.5',
      };
      it('should edit product by id', () => {
        return pactum
          .spec()
          .patch('/products/{id}')
          .withPathParams('id', '$S{productId}')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.name)
          .expectBodyContains(dto.price);
      });
    });
    describe('Connect a product to a category', () => {
      const productDto: CreateProductDto = {
        name: 'product with category',
        price: '123.5',
      };
      it('should connect a product to a category', () => {
        return pactum
          .spec()
          .post('/products')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .withBody({ ...productDto, categories: ['$S{categoryId}'] })
          .expectStatus(201)
          .stores('productId2', 'id');
      });
      it('should get product with category', () => {
        return pactum
          .spec()
          .get('/products/{id}')
          .withPathParams('id', '$S{productId2}')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .expectStatus(200);
      });
    });
  });
  describe('Delete Product and Category', () => {
    describe('Delete product by id', () => {
      it('should delete product by id', () => {
        return pactum
          .spec()
          .delete('/products/{id}')
          .withPathParams('id', '$S{productId}')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .expectStatus(204);
      });
      it('should get empty products', () => {
        return pactum
          .spec()
          .get('/products')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .expectStatus(200)
          .expectJsonLength(1) //was created a product without category
          .inspect();
      });
    });
    describe('Delete category by id', () => {
      it('should delete category by id', () => {
        return pactum
          .spec()
          .delete('/categories/{id}')
          .withPathParams('id', '$S{categoryId}')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .expectStatus(204);
      });
      it('should get empty categories', () => {
        return pactum
          .spec()
          .get('/categories')
          .withHeaders({ Authorization: 'Bearer $S{userAccessToken}' })
          .expectStatus(200)
          .expectJsonLength(0);
      });
    });
  });
});
