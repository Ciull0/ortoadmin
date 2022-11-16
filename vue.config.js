
const verMajor = 1;
const verMinor = 0;
const now = new Date();
const padTwo = (val) => (val > 9 ? "" : "0") + val;
const nowMonth = now.getMonth() + 1;
const nowDay = now.getDate();
const verBuildDate = now.getFullYear() + padTwo(nowMonth) + padTwo(nowDay);
const verBuildTime = padTwo(now.getHours()) + padTwo(now.getMinutes()) + padTwo(now.getSeconds());
process.env.VUE_APP_VERSION = `${verBuildDate}.${verBuildTime}`;
process.env.VUE_APP_COMMITMESSAGE =process.env.VERCEL_GIT_COMMIT_MESSAGE;

console.log(`Building version: ${process.env.VUE_APP_VERSION}`);
/* eslint-disable */
module.exports = {
  lintOnSave: false,
  ///...other vue-cli plugin options...
  pwa: {
    name: 'Tasky',
    themeColor: '#4DBA87',
    msTileColor: '#000000',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    display: "standalone",
    cacheId: "ssdfdsfdsdfdsf",
    workboxPluginMode: "GenerateSW",
    workBoxConfig:{
      cacheId:'my-app-cache'
    }
  },

  transpileDependencies: [
    'vuetify'
  ]
}
