// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`./

export const environment = {
  production: true,
  BASE_URL: 'https://qa.ebizlatindata.com/',
  BASE_URL_WS: 'https://qaws.b2miningdata.com/',
  OCP_APIM_SUBSCRIPTION_KEY:'71d24c28e69d4528ad198666e52504ff',
  TIME_INACTIVE: new Number(1800000),
  ATTACHED_FILES: 'temp-qa'
};
