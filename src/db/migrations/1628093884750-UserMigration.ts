import {MigrationInterface, QueryRunner} from "typeorm";

export class UserMigration1628093884750 implements MigrationInterface {
    name = 'UserMigration1628093884750'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" varchar NOT NULL, "first_name" varchar NOT NULL, "last_name" varchar NOT NULL, "password" varchar NOT NULL, "created_at" varchar NOT NULL DEFAULT ('1.628.093.887.342'), "updated_at" varchar NOT NULL DEFAULT ('1.628.093.887.357'))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
