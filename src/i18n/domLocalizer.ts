import zhCN from './zh-cn';

type Translate = (key: string, params?: Record<string, string | number>) => string;
type DynamicRule = {
    pattern: RegExp;
    translate: (match: RegExpMatchArray, t: Translate) => string;
};

const TRANSLATABLE_ATTRIBUTES = ['placeholder', 'title', 'aria-label', 'alt'];
const IGNORED_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT']);

const normalizeText = (value: string) => value.replace(/\s+/g, ' ').trim();

const exactKeys = new Map<string, string>(
    Object.entries(zhCN)
        .filter(([, value]) => typeof value === 'string')
        .map(([key]) => [normalizeText(key), key])
);

function typeName(value: string, t: Translate) {
    return t(value.toLowerCase() === 'server' ? 'server' : 'game');
}

const dynamicRules: DynamicRule[] = [
    {
        pattern: /^by (.+)$/,
        translate: ([, author], t) => t('patterns.byAuthor', { author }),
    },
    {
        pattern: /^Cache date: (.+)$/,
        translate: ([, date], t) => t('patterns.cacheDate', { date }),
    },
    {
        pattern: /^Current profile: (.+)$/,
        translate: ([, profile], t) => t('patterns.currentProfile', { profile }),
    },
    {
        pattern: /^(\d+)\/(\d+) enabled$/,
        translate: ([, enabled, total], t) => t('patterns.enabledCount', { enabled, total }),
    },
    {
        pattern: /^(\d+)\/(\d+) disabled$/,
        translate: ([, disabled, total], t) => t('patterns.disabledCount', { disabled, total }),
    },
    {
        pattern: /^(\d+) mod has an update available$/,
        translate: ([, count], t) => t('patterns.modHasUpdate', { count }),
    },
    {
        pattern: /^(\d+) mods have an update available$/,
        translate: ([, count], t) => t('patterns.modsHaveUpdate', { count }),
    },
    {
        pattern: /^Show dependency strings for (\d+) mod\(s\)$/,
        translate: ([, count], t) => t('patterns.dependencyStringsFor', { count }),
    },
    {
        pattern: /^Error refreshing the mod list: (.+)$/,
        translate: ([, error], t) => t('patterns.errorRefreshing', { error }),
    },
    {
        pattern: /^The current launch behaviour is set to: (.+)$/,
        translate: ([, mode], t) => t('patterns.launchBehaviour', { mode }),
    },
    {
        pattern: /^Downloading mods \((\d+)%\)$/,
        translate: ([, percent], t) => t('patterns.downloadingModsPercent', { percent }),
    },
    {
        pattern: /^Installing mods \((\d+)%\)$/,
        translate: ([, percent], t) => t('patterns.installingModsPercent', { percent }),
    },
    {
        pattern: /^Downloading and installing (\d+) mods\.\.\.$/,
        translate: ([, count], t) => t('patterns.downloadingAndInstallingMods', { count }),
    },
    {
        pattern: /^Downloading: (.+)$/,
        translate: ([, name], t) => t('patterns.downloadingName', { name }),
    },
    {
        pattern: /^Extracting: (.+)$/,
        translate: ([, name], t) => t('patterns.extractingName', { name }),
    },
    {
        pattern: /^Installing: (.+)$/,
        translate: ([, name], t) => t('patterns.installingName', { name }),
    },
    {
        pattern: /^(\d+)% of (.+)$/,
        translate: ([, percent, size], t) => t('patterns.percentOf', { percent, size }),
    },
    {
        pattern: /^(\d+)% complete$/,
        translate: ([, percent], t) => t('patterns.percentComplete', { percent }),
    },
    {
        pattern: /^No (game|server)s found matching "(.+)"$/,
        translate: ([, type, filter], t) => t('patterns.noTabFound', { type: typeName(type, t), filter }),
    },
    {
        pattern: /^(Game|Server) selection$/,
        translate: ([, type], t) => t('patterns.selection', { type: typeName(type, t) }),
    },
    {
        pattern: /^Request a new (game|server)$/,
        translate: ([, type], t) => t('patterns.requestNew', { type: typeName(type, t) }),
    },
    {
        pattern: /^Reset (.+) installation$/,
        translate: ([, game], t) => t('patterns.resetInstallation', { game }),
    },
    {
        pattern: /^This will delete all contents of the (.+) folder, and verify the files through Steam$/,
        translate: ([, folder], t) => t('patterns.resetInstallDescription', { folder }),
    },
    {
        pattern: /^Change (.+) folder$/,
        translate: ([, game], t) => t('patterns.changeGameFolder', { game }),
    },
    {
        pattern: /^Change the location of the (.+) folder that (.+) uses\.$/,
        translate: ([, game, appName], t) => t('patterns.changeGameFolderDescription', { game, appName }),
    },
    {
        pattern: /^Change the location of the Steam folder that (.+) uses\.$/,
        translate: ([, appName], t) => t('patterns.changeSteamFolderDescription', { appName }),
    },
    {
        pattern: /^Locate (.+) Executable$/,
        translate: ([, game], t) => t('patterns.locateGameExecutable', { game }),
    },
    {
        pattern: /^Failed to set the (.+) folder$/,
        translate: ([, game], t) => t('patterns.failedSetGameFolder', { game }),
    },
    {
        pattern: /^The executable must be either of the following: "(.+)"\.$/,
        translate: ([, executables], t) => t('patterns.executableMustBe', { executables }),
    },
    {
        pattern: /^Getting started on (.+)$/,
        translate: ([, platform], t) => t('patterns.startingOnPlatform', { platform }),
    },
    {
        pattern: /^To be able to launch (.+) on Linux, you must first setup your Steam launch options correctly\.$/,
        translate: ([, game], t) => t('patterns.launchOnLinux', { game }),
    },
    {
        pattern: /^Please copy and paste the following to your (.+) launch options:$/,
        translate: ([, game], t) => t('patterns.pasteLaunchOptions', { game }),
    },
    {
        pattern: /^Downloading mods: (\d+)%$/,
        translate: ([, percent], t) => t('patterns.downloadingPhase', { percent }),
    },
    {
        pattern: /^Importing profile: (\d+)%$/,
        translate: ([, percent], t) => t('patterns.importProfileProgress', { percent }),
    },
];

