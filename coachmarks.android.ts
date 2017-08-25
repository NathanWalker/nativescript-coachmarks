import { Observable, EventData } from 'tns-core-modules/data/observable';
import { topmost } from 'tns-core-modules/ui/frame';
import * as appSettings from 'tns-core-modules/application-settings';
import * as app from 'tns-core-modules/application';
declare const android, com;
export interface ICoachMarkOptions {
    enableContinueLabel?: boolean;  // true
    enableSkipButton?: boolean;     // true
    continueLabelText?: string;     // 'Tap to continue'
    skipButtonText?: string;        // 'Skip'
    animationDuration?: number;     // .3
    continueLocation?: number;      // Bottom
    lblSpacing?: number;            // 35
    cutoutRadius?: number;          // 2
    maskColor?: any;                // 0,0,0 alpha 0.9
    maxLblWidth?: number;           // 230
    persist?: boolean;              // false

}

export interface ICoachMarkShape {
    DEFAULT: number;
    CIRCLE: number;
    SQUARE: number;
}

export interface ICoachMarkLabelPosition {
    BOTTOM: number;
    LEFT: number;
    TOP: number;
    RIGHT: number;
    RIGHT_BOTTOM: number;
}

export interface ICoachMarkLabelAlignment {
    CENTER: number;
    LEFT: number;
    RIGHT: number;
}

export interface ITNSCoachMark {
    position?: any;
    caption?: string;
    shape?: number;
    labelPosition?: number;
    labelAlignment?: number;
    showArrow?: boolean;
    view?: any;
}

export interface ICONTINUE_LOCATION {
    TOP: number;
    CENTER: number;
    BOTTOM: number;
}

export class TNSCoachMark {
    public position: any;
    public caption: string;
    public shape: number;
    public labelPosition: number;
    public labelAlignment: number;
    public showArrow: boolean;
    public view: any;

    constructor(model?: ITNSCoachMark) {
        if (model) {
            for (let key in model) {
                console.log(this[key]);
                this[key] = model[key];
            }
        }
    }
}

export class TNSCoachMarks {

    public static DEBUG: boolean = false;

    public events: Observable;
    private _navigateEvent: any;
    private _clickEvent: any;
    private _cleanupEvent: any;
    private _showCase: any;
    private nextView = 0;
    private marks: any[];

    setTitle(title: string) {
        if (this._showCase) {
            this._showCase.setContentTitle(title);
        }
    }
    setCaption(caption) {
        if (this._showCase) {
            this._showCase.setContentText(caption);
        }
    }
    setButton(buttonText) {
        if (this._showCase) {
            this._showCase.setButtonText(buttonText);
        }
    }

    public start(marks: Array<TNSCoachMark>, options?: ICoachMarkOptions, instance?: TNSCoachMarks) {
        this.marks = marks;

        if (TNSCoachMarks.DEBUG)
            console.log('TNSCoachMarks start...');


        if (TNSCoachMarks.DEBUG) {
            console.log(`Total marks: ${marks.length}`);
        }

        const that = new WeakRef(this);
        this._showCase = new com.github.amlcurran.showcaseview.ShowcaseView.Builder(app.android.foregroundActivity)
            .setTarget(new com.github.amlcurran.showcaseview.targets.ViewTarget(this.marks[this.nextView].view.android))
            .build();

        if (this.marks[this.nextView] && this.marks[this.nextView].caption) {
            this.setCaption(this.marks[this.nextView].caption)
        }

        if (options.skipButtonText) {
            this.setButton(options.skipButtonText)
        }
        this._showCase.setOnShowcaseEventListener(
            new com.github.amlcurran.showcaseview.OnShowcaseEventListener({
                owner: that.get(),
                onShowcaseViewHide: function (showcaseView) {
                }, onShowcaseViewDidHide: function (showcaseView) {
                    if (this.owner.events) {
                        this.owner._cleanupEvent = {
                            eventName: 'cleanup',
                            object: this.owner,
                            data: {}
                        };
                        this.owner.events.notify(this.owner._cleanupEvent);
                    }
                }, onShowcaseViewShow: function (showcaseView) {
                    if (this.owner.marks[this.owner.nextView] && this.owner.marks[this.owner.nextView].caption) {
                        this.owner.setCaption(this.owner.marks[this.owner.nextView].caption)
                    }

                    if (this.owner.events) {
                        this.owner._navigateEvent.data = {
                            instance: this.owner,
                            index: this.owner.nextView
                        }
                        this.owner.events.notify(this.owner._navigateEvent);
                    }
                }, onShowcaseViewTouchBlocked: function (motionEvent) {
                    if (motionEvent.getAction() === android.view.MotionEvent.ACTION_UP) {
                        this.owner.nextView++;
                        if (this.owner.events) {
                            this.owner._clickEvent = {
                                eventName: 'click',
                                object: this.owner,
                                data: {}
                            };
                            this.owner.events.notify(this.owner._clickEvent);
                        }
                        if (this.owner.nextView < this.owner.marks.length) {
                            this.owner._showCase.setTarget(new com.github.amlcurran.showcaseview.targets.ViewTarget(this.owner.marks[this.owner.nextView].view.android))
                            this.owner._showCase.show();
                        } else {
                            this.owner._showCase.hide();
                        }
                    }
                }
            })
        )

    }

    public initEvents() {
        this.events = new Observable();
        this._navigateEvent = {
            eventName: 'navigate',
            object: this,
            data: {}
        };
        this._clickEvent = {
            eventName: 'click',
            object: this,
            data: {}
        };
        this._cleanupEvent = {
            eventName: 'cleanup',
            object: this,
            data: {}
        };
    }

}