import { createI18n } from 'vue-i18n';
import messages from '../i18n';
import { startDomLocalizer } from '../i18n/domLocalizer';
import { defineBoot } from '#q-app/wrappers';
// You'll need to create the src/i18n/index.js/.ts file too

const i18n = createI18n({
    locale: 'zh-cn',
    fallbackLocale: 'en-us',
    globalInjection: true,
    allowComposition: true,
    legacy: false,
    missingWarn: false,
    fallbackWarn: false,
    messages,
})

// @ts-ignore
export default defineBoot(async ({ app }) => {
    // Tell app to use the I18n instance
    app.use(i18n)
    startDomLocalizer((key, params) => i18n.global.t(key, params ?? {}))
});

export { i18n }
