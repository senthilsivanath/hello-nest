import { readFileSync } from 'fs';
import { load } from 'js-yaml';
import { join } from 'path';
import { readYamlEnvSync, readYamlEnv } from 'yaml-env-defaults';

const YAML_CONFIG_FILENAME = 'config.yaml';

export default () => {
    // let config = load(
    //     readFileSync(join(__dirname, YAML_CONFIG_FILENAME), 'utf8'),
    // ) as Record<string, any>;

    const config = readYamlEnvSync(join(__dirname, YAML_CONFIG_FILENAME), process.env)

    // config = {
    //     ...config,
    //     db: {
    //         ...config.db,
    //         postgres: {
    //             ...config.db.postgres,
    //             url: process.env.DATABASE_HOST
    //         }
    //     }
    // }

    return config;
    // return {
    //     port: parseInt(process.env.PORT, 10) || 3000,
    //     database: {
    //         host: process.env.DATABASE_HOST,
    //         port: parseInt(process.env.DATABASE_PORT, 10) || 5432
    //     }
    // }
}