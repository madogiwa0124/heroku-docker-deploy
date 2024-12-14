import * as core from '@actions/core';
import { runCommand } from '../utils';

export const releaseDockerContainer = async ({
    herokuApiKey,
    herokuAppName,
    cwd,
    processType,
}: {
    herokuAppName: string;
    herokuApiKey: string;
    cwd: string;
    processType: string;
}): Promise<boolean> => {
    try {
        core.startGroup('Releasing container...');
        await runCommand(`heroku container:release ${processType} --app ${herokuAppName}`, {
            env: { HEROKU_API_KEY: herokuApiKey },
            options: { cwd },
        });
        console.log('Container released.');
        core.endGroup();
        return true;
    } catch (err) {
        core.endGroup();
        if (err instanceof Error) {
            core.setFailed(`Releasing docker container failed.\nError: ${ err.message }`);
            return false;
        } else {
            console.error(`Releasing docker container failed.\nError: ${err}`);
            // FIXME: This is a workaround for the following error:
            // TypeError: Cannot read properties of undefined (reading 'statusCode')
            // https://github.com/heroku/cli/issues/3142
            console.log('Container released by workaround.');
            return true;
        }
    }
};
