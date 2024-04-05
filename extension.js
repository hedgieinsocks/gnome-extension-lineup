import { Extension } from "resource:///org/gnome/shell/extensions/extension.js";
import * as Main from "resource:///org/gnome/shell/ui/main.js";
import * as Config from 'resource:///org/gnome/shell/misc/config.js';
import Clutter from "gi://Clutter";

const QUICK_SETTINGS_NAME = "system";
const PLACEHOLDER_NAME = "unlikely-placeholder-name";
const MIN_LENGTH = 3;

export default class LineupExtension extends Extension {
    constructor(metadata) {
        super(metadata);
        this._settings = null;
        this._actorsAddId = null;
        this._actorsChangeId = null;
        this._timeoutIds = [];
    }

    _processActor(actor) {
        const delaySec = this._settings.get_int("delay-sec") * 1000;
        const timeoutId = setTimeout(() => {
            const excludeWords = this._settings.get_string("exclude-words").toLowerCase() || PLACEHOLDER_NAME;
            const hideWords = this._settings.get_string("hide-words").toLowerCase() || PLACEHOLDER_NAME;

            const actorName = actor.get_first_child().get_accessible_name().toLowerCase() || PLACEHOLDER_NAME;
            const actorObjectName = actor.get_first_child().toString().toLowerCase();

            if (
                actorName === QUICK_SETTINGS_NAME ||
                excludeWords.split(/\s+/).some((word) => word.length >= MIN_LENGTH && actorName.includes(word)) ||
                excludeWords.split(/\s+/).some((word) => word.length >= MIN_LENGTH && actorObjectName.includes(word))
            ) {
                return;
            }

            if (
                hideWords.split(/\s+/).some((word) => word.length >= MIN_LENGTH && actorName.includes(word)) ||
                hideWords.split(/\s+/).some((word) => word.length >= MIN_LENGTH && actorObjectName.includes(word))
            ) {
                actor.hide();
                return;
            }

            const desiredWidth = this._settings.get_int("indicator-width");
            const minWidth = this._settings.get_int("min-width");
            const maxWidth = this._settings.get_int("max-width");

            const actorWidth = actor.get_width();
            if (actorWidth < minWidth || actorWidth > maxWidth) {
                return;
            }

            const realActor = actor.get_first_child();
            if (realActor.get_first_child().get_style_class_name().includes("system-status-icon")) {
                realActor.get_first_child().remove_style_class_name("system-status-icon");
                realActor.get_first_child().add_style_class_name("popup-menu-icon");
            }

            realActor.set_width(desiredWidth);
            realActor.get_first_child().set_x_align(Clutter.ActorAlign.CENTER);
        }, delaySec);
        this._timeoutIds.push(timeoutId);
    }

    async _processAllActors() {
        const actors = Main.panel._rightBox.get_children();
        const promises = actors.map(actor => this._processActor(actor));
        await Promise.all(promises);
    }

    enable() {
        this._settings = this.getSettings();

        this._processAllActors();

        const shellVersion = parseFloat(Config.PACKAGE_VERSION).toString().slice(0, 2);
        const signal = (shellVersion == 45) ? "actor-added" : "child-added";

        this._actorsAddId = Main.panel._rightBox.connect(signal, (_, actor) => {
            this._processActor(actor);
        });

        this._actorsChangeId = this._settings.connect("changed", () => {
            this._processAllActors();
        });
    }

    disable() {
        Main.panel._rightBox.disconnect(this._actorsAddId);
        this._settings.disconnect(this._actorsChangeId);
        this._settings = null;
        this._actorsAddId = null;
        this._actorsChangeId = null;
        this._timeoutIds.forEach((timeoutId) => {
            clearTimeout(timeoutId);
        });
        this._timeoutIds = [];
    }
}
