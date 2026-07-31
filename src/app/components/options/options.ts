import { Component, OnInit, signal, OnDestroy, effect } from '@angular/core';
import { RdxButtonDirective } from '@radix-ng/primitives/button';
// form
import {form, FormField, min} from '@angular/forms/signals';
// components
import { Switch } from '../ui/switch/switch';
import { Button } from '../ui/button/button';
import { NumberField } from '../ui/number-field/number-field';
import { Icon } from '../ui/icon/icon';
// liminal-screen
import {
  liminalAPI,
  AppOptions,
  CustomOptions,
  MandatoryOptions,
  UpdateInfo
} from '@liminal-screen/api';


// Declare Tauri globals injected at runtime by Tauri with withGlobalTauri: true.
// Kept minimal — only what the options page needs.
declare global {
  interface Window {
    __TAURI__?: {
      core?: {
        invoke: (cmd: string, args?: Record<string, unknown>) => Promise<unknown>;
      };
    };
  }
}

/** App-specific mandatory options used by this options page.
 *  Mirrors MandatoryOptions but makes numeric fields nullable so they can bind
 *  to Radix NumberFieldInput, and makes optional API fields required.
 */
interface ScreensaverMandatoryOptions {
  startsIn: number | null;
  displayOffIn: number | null;
  requirePassIn: number | null;
  runOnBattery: boolean;
  debug: boolean;
  notificationsEnabled: boolean;
  autostart: boolean;
}

const normalizeNumber = (value: number | undefined | null): number | null =>
  value === undefined ? null : value;

/** App-specific custom options used by this options page. */
interface ScreensaverCustomOptions {
  sensitive: boolean;
  muted: boolean;
  voiceOver: boolean;
  [key: string]: string | number | boolean;
}


@Component({
  selector: 'app-options',
  imports: [ Switch, FormField, Button, NumberField, Icon ],
  templateUrl: './options.html',
  styleUrl: './options.scss',
})
export class Options implements OnInit, OnDestroy {

  private optionsLoaded = signal(false);


  app = signal<AppOptions | null>(null);
  version = signal<string>('');
  isInTauri = signal<boolean>(liminalAPI.isInTauri);
  updateAvailable = signal<boolean>(false);
  updateMessage = signal<string>('Up to date');

  // options
  mandatoryOptions = signal<ScreensaverMandatoryOptions>({
    startsIn: 5.0,
    displayOffIn: 10.0,
    requirePassIn: 0.0,
    runOnBattery: false,
    debug: false,
    notificationsEnabled: false,
    autostart: true

  });
  customOptions = signal<ScreensaverCustomOptions>({
    sensitive: false,
    muted: false,
    voiceOver: false,
  });
  // options forms
  mandatoryOptionsForm = form(this.mandatoryOptions, (schema) => {
    min(schema.startsIn, 1, { message: 'Delay must be at least 1 minute.' });
    min(schema.displayOffIn, 0, { message: 'Display-off timeout cannot be negative. Set to 0 to disable.' });
    min(schema.requirePassIn, 0, { message: 'Password timeout cannot be negative. Set to 0 to disable.' });
  });

  customOptionsForm = form(this.customOptions);

  constructor() {
    effect(() => {
      const mandatory = this.mandatoryOptions();
      const custom = this.customOptions();

      if (!this.optionsLoaded() || mandatory === null) {
        return;
      }

      const payload: MandatoryOptions & { customOptions: CustomOptions } = {
        startsIn: mandatory.startsIn ?? 5.0,
        displayOffIn: mandatory.displayOffIn ?? 10.0,
        requirePassIn: mandatory.requirePassIn ?? 0.0,
        runOnBattery: mandatory.runOnBattery,
        debug: mandatory.debug,
        notificationsEnabled: mandatory.notificationsEnabled,
        autostart: mandatory.autostart,
        customOptions: custom as CustomOptions
      };
      liminalAPI.setOptions(payload)
        .then(() => {
          console.log('OPTIONS UPDATED');
        })
        .catch(err => {
        console.error('Failed to save options', err);
      });
    });
  }

  async ngOnInit(): Promise<void> {
    // CHECK WINDOW NAVIGATOR IF IT CONTAINS LiminalScreen first
    const app = await liminalAPI.getOptions();
    if (app) {
      // set/get custom options (app specific)
      if (Object.keys(app.customOptions).length) { // if any custom option
        console.log('app has custom options already');
        this.customOptions.set(app.customOptions as ScreensaverCustomOptions);
      } else { // set default
        app.customOptions = this.customOptions() as CustomOptions;
        liminalAPI.setOptions(app);
      }
      // setup mandatory options
      this.mandatoryOptions.set({
        startsIn: normalizeNumber(app.startsIn),
        displayOffIn: normalizeNumber(app.displayOffIn),
        requirePassIn: normalizeNumber(app.requirePassIn),
        runOnBattery: app.runOnBattery,
        debug: app.debug,
        notificationsEnabled: app.notificationsEnabled ?? false,
        autostart: app.autostart ?? true
      })
      this.app.set(app);
      this.optionsLoaded.set(true);
    }
    console.log('app', app);
    // get app version
    const version = await liminalAPI.getVersion();
    this.version.set(version);
    liminalAPI.onUpdateAvailable((update: UpdateInfo) => {
      console.log('update?', update);
    });
    // check for updates at start
    this.checkUpdates();
  }

  ngOnDestroy(): void {

  }

  async openUrl(link: string): Promise<void> {
    // @ts-ignore — uses injected Tauri globals (withGlobalTauri: true)
    await liminalAPI.openUrl(link);

  }

  async ask(question: string): Promise<void> {
    await liminalAPI.ask(question);
  }

  async preview(): Promise<void> {
    await liminalAPI.previewScreensaver();
  }

  checkUpdates(): void {
    console.log('checkUpdates');
    liminalAPI.checkForUpdates()
      .then((info: UpdateInfo | null) => {
        if (info) {
          console.log('updateInfo', info);
          this.updateMessage.set('TODO: what info?');
        }
      })
      .catch((e: any) => {
        console.log(e);
        this.updateMessage.set(e);
      })
  }

  async close(): Promise<void> {
    if (!liminalAPI.isInTauri || !window.__TAURI__?.core) {
      return;
    }
    await window.__TAURI__.core.invoke('close_options');
  }

  log(key: any, value: any): void {
    console.log(key, value);
  }
}
