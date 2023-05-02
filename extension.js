'use strict';

const Main = imports.ui.main;
const Clutter = imports.gi.Clutter;
const ExtensionUtils = imports.misc.extensionUtils;


const styleMapping = {
    0: 50,
    1: 40,
};


class Extension {
    constructor() {
        this._actors = null;
        this._actorsAddId = null;
    }


    _processActor(actor) {
        let indicatorStyle = this._settings.get_int('indicator-style');
        let mappedStyle = styleMapping[indicatorStyle];
        let actorWidth = actor.width;

        if (indicatorStyle == 0) {
            if (actorWidth < mappedStyle) {
                actor.get_first_child().min_width = mappedStyle;
                actor.get_first_child().get_first_child().set_x_align(Clutter.ActorAlign.CENTER);
            }
        } else {
            /*
                we don't want to break custom wide indicators
                so we resize only standard ones that have width 50
                + 51 is the width of the language switch
            */
            if (actorWidth == styleMapping[0] || actorWidth == styleMapping[0] +  1) {
                actor.get_first_child().width = mappedStyle;
            }
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

        this._actorsChangeId = this._settings.connect('changed::indicator-style', () => {
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
