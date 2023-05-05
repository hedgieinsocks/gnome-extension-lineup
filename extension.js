'use strict';

const Main = imports.ui.main;
const Clutter = imports.gi.Clutter;
const ExtensionUtils = imports.misc.extensionUtils;


class Extension {
    constructor() {
        this._actors = null;
        this._actorsAddId = null;
    }


    _processActor(actor) {
        // skip combined quick settings indicator
        if (actor.get_first_child().accessible_name == 'System') { return };

        let desiredWidth = this._settings.get_int('indicator-width');
        let minWidth = this._settings.get_int('min-width');
        let maxWidth = this._settings.get_int('max-width');
        let actorWidth = actor.width;


        if (actorWidth >= minWidth && actorWidth <= maxWidth) {
            let realActor = actor.get_first_child();
            // workaround to fix shrinking of some icons when downsizing e.g. espresso, drive-menu ...
            if (realActor.get_first_child().get_style_class_name() == 'system-status-icon') {
                realActor.get_first_child().remove_style_class_name('system-status-icon');
                realActor.get_first_child().add_style_class_name('popup-menu-icon');
            }
            realActor.width = desiredWidth;
            realActor.get_first_child().set_x_align(Clutter.ActorAlign.CENTER);
        }
    }


    _processAllActors() {
        this._actors = Main.panel._rightBox.get_children();
        this._actors.forEach(actor => this._processActor(actor));
    }


    enable() {
        this._settings = ExtensionUtils.getSettings();

        this._processAllActors();

        this._actorsAddId = Main.panel._rightBox.connect('actor-added', (_, actor) => {
            this._processActor(actor);
        });

        this._actorsChangeId = this._settings.connect('changed', () => {
            this._processAllActors();
        });
    }


    disable() {
        Main.panel._rightBox.disconnect(this._actorsAddId);
        this._settings.disconnect(this._actorsChangeId);
        this._actorsAddId = null;
        this._actorsChangeId = null;
        this._settings = null;
        this._actors = null;
    }
}


function init() {
    return new Extension();
}
