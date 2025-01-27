const fs = require('fs');
const { join } = require('path');
const { program, Option } = require('commander');

const createNewModule = (options) => {
    const { name, crud } = options;

    const moduleName = name;
    const moduleNameWithFirstLetterLower = lowercaseFirstLetter(moduleName)
    const moduleFolderPath = join(__dirname, '..', `src/modules`);

    const modulePath = join(moduleFolderPath, moduleName);
    const dtoPath = join(modulePath, 'dto');
    const repositoryPath = join(modulePath, 'repository');
    const useCasesPath = join(modulePath, 'useCases');
    const schemasPath = join(modulePath, 'schemas');

    // Creates directories
    fs.mkdirSync(modulePath, { recursive: true });
    fs.mkdirSync(dtoPath, { recursive: true });
    fs.mkdirSync(repositoryPath, { recursive: true });
    fs.mkdirSync(useCasesPath, { recursive: true });
    fs.mkdirSync(schemasPath, { recursive: true });

    // Creates route and controller file
    if(crud){
        fs.writeFile(
            join(modulePath, `${moduleName}.controller.ts`),
            `import BaseController from '../../shared/base/BaseController';\nimport {TypedRequestQuery} from "../../shared/http/TypedRequest";\nimport {fetch${moduleName}ByIdSchema, create${moduleName}Schema, delete${moduleName}ByIdSchema, update${moduleName}Schema} from "./schemas/${moduleName}.schema";\nimport { NextFunction, Response } from "express";\nimport { validate } from "../../infra/middleware/validation";\nimport {fetch${moduleName}ByIdUseCase, delete${moduleName}ByIdUseCase, update${moduleName}UseCase,create${moduleName}UseCase} from "./useCases";\nclass ${moduleName}Controller extends BaseController{\n\n\n    private readonly baseUrl: string;\n    constructor() { \n        super();\n        this.baseUrl = '${moduleNameWithFirstLetterLower}';\n        this.initializeRoutes();\n    }\n    fetchById = async (req: TypedRequestQuery<typeof fetch${moduleName}ByIdSchema>, res: Response, next: NextFunction): Promise<void> => {\n        try{\n            const { id } = req.params;\n            this.handleResult(res, await fetch${moduleName}ByIdUseCase.execute(+id));\n        } catch (e) {\n            next(e);\n        }\n\n    }\n    deleteById = async (req: TypedRequestQuery<typeof delete${moduleName}ByIdSchema>, res: Response, next: NextFunction): Promise<void> => {\n        try{\n            const { id } = req.params;\n            this.handleResult(res, await delete${moduleName}ByIdUseCase.execute(+id));\n        } catch (e) {\n            next(e);\n        }\n    }\n\n    create = async (req: TypedRequestQuery<typeof create${moduleName}Schema>, res: Response, next: NextFunction): Promise<void> => {\n        try{\n            const ${moduleNameWithFirstLetterLower} = req.body;\n            this.handleResult(res, await create${moduleName}UseCase.execute(${moduleNameWithFirstLetterLower}));\n        } catch (e) {\n            next(e);\n        }\n\n    }\n    update = async (req: TypedRequestQuery<typeof update${moduleName}Schema>, res: Response, next: NextFunction): Promise<void> => {\n        try{\n            const ${moduleNameWithFirstLetterLower} = req.body;\n            const { id } = req.params;\n            this.handleResult(res, await update${moduleName}UseCase.execute(+id, ${moduleNameWithFirstLetterLower}));\n        } catch (e) {\n            next(e);\n        }\n    }\n\n    private initializeRoutes(): void {\n\n        this.router.get(\`/${moduleNameWithFirstLetterLower}/:id\`, [validate(fetch${moduleName}ByIdSchema)], this.fetchById);\n\n        this.router.post(\`/${moduleNameWithFirstLetterLower}\`, [ validate(create${moduleName}Schema)], this.create);\n\n        this.router.put(\`/${moduleNameWithFirstLetterLower}/:id\`, [validate(update${moduleName}Schema)], this.update);\n\n        this.router.delete(\`/${moduleNameWithFirstLetterLower}/:id\`, [validate(delete${moduleName}ByIdSchema)], this.deleteById);\n    }\n}\nexport default new ${moduleName}Controller();`,
            function (err) {
                if (err) throw err;
            },
        );
    } else {
        fs.writeFile(
            join(modulePath, `${moduleName}.controller.ts`),
            `import BaseController from '../../shared/base/BaseController';\n\nexport class ${moduleName}Controller extends BaseController {}`,
            function (err) {
                if (err) throw err;
            },
        );
    }

    if(crud) {
        // Dtos
        fs.writeFile(
            join(dtoPath, `${moduleName}.dto.ts`),
            `\nexport class ${moduleName}Dto {}`,
            function (err) {
                if (err) throw err;
            },
        );

        fs.writeFile(
            join(dtoPath, `${moduleName}Request.dto.ts`),
            `\nexport type ${moduleName}RequestDto = {}\n\nexport type ${moduleName}CreateRequestDto = ${moduleName}RequestDto;\nexport type ${moduleName}UpdateRequestDto = Partial<${moduleName}CreateRequestDto>;`,
            function (err) {
                if (err) throw err;
            },
        );

        fs.writeFile(
            join(dtoPath, `Mocks.ts`),
            `import {${moduleName}Dto} from "./${moduleName}.dto";\nimport {${moduleName}RequestDto} from "./${moduleName}Request.dto";\nexport const ${moduleName}DtoMock: ${moduleName}Dto = {}\nexport const ${moduleName}RequestDtoMock: ${moduleName}RequestDto = {}`,
            function (err) {
                if (err) throw err;
            },
        );

        // Schemas
        fs.writeFile(
            join(schemasPath, `${moduleName}.schema.ts`),
            `import {z} from "zod";\nexport const fetch${moduleName}ByIdSchema = z.object({\n    params: z.object({\n        id: z.coerce.number({required_error: "ID is required", invalid_type_error: "ID must be a number"}).int().min(1)\n    })\n})\nexport const create${moduleName}Schema = z.object({\n    body: z.object({})\n})\nexport const update${moduleName}Schema = z.object({\n    params: z.object({\n        id: z.coerce.number({required_error: "ID is required", invalid_type_error: "ID must be a number"}).int().min(1)\n    }),\n    body: z.object({}),\n})\nexport const delete${moduleName}ByIdSchema = z.object({\n    params: z.object({\n        id: z.coerce.number({required_error: "ID is required", invalid_type_error: "ID must be a number"}).int().min(1)\n    })\n})`,
            function (err) {
                if (err) throw err;
            },
        );

        // UseCases
        fs.mkdirSync(join(useCasesPath, `Create${moduleName}`), { recursive: true });
        fs.mkdirSync(join(useCasesPath, `Update${moduleName}`), { recursive: true });
        fs.mkdirSync(join(useCasesPath, `Fetch${moduleName}ById`), { recursive: true });
        fs.mkdirSync(join(useCasesPath, `Delete${moduleName}ById`), { recursive: true });

        //create
        fs.writeFile(
            join(join(useCasesPath, `Create${moduleName}`), `Create${moduleName}.test.ts`),
            `import {${moduleName}RequestDtoMock, ${moduleName}DtoMock} from "../../dto/Mocks";\nimport {Result} from "../../../../shared/result";\nimport {mock} from "jest-mock-extended";\nimport {I${moduleName}Repository} from "../../repository/I${moduleName}Repository";\nimport {Create${moduleName}UseCase} from "./index";\n\nconst ${moduleNameWithFirstLetterLower}RepositoryMock = mock<I${moduleName}Repository>();\nconst create${moduleName}UseCase = new Create${moduleName}UseCase(${moduleNameWithFirstLetterLower}RepositoryMock);\n\ndescribe('Positive: Create ${moduleNameWithFirstLetterLower} test', () => {\n    beforeEach(() => {\n        ${moduleNameWithFirstLetterLower}RepositoryMock.create.mockReset();\n    });\n\n    it('Should return success', async () => {\n        ${moduleNameWithFirstLetterLower}RepositoryMock.create.mockResolvedValueOnce(${moduleName}DtoMock);\n\n        const result = await create${moduleName}UseCase.execute(${moduleName}RequestDtoMock);\n\n        expect(result).toBeInstanceOf(Result);\n        expect(result.success).toBeTruthy();\n        expect(result.statusCode).toBe(201);\n        expect(result.data).toBe(${moduleName}DtoMock);\n    })\n})`,
            function (err) {
                if (err) throw err;
            },
        );

        fs.writeFile(
            join(join(useCasesPath, `Create${moduleName}`), `index.ts`),
            `import {${moduleName}Dto} from "../../dto/${moduleName}.dto";\nimport {I${moduleName}Repository} from "../../repository/I${moduleName}Repository";\nimport {${moduleName}RequestDto} from "../../dto/${moduleName}Request.dto";\nimport {IResult, Result} from "../../../../shared/result";\n\nexport class Create${moduleName}UseCase {\n    private readonly ${moduleNameWithFirstLetterLower}Repository: I${moduleName}Repository;\n    constructor(${moduleNameWithFirstLetterLower}Repository: I${moduleName}Repository) {\n        this.${moduleNameWithFirstLetterLower}Repository = ${moduleNameWithFirstLetterLower}Repository;\n    }\n    public async execute(${moduleNameWithFirstLetterLower}Request: ${moduleName}RequestDto): Promise<IResult<${moduleName}Dto>> {\n        const result = new Result<${moduleName}Dto>;\n\n        const created${moduleName} = await this.${moduleNameWithFirstLetterLower}Repository.create({ ...${moduleNameWithFirstLetterLower}Request });\n        if(!created${moduleName}) {\n            result.setError('Error creating ${moduleNameWithFirstLetterLower}', 500);\n\n            return result;\n        }\n\n        result.setData(created${moduleName}, 200);\n        result.setMessage('Created ${moduleNameWithFirstLetterLower} successfully', 200);\n\n        return result;\n    }\n}`,
            function (err) {
                if (err) throw err;
            },
        );

        //update
        fs.writeFile(
            join(join(useCasesPath, `Update${moduleName}`), `Update${moduleName}.test.ts`),
            `import {${moduleName}RequestDtoMock, ${moduleName}DtoMock} from "../../dto/Mocks";\nimport {Result} from "../../../../shared/result";\nimport {mock} from "jest-mock-extended";\nimport {I${moduleName}Repository} from "../../repository/I${moduleName}Repository";\nimport {Update${moduleName}UseCase} from "./index";\n\nconst ${moduleNameWithFirstLetterLower}RepositoryMock = mock<I${moduleName}Repository>();\nconst update${moduleName}UseCase = new Update${moduleName}UseCase(${moduleNameWithFirstLetterLower}RepositoryMock);\n\ndescribe('Positive: Update ${moduleNameWithFirstLetterLower} test', () => {\n    beforeEach(() => {\n        ${moduleNameWithFirstLetterLower}RepositoryMock.update.mockReset();\n    });\n\n    it('Should return success', async () => {\n        ${moduleNameWithFirstLetterLower}RepositoryMock.update.mockResolvedValueOnce(${moduleName}DtoMock);\n\n        const result = await update${moduleName}UseCase.execute(1, ${moduleName}RequestDtoMock);\n\n        expect(result).toBeInstanceOf(Result);\n        expect(result.success).toBeTruthy();\n        expect(result.statusCode).toBe(200);\n        expect(result.data).toBe(${moduleName}DtoMock);\n    })\n})`,
            function (err) {
                if (err) throw err;
            },
        );

        fs.writeFile(
            join(join(useCasesPath, `Update${moduleName}`), `index.ts`),
            `import {${moduleName}Dto} from "../../dto/${moduleName}.dto";\nimport {I${moduleName}Repository} from "../../repository/I${moduleName}Repository";\nimport {${moduleName}RequestDto} from "../../dto/${moduleName}Request.dto";\nimport {IResult, Result} from "../../../../shared/result";\n\nexport class Update${moduleName}UseCase {\n    private readonly ${moduleNameWithFirstLetterLower}Repository: I${moduleName}Repository;\n    constructor(${moduleNameWithFirstLetterLower}Repository: I${moduleName}Repository) {\n        this.${moduleNameWithFirstLetterLower}Repository = ${moduleNameWithFirstLetterLower}Repository;\n    }\n    public async execute(id: number, ${moduleNameWithFirstLetterLower}Request: ${moduleName}RequestDto): Promise<IResult<${moduleName}Dto>> {\n        const result = new Result<${moduleName}Dto>;\n\n        const updated${moduleName} = await this.${moduleNameWithFirstLetterLower}Repository.update(id, { ...${moduleNameWithFirstLetterLower}Request });\n        if(!updated${moduleName}) {\n            result.setError('Error updating ${moduleNameWithFirstLetterLower}', 500);\n\n            return result;\n        }\n        result.setData(updated${moduleName}, 200);\n        result.setMessage('Updated ${moduleNameWithFirstLetterLower} successfully', 200);\n\n        return result;\n    }\n}`,
            function (err) {
                if (err) throw err;
            },
        );

        //delete
        fs.writeFile(
            join(join(useCasesPath, `Delete${moduleName}ById`), `Delete${moduleName}ById.test.ts`),
            `import {${moduleName}DtoMock} from "../../dto/Mocks";\nimport {Result} from "../../../../shared/result";\nimport {mock} from "jest-mock-extended";\nimport {I${moduleName}Repository} from "../../repository/I${moduleName}Repository";\nimport {Delete${moduleName}ByIdUseCase} from "./index";\n\nconst ${moduleNameWithFirstLetterLower}RepositoryMock = mock<I${moduleName}Repository>();\nconst delete${moduleName}ByIdUseCase = new Delete${moduleName}ByIdUseCase(${moduleNameWithFirstLetterLower}RepositoryMock);\n\ndescribe('Positive: Delete ${moduleNameWithFirstLetterLower} test', () => {\n    beforeEach(() => {\n        ${moduleNameWithFirstLetterLower}RepositoryMock.deleteById.mockReset();\n    });\n\n    it('Should return success', async () => {\n        ${moduleNameWithFirstLetterLower}RepositoryMock.deleteById.mockResolvedValueOnce(${moduleName}DtoMock);\n\n        const result = await delete${moduleName}ByIdUseCase.execute(1);\n\n        expect(result).toBeInstanceOf(Result);\n        expect(result.success).toBeTruthy();\n        expect(result.statusCode).toBe(200);\n        expect(result.data).toBe(${moduleName}DtoMock);\n    })\n})`,
            function (err) {
                if (err) throw err;
            },
        );

        fs.writeFile(
            join(join(useCasesPath, `Delete${moduleName}ById`), `index.ts`),
            `import {I${moduleName}Repository} from "../../repository/I${moduleName}Repository";\nimport {${moduleName}Dto} from "../../dto/${moduleName}.dto";\nimport {IResult, Result} from "../../../../shared/result";\n\nexport class Delete${moduleName}ByIdUseCase {\n    private readonly ${moduleNameWithFirstLetterLower}Repository: I${moduleName}Repository;\n    constructor(${moduleNameWithFirstLetterLower}Repository: I${moduleName}Repository) {\n        this.${moduleNameWithFirstLetterLower}Repository = ${moduleNameWithFirstLetterLower}Repository;\n    }\n    public async execute(id: number): Promise<IResult<${moduleName}Dto>> {\n        const result = new Result<${moduleName}Dto>;\n\n        const deleted${moduleName} = await this.${moduleNameWithFirstLetterLower}Repository.deleteById(id);\n        if(!deleted${moduleName}) {\n            result.setError('Error deleting ${moduleNameWithFirstLetterLower}', 500);\n\n            return result;\n        }\n        result.setData(deleted${moduleName}, 200);\n        result.setMessage('Deleted ${moduleNameWithFirstLetterLower} successfully', 200);\n\n        return result;\n    }\n}`,
            function (err) {
                if (err) throw err;
            },
        );

        //fetchById
        fs.writeFile(
            join(join(useCasesPath, `Fetch${moduleName}ById`), `Fetch${moduleName}ById.test.ts`),
            `import {${moduleName}DtoMock} from "../../dto/Mocks";\nimport {Result} from "../../../../shared/result";\nimport {mock} from "jest-mock-extended";\nimport {I${moduleName}Repository} from "../../repository/I${moduleName}Repository";\nimport {Fetch${moduleName}ByIdUseCase} from "./index";\n\nconst ${moduleNameWithFirstLetterLower}RepositoryMock = mock<I${moduleName}Repository>();\nconst fetch${moduleName}ByIdUseCase = new Fetch${moduleName}ByIdUseCase(${moduleNameWithFirstLetterLower}RepositoryMock);\n\ndescribe('Positive: Fetch ${moduleNameWithFirstLetterLower} test', () => {\n    beforeEach(() => {\n        ${moduleNameWithFirstLetterLower}RepositoryMock.fetchById.mockReset();\n    });\n\n    it('Should return success', async () => {\n        ${moduleNameWithFirstLetterLower}RepositoryMock.fetchById.mockResolvedValueOnce(${moduleName}DtoMock);\n\n        const result = await fetch${moduleName}ByIdUseCase.execute(1);\n\n        expect(result).toBeInstanceOf(Result);\n        expect(result.success).toBeTruthy();\n        expect(result.statusCode).toBe(200);\n        expect(result.data).toBe(${moduleName}DtoMock);\n    })\n})`,
            function (err) {
                if (err) throw err;
            },
        );

        fs.writeFile(
            join(join(useCasesPath, `Fetch${moduleName}ById`), `index.ts`),
            `import {I${moduleName}Repository} from "../../repository/I${moduleName}Repository";\nimport {${moduleName}Dto} from "../../dto/${moduleName}.dto";\nimport {IResult, Result} from "../../../../shared/result";\n\nexport class Fetch${moduleName}ByIdUseCase {\n    private readonly ${moduleNameWithFirstLetterLower}Repository: I${moduleName}Repository;\n    constructor(${moduleNameWithFirstLetterLower}Repository: I${moduleName}Repository) {\n        this.${moduleNameWithFirstLetterLower}Repository = ${moduleNameWithFirstLetterLower}Repository;\n    }\n    public async execute(id: number): Promise<IResult<${moduleName}Dto>> {\n        const result = new Result<${moduleName}Dto>;\n\n        const ${moduleNameWithFirstLetterLower} = await this.${moduleNameWithFirstLetterLower}Repository.fetchById(id);\n        if(!${moduleNameWithFirstLetterLower}) {\n            result.setError('Error fetching ${moduleNameWithFirstLetterLower}', 500);\n\n            return result;\n        }\n        result.setData(${moduleNameWithFirstLetterLower}, 200);\n        result.setMessage('Fetched ${moduleNameWithFirstLetterLower} successfully', 200);\n\n        return result;\n    }\n}`,
            function (err) {
                if (err) throw err;
            },
        );

    }


    fs.mkdirSync(join(repositoryPath, 'prisma'), { recursive: true });

    if (crud) { // Creates prisma repository implementation
        fs.writeFile(
            join(join(repositoryPath, 'prisma'), `${moduleName}.repository.ts`),
            `import {${moduleName}CreateRequestDto, ${moduleName}UpdateRequestDto} from "../../dto/${moduleName}Request.dto";\nimport {${moduleName}Dto} from "../../dto/${moduleName}.dto";\nimport {morphism} from "morphism";\nimport { I${moduleName}Repository } from '../I${moduleName}Repository';\nimport {PrismaClient} from "@prisma/client";\nimport {toDto, toEntity} from "./${moduleName}.schema";\n\nclass ${moduleName}Repository implements I${moduleName}Repository {\n    async create(${moduleNameWithFirstLetterLower}: ${moduleName}CreateRequestDto): Promise<${moduleName}Dto | null> {\n        const created${moduleName} = await PrismaClient.${moduleNameWithFirstLetterLower}.create({\n            data: morphism(toEntity, ${moduleNameWithFirstLetterLower})\n        });\n\n        if(created${moduleName}) return morphism(toDto, created${moduleName});\n\n        return null;\n    }\n\n    async deleteById(id: number): Promise<${moduleName}Dto | null> {\n        const ${moduleNameWithFirstLetterLower} = await PrismaClient.${moduleNameWithFirstLetterLower}.delete({\n            where: { id }\n        });\n\n        if(${moduleNameWithFirstLetterLower}) return morphism(toDto, ${moduleNameWithFirstLetterLower});\n\n        return null;\n}\n\n    async fetchById(id: number): Promise<${moduleName}Dto | null> {\n        const ${moduleNameWithFirstLetterLower} = await PrismaClient.${moduleNameWithFirstLetterLower}.findFirst({\n            where: { id }\n        })\n\n        if(${moduleNameWithFirstLetterLower}) return morphism(toDto, ${moduleNameWithFirstLetterLower});\n\n        return null;\n    }\n\n    async update(id: number, ${moduleNameWithFirstLetterLower}: ${moduleName}UpdateRequestDto): Promise<${moduleName}Dto | null> {\n\n        const updated${moduleName} = await PrismaClient.${moduleNameWithFirstLetterLower}.update({\n            where: { id },\n            data: morphism(toEntity, ${moduleNameWithFirstLetterLower})\n        });\n\n        if(updated${moduleName}) return morphism(toDto, updated${moduleName});\n\n        return null;\n    }\n}\n\nexport default new ${moduleName}Repository();`,
            function (err) {
                if (err) throw err;
            },
        );

        fs.writeFile(
            join(join(repositoryPath, 'prisma'), `${moduleName}.schema.ts`),
            `import {createSchema} from "morphism";\nimport {${moduleName}Dto} from "../../dto/${moduleName}.dto";\nimport {${moduleName}} from "@prisma/client";\nimport {${moduleName}CreateRequestDto, ${moduleName}UpdateRequestDto} from "../../dto/${moduleName}Request.dto";\n\nexport const toDto = createSchema<${moduleName}Dto, ${moduleName}>({});\n\nexport const toEntity = createSchema<${moduleName}, ${moduleName}CreateRequestDto | ${moduleName}UpdateRequestDto>({});`,
            function (err) {
                if (err) throw err;
            },
        );
    } else {
        fs.writeFile(
            join(join(repositoryPath, 'prisma'), `${moduleName}.repository.ts`),
            `import { I${moduleName}Repository } from '../I${moduleName}Repository';\n\nexport class ${moduleName}Repository implements I${moduleName}Repository {}`,
            function (err) {
                if (err) throw err;
            },
        );
    }

    // Creates repository interface
    if(crud){
        fs.writeFile(
            join(join(repositoryPath), `I${moduleName}Repository.ts`),
            `import { ${moduleName}Dto } from "../dto/${moduleName}.dto";\nimport { ${moduleName}CreateRequestDto, ${moduleName}UpdateRequestDto } from "../dto/${moduleName}Request.dto";\nexport interface I${moduleName}Repository {\n    fetchById: (id: number) => Promise<${moduleName}Dto | null>;\n    create: (${moduleNameWithFirstLetterLower}: ${moduleName}CreateRequestDto) => Promise<${moduleName}Dto | null>;\n    update: (id: number, ${moduleNameWithFirstLetterLower}: ${moduleName}UpdateRequestDto) => Promise<${moduleName}Dto | null>;\n    deleteById: (id: number) => Promise<${moduleName}Dto | null>;\n}`,
            function (err) {
                if (err) throw err;
            },
        );
    } else {
        fs.writeFile(
            join(join(repositoryPath), `I${moduleName}Repository.ts`),
            `export interface I${moduleName}Repository {}`,
            function (err) {
                if (err) throw err;
            },
        );
    }

    // Creates useCase export file
    if(crud){
        fs.writeFile(
            join(join(useCasesPath), `index.ts`),
            `import {Fetch${moduleName}ByIdUseCase} from "./Fetch${moduleName}ById";\nimport {Create${moduleName}UseCase} from "./Create${moduleName}";\nimport {Update${moduleName}UseCase} from "./Update${moduleName}";\nimport {Delete${moduleName}ByIdUseCase} from "./Delete${moduleName}ById";\n\nimport ${moduleNameWithFirstLetterLower}Repository from "../repository/prisma/${moduleName}.repository";\n\nconst fetch${moduleName}ByIdUseCase = new Fetch${moduleName}ByIdUseCase(${moduleNameWithFirstLetterLower}Repository);\nconst delete${moduleName}ByIdUseCase = new Delete${moduleName}ByIdUseCase(${moduleNameWithFirstLetterLower}Repository);\nconst create${moduleName}UseCase = new Create${moduleName}UseCase(${moduleNameWithFirstLetterLower}Repository);\nconst update${moduleName}UseCase = new Update${moduleName}UseCase(${moduleNameWithFirstLetterLower}Repository);\n\nexport { fetch${moduleName}ByIdUseCase, delete${moduleName}ByIdUseCase, create${moduleName}UseCase, update${moduleName}UseCase }`,
            function (err) {
                if (err) throw err;
            },
        );
    } else {
        fs.writeFile(
            join(join(useCasesPath), `index.ts`),
            'export {}',
            function (err) {
                if (err) throw err;
            },
        );
    }


};

function lowercaseFirstLetter(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
}

program
    .command('g')
    .description('Generates a new resource')
    .argument('<action>')
    .requiredOption('-n, --name <value>', 'Module name')
    .addOption(
        new Option('-o, --orm <value>', 'Which ORM to use')
            .choices(['prisma', 'sequelize'])
            .default('prisma', 'Prisma'),
            )
    .addOption(
        new Option('-c, --crud', 'If should create a complete CRUD of usecases')
        )
    .description('Generates a new module')
    .action((action, op) => {
        if (action === 'mod') createNewModule(op);
    });

program.parse(process.argv);
