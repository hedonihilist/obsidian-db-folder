import { DEFAULT_SETTINGS } from "helpers/Constants";
import { t } from "lang/helpers";
import { Setting, SliderComponent } from "obsidian";
import { AbstractSettingsHandler, SettingHandlerResponse } from "settings/handlers/AbstractSettingHandler";

const LIMITS = Object.freeze({
    MIN: 5,
    MAX: 25,
    STEP: 1,
});

export class FontSizeHandler extends AbstractSettingsHandler {
    settingTitle = t("settings_font_size_title");
    slider: SliderComponent;
    handle(settingHandlerResponse: SettingHandlerResponse): SettingHandlerResponse {
        const { local, containerEl, view } = settingHandlerResponse;
        if (local) {
            const font_size_promise = async (value: number): Promise<void> => {
                // update settings
                view.diskConfig.updateConfig({ font_size: value });
            };
            // Local settings support
            new Setting(containerEl)
                .setName(this.settingTitle)
                .setDesc(t("settings_font_size_desc"))
                .addSlider((slider) => {
                    this.slider = slider;
                    slider.setDynamicTooltip()
                        .setValue(view.diskConfig.yaml.config.font_size)
                        .setLimits(LIMITS.MIN, LIMITS.MAX, LIMITS.STEP)
                        .onChange(font_size_promise);
                }).addExtraButton((cb) => {
                    cb.setIcon("reset")
                        .setTooltip(t("settings_default_values"))
                        .onClick(async (): Promise<void> => {
                            view.diskConfig.updateConfig({ font_size: DEFAULT_SETTINGS.local_settings.font_size });
                            this.slider.setValue(DEFAULT_SETTINGS.local_settings.font_size);
                        });
                });
        }
        return this.goNext(settingHandlerResponse);
    }
}