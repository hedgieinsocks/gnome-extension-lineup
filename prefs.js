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

    // Indicator Width
    const rowWidth = new Adw.ActionRow({
        title: 'Indicator Width',
        subtitle: 'Select desired indicator width',
    });
    group.add(rowWidth);

    const widthAdjustment = new Gtk.Adjustment({
        value: settings.get_int('indicator-width'),
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
        'indicator-width',
        widthSpinButton.get_adjustment(),
        'value',
        Gio.SettingsBindFlags.DEFAULT
    );

    rowWidth.add_suffix(widthSpinButton);
    rowWidth.activatable_widget = widthSpinButton;

    // Min Width
    const rowMinWidth = new Adw.ActionRow({
        title: 'Minimal Width',
        subtitle: 'Smaller indicators will not be resized',
    });
    group.add(rowMinWidth);

    const widthMinAdjustment = new Gtk.Adjustment({
        value: settings.get_int('min-width'),
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
        'min-width',
        widthMinSpinButton.get_adjustment(),
        'value',
        Gio.SettingsBindFlags.DEFAULT
    );

    rowMinWidth.add_suffix(widthMinSpinButton);
    rowMinWidth.activatable_widget = widthMinSpinButton;

    // Max Width
    const rowMaxWidth = new Adw.ActionRow({
        title: 'Maximal Width',
        subtitle: 'Bigger indicators will not be resized',
    });
    group.add(rowMaxWidth);

    const widthMaxAdjustment = new Gtk.Adjustment({
        value: settings.get_int('max-width'),
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
        'max-width',
        widthMaxSpinButton.get_adjustment(),
        'value',
        Gio.SettingsBindFlags.DEFAULT
    );

    rowMaxWidth.add_suffix(widthMaxSpinButton);
    rowMaxWidth.activatable_widget = widthMaxSpinButton

    window.add(page);
}
