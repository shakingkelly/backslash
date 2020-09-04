let fs: any;

console.log('[cwd]', process.cwd())
console.log('[resourcePath]', (process as any).resourcesPath)

const appPath =
  process.env.NODE_ENV === 'production'
    ? `${(process as any).resourcesPath}`
    : __dirname;

// const injectorPath = path.join(appPath, 'helpers/inputInjector.js');
// const injectorCodeString = fs.readFileSync(injectorPath, { encoding: 'utf8' });

if (process.env.REACT_APP_MODE === 'electron') {
    console.log(`REQUIRING fs-extra`);
    fs = require('fs-extra');
}

export default class TestFs {

    static getDirectoryListing(): string {
        if (process.env.REACT_APP_MODE === 'electron') {
            let files = fs.readdirSync(appPath + '/asset');
            return JSON.stringify(files, null, 2);
        } else {
            return 'Directory listing is not available in the browser.'
        }
    }
}
