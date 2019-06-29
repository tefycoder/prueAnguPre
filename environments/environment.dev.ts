// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  BASE_URL: 'https://dev.ebizlatindata.com/',
  BASE_URL_WS: 'https://devws.b2miningdata.com/',
  OCP_APIM_SUBSCRIPTION_KEY:'07a12d074c714f62ab037bb2f88e30d3',
  TIME_INACTIVE: new Number(3600000),
  ATTACHED_FILES: 'temp-dev'
};