function translateText(value: string, t: Translate): string | null {
    const normalized = normalizeText(value);

    if (normalized.length === 0) {
        return null;
    }

    const exactKey = exactKeys.get(normalized);
    if (exactKey) {
        return t(exactKey);
    }

    for (const rule of dynamicRules) {
        const match = normalized.match(rule.pattern);
        if (match) {
            return rule.translate(match, t);
        }
    }

    return null;
}

function localizeTextNode(node: Text, t: Translate) {
    const original = node.nodeValue ?? '';
    const translated = translateText(original, t);

    if (translated === null) {
        return;
    }

    const leading = original.match(/^\s*/)?.[0] ?? '';
    const trailing = original.match(/\s*$/)?.[0] ?? '';
    const nextValue = `${leading}${translated}${trailing}`;

    if (nextValue !== original) {
        node.nodeValue = nextValue;
    }
}

function localizeElementAttributes(element: Element, t: Translate) {
    for (const attribute of TRANSLATABLE_ATTRIBUTES) {
        const original = element.getAttribute(attribute);
        if (original === null) {
            continue;
        }

        const translated = translateText(original, t);
        if (translated !== null && translated !== original) {
            element.setAttribute(attribute, translated);
        }
    }
}

function localizeNode(node: Node, t: Translate) {
    if (node.nodeType === Node.TEXT_NODE) {
        const parent = node.parentElement;
        if (!parent || IGNORED_TAGS.has(parent.tagName)) {
            return;
        }
        localizeTextNode(node as Text, t);
        return;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
        return;
    }

    const element = node as Element;
    if (IGNORED_TAGS.has(element.tagName)) {
        return;
    }

    localizeElementAttributes(element, t);
    element.childNodes.forEach((child) => localizeNode(child, t));
}

export function startDomLocalizer(t: Translate) {
    if (typeof window === 'undefined') {
        return;
    }

    if (!document.body) {
        window.addEventListener('DOMContentLoaded', () => startDomLocalizer(t), { once: true });
        return;
    }

    const run = () => localizeNode(document.body, t);
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === 'characterData') {
                localizeNode(mutation.target, t);
                continue;
            }

            if (mutation.type === 'attributes') {
                localizeNode(mutation.target, t);
                continue;
            }

            mutation.addedNodes.forEach((node) => localizeNode(node, t));
        }
    });

    window.requestAnimationFrame(run);
    observer.observe(document.body, {
        attributes: true,
        attributeFilter: TRANSLATABLE_ATTRIBUTES,
        characterData: true,
        childList: true,
        subtree: true,
    });
}
