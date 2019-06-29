// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`./

export const environment = {
  production: true,
  BASE_URL: 'https://www.ebizlatindata.com/',
  BASE_URL_WS: 'https://ws.b2miningdata.com/',
  OCP_APIM_SUBSCRIPTION_KEY:'dc48c92df07e4a029f23c43307355fab',
  TIME_INACTIVE: new Number(600000),
  ATTACHED_FILES: 'temp'
};
