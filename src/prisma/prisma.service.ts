import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
    constructor() {
        super({
            datasources: {
                db: {
                    url: "postgresql://postgres:8LTRuJbqtLSHN8gfPfIZ@containers-us-west-39.railway.app:6852/railway"
                }
            }
        })
    }
}
