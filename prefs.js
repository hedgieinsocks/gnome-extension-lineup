'use strict';


const {Adw, Gio, Gtk} = imports.gi;
const ExtensionUtils = imports.misc.extensionUtils;


function init() {
}


function fillPreferencesWindow(window) {
    const settings = ExtensionUtils.getSettings();

    const page = new Adw.PreferencesPage();
    const group = new Adw.PreferencesGroup();
    page.add(group);

    const row = new Adw.ActionRow({
        title: 'Indicator Width',
        subtitle: 'Custom wide (>60px) indicators are not affected',
    });
    group.add(row);

    const adjustment = new Gtk.Adjustment({
        value: settings.get_int('indicator-width'),
        lower: 40,
        upper: 51,
        step_increment: 1,
    });

    const spinButton = new Gtk.SpinButton({
        adjustment,
        numeric: true,
        valign: Gtk.Align.CENTER,
        halign: Gtk.Align.END,
    });

    settings.bind(
        'indicator-width',
        spinButton.get_adjustment(),
        'value',
        Gio.SettingsBindFlags.DEFAULT
    );

    row.add_suffix(spinButton);
    row.activatable_widget = spinButton;

    window.add(page);
}
