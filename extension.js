'use strict';

const Main = imports.ui.main;
const Clutter = imports.gi.Clutter;
const ExtensionUtils = imports.misc.extensionUtils;


const QUICK_SETTINGS_NAME = 'system';
const PLACEHOLDER_NAME = 'unlikely-placeholder-name';


class Extension {
    constructor() {
        this._settings = null;
        this._actors = null;
        this._actorsAddId = null;
        this._actorsChangeId = null;
    }


    _processActor(actor, sec) {
        let delaySec = sec || this._settings.get_int('delay-sec') * 1000;
        setTimeout(() => {
            let excludedWords = this._settings.get_string('exclude-words').toLowerCase() || QUICK_SETTINGS_NAME;
            let actorName = actor.get_first_child().get_accessible_name().toLowerCase() || PLACEHOLDER_NAME;
            let actorObjectName = actor.get_first_child().toString().toLowerCase();

            if (
                actorName === QUICK_SETTINGS_NAME ||
                excludedWords.split(/\s+/).some(word => actorName.includes(word)) ||
                excludedWords.split(/\s+/).some(word => actorObjectName.includes(word))
            ) {
                return;
            }

            let desiredWidth = this._settings.get_int('indicator-width');
            let minWidth = this._settings.get_int('min-width');
            let maxWidth = this._settings.get_int('max-width');
            let actorWidth = actor.get_width();

            if (actorWidth >= minWidth && actorWidth <= maxWidth) {
                let realActor = actor.get_first_child();
                // workaround to fix shrinking of some icons when downsizing e.g. espresso, drive-menu ...
                if (realActor.get_first_child().get_style_class_name().includes('system-status-icon')) {
                    realActor.get_first_child().remove_style_class_name('system-status-icon');
                    realActor.get_first_child().add_style_class_name('popup-menu-icon');
                }
                realActor.set_width(desiredWidth);
                realActor.get_first_child().set_x_align(Clutter.ActorAlign.CENTER);
            }
        }, delaySec);
    }


    _processAllActors() {
        this._actors = Main.panel._rightBox.get_children();
        this._actors.forEach(actor => this._processActor(actor, 0));
    }


    enable() {
        this._settings = ExtensionUtils.getSettings();

        let delaySec = this._settings.get_int('delay-sec') * 1000;
        setTimeout(() => {
            this._processAllActors();
            this._actorsAddId = Main.panel._rightBox.connect('actor-added', (_, actor) => {
                this._processActor(actor, null);
            });
        }, delaySec);

        this._actorsChangeId = this._settings.connect('changed', () => {
            this._processAllActors();
        });
    }


    disable() {
        Main.panel._rightBox.disconnect(this._actorsAddId);
        this._settings.disconnect(this._actorsChangeId);
        this._actorsAddId = null;
        this._actorsChangeId = null;
        this._actors = null;
    }
}


function init() {
    return new Extension();
}
