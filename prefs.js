'use strict';


const {Adw, Gio, Gtk} = imports.gi;
const ExtensionUtils = imports.misc.extensionUtils;

const styles = ['wide', 'narrow'];


function init() {
}


function fillPreferencesWindow(window) {
    const settings = ExtensionUtils.getSettings();

    const page = new Adw.PreferencesPage();
    const group = new Adw.PreferencesGroup();
    page.add(group);

    const row = new Adw.ActionRow({
        title: 'Indicator Style',
        subtitle: 'Custom wide (>50) indicators are not affected',
    });
    group.add(row);

    const dropdown = new Gtk.DropDown({
        valign: Gtk.Align.CENTER,
        model: Gtk.StringList.new(styles),
        selected: settings.get_string('indicator-style'),
    });

    settings.bind(
        'indicator-style',
        dropdown,
        'selected',
        Gio.SettingsBindFlags.DEFAULT
    );

    row.add_suffix(dropdown);
    row.activatable_widget = dropdown;

    window.add(page);
}
