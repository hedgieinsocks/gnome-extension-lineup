import Adw from "gi://Adw";
import Gio from "gi://Gio";
import Gtk from "gi://Gtk";
import { ExtensionPreferences } from "resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js";

export default class LineupPreferences extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        const settings = this.getSettings();
        const page = new Adw.PreferencesPage();
        const groupMain = new Adw.PreferencesGroup();
        const groupTarget = new Adw.PreferencesGroup({
            title: "Target Group",
            description: "Choose which indicators to resize",
        });
        const groupTweak = new Adw.PreferencesGroup({
            title: "Advanced Tweaks",
            description: "Fine-tuning for specific cases",
        });
        page.add(groupMain);
        page.add(groupTarget);
        page.add(groupTweak);

        // Indicator Width
        const rowWidth = new Adw.ActionRow({
            title: "Indicator Width",
            subtitle: "Select desired width for panel indicators",
        });
        groupMain.add(rowWidth);

        const widthAdjustment = new Gtk.Adjustment({
            value: settings.get_int("indicator-width"),
            lower: 40,
            upper: 60,
            step_increment: 1,
        });

        const widthSpinButton = new Gtk.SpinButton({
            adjustment: widthAdjustment,
            numeric: true,
            valign: Gtk.Align.CENTER,
            halign: Gtk.Align.END,
        });

        settings.bind(
            "indicator-width",
            widthSpinButton.get_adjustment(),
            "value",
            Gio.SettingsBindFlags.DEFAULT
        );

        rowWidth.add_suffix(widthSpinButton);
        rowWidth.activatable_widget = widthSpinButton;

        // Min Width
        const rowMinWidth = new Adw.ActionRow({
            title: "Minimal Width",
        });
        groupTarget.add(rowMinWidth);

        const widthMinAdjustment = new Gtk.Adjustment({
            value: settings.get_int("min-width"),
            lower: 40,
            upper: 60,
            step_increment: 1,
        });

        const widthMinSpinButton = new Gtk.SpinButton({
            adjustment: widthMinAdjustment,
            numeric: true,
            valign: Gtk.Align.CENTER,
            halign: Gtk.Align.END,
        });

        settings.bind(
            "min-width",
            widthMinSpinButton.get_adjustment(),
            "value",
            Gio.SettingsBindFlags.DEFAULT
        );

        rowMinWidth.add_suffix(widthMinSpinButton);
        rowMinWidth.activatable_widget = widthMinSpinButton;

        // Max Width
        const rowMaxWidth = new Adw.ActionRow({
            title: "Maximal Width",
        });
        groupTarget.add(rowMaxWidth);

        const widthMaxAdjustment = new Gtk.Adjustment({
            value: settings.get_int("max-width"),
            lower: 40,
            upper: 60,
            step_increment: 1,
        });

        const widthMaxSpinButton = new Gtk.SpinButton({
            adjustment: widthMaxAdjustment,
            numeric: true,
            valign: Gtk.Align.CENTER,
            halign: Gtk.Align.END,
        });

        settings.bind(
            "max-width",
            widthMaxSpinButton.get_adjustment(),
            "value",
            Gio.SettingsBindFlags.DEFAULT
        );

        rowMaxWidth.add_suffix(widthMaxSpinButton);
        rowMaxWidth.activatable_widget = widthMaxSpinButton;

        // Exclude
        const rowExclude = new Adw.ActionRow({
            title: "Exclude",
            subtitle: "Skip indicators whose names contain these keywords",
        });
        groupTweak.add(rowExclude);

        const excludeEntry = new Gtk.Entry({
            placeholder_text: "keyboard clipboard",
            text: settings.get_string("exclude-words"),
            valign: Gtk.Align.CENTER,
            hexpand: true,
        });

        settings.bind(
            "exclude-words",
            excludeEntry,
            "text",
            Gio.SettingsBindFlags.DEFAULT
        );

        rowExclude.add_suffix(excludeEntry);
        rowExclude.activatable_widget = excludeEntry;

        // Resize Delay
        const rowDelay = new Adw.ActionRow({
            title: "Delay",
            subtitle:
                "Increase if some indicators glitch or refuse to follow the rules",
        });
        groupTweak.add(rowDelay);

        const delayAdjustment = new Gtk.Adjustment({
            value: settings.get_int("delay-sec"),
            lower: 0,
            upper: 5,
            step_increment: 1,
        });

        const delaySpinButton = new Gtk.SpinButton({
            adjustment: delayAdjustment,
            numeric: true,
            valign: Gtk.Align.CENTER,
            halign: Gtk.Align.END,
        });

        settings.bind(
            "delay-sec",
            delaySpinButton.get_adjustment(),
            "value",
            Gio.SettingsBindFlags.DEFAULT
        );

        rowDelay.add_suffix(delaySpinButton);
        rowDelay.activatable_widget = delaySpinButton;

        window.add(page);
    }
}
