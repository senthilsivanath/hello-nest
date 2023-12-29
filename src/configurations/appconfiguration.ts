import { readFileSync } from 'fs';
import { load } from 'js-yaml';
import { join } from 'path';
import { readYamlEnvSync, readYamlEnv } from 'yaml-env-defaults';

const YAML_CONFIG_FILENAME = '../../config/config.yaml';

export default () => {
    const config = readYamlEnvSync(join(__dirname, YAML_CONFIG_FILENAME), process.env)
    return config;    
}