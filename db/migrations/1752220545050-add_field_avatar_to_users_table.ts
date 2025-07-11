import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFieldAvatarToUsersTable1752220545050 implements MigrationInterface {
    name = 'AddFieldAvatarToUsersTable1752220545050'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`avatar\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`avatar\``);
    }

}
