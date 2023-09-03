import { Extension } from "resource:///org/gnome/shell/extensions/extension.js";
import * as Main from "resource:///org/gnome/shell/ui/main.js";
import Clutter from "gi://Clutter";

const QUICK_SETTINGS_NAME = "system";
const PLACEHOLDER_NAME = "unlikely-placeholder-name";

export default class LineupExtension extends Extension {
    constructor(metadata) {
        super(metadata);
        this._settings = null;
        this._actors = null;
        this._actorsAddId = null;
        this._actorsChangeId = null;
        this._timeoutId = [];
    }

    _processActor(actor, sec) {
        const delaySec = sec || this._settings.get_int("delay-sec") * 1000;
        const timeoutId = setTimeout(() => {
            const excludedWords =
                this._settings.get_string("exclude-words").toLowerCase() ||
                QUICK_SETTINGS_NAME;
            const actorName =
                actor.get_first_child().get_accessible_name().toLowerCase() ||
                PLACEHOLDER_NAME;
            const actorObjectName = actor
                .get_first_child()
                .toString()
                .toLowerCase();

            if (
                actorName === QUICK_SETTINGS_NAME ||
                excludedWords
                    .split(/\s+/)
                    .some((word) => actorName.includes(word)) ||
                excludedWords
                    .split(/\s+/)
                    .some((word) => actorObjectName.includes(word))
            ) {
                return;
            }

            const desiredWidth = this._settings.get_int("indicator-width");
            const minWidth = this._settings.get_int("min-width");
            const maxWidth = this._settings.get_int("max-width");
            const actorWidth = actor.get_width();

            if (actorWidth >= minWidth && actorWidth <= maxWidth) {
                const realActor = actor.get_first_child();
                // workaround to fix shrinking of some icons when downsizing e.g. espresso, drive-menu ...
                if (
                    realActor
                        .get_first_child()
                        .get_style_class_name()
                        .includes("system-status-icon")
                ) {
                    realActor
                        .get_first_child()
                        .remove_style_class_name("system-status-icon");
                    realActor
                        .get_first_child()
                        .add_style_class_name("popup-menu-icon");
                }
                realActor.set_width(desiredWidth);
                realActor
                    .get_first_child()
                    .set_x_align(Clutter.ActorAlign.CENTER);
            }
        }, delaySec);
        this._timeoutId.push(timeoutId);
    }

    _processAllActors() {
        this._actors = Main.panel._rightBox.get_children();
        this._actors.forEach((actor) => this._processActor(actor, 0));
    }

    enable() {
        this._settings = this.getSettings();
        const delaySec = this._settings.get_int("delay-sec") * 1000;
        const timeoutId = setTimeout(() => {
            this._processAllActors();
            this._actorsAddId = Main.panel._rightBox.connect(
                "actor-added",
                (_, actor) => {
                    this._processActor(actor, null);
                }
            );
        }, delaySec);
        this._timeoutId.push(timeoutId);

        this._actorsChangeId = this._settings.connect("changed", () => {
            this._processAllActors();
        });
    }

    disable() {
        Main.panel._rightBox.disconnect(this._actorsAddId);
        this._settings.disconnect(this._actorsChangeId);
        this._actorsAddId = null;
        this._actorsChangeId = null;
        this._timeoutId.forEach((timeoutId) => {
            clearTimeout(timeoutId);
        });
        this._timeoutId = [];
        this._actors = null;
    }
}
