import { createMock } from "@golevelup/ts-jest";
import { ConfigService } from "@nestjs/config";
import { Configuration } from "./configuration";

export function configServiceMock<T extends keyof Configuration>(mockPath: T, configMock: Partial<Configuration[T]>) {
    const configServiceMock = createMock<ConfigService<Configuration>>();

    configServiceMock.get.mockImplementation(path => {
        if (path === mockPath) {
            return configMock;
        } else if (path === '') {
            return { path: configMock };
        }
    });

    return {
        provide: ConfigService,
        useValue: configServiceMock
    };
}
