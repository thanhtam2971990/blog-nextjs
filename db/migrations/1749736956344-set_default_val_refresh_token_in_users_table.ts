import { MigrationInterface, QueryRunner } from "typeorm";

export class SetDefaultValRefreshTokenInUsersTable1749736956344 implements MigrationInterface {
    name = 'SetDefaultValRefreshTokenInUsersTable1749736956344'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`refresh_token\` \`refresh_token\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` CHANGE \`refresh_token\` \`refresh_token\` varchar(255) NOT NULL`);
    }

}
