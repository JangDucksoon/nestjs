import { DefaultNamingStrategy, type NamingStrategyInterface } from "typeorm";
import { snakeCase } from "typeorm/util/StringUtils";

export class CustomNamingStrategy extends DefaultNamingStrategy implements NamingStrategyInterface {
    tableName(targetName: string, userSpecifiedName: string | undefined): string {
        return userSpecifiedName ? userSpecifiedName : snakeCase(targetName);
    }

    columnName(propertyName: string, customName: string, embeddedPrefixes: string[]): string {
        return snakeCase(embeddedPrefixes.concat(customName || propertyName).join('_'));
    }
}