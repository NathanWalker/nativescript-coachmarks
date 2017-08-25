import {Observable, EventData} from 'tns-core-modules/data/observable';
import {topmost} from 'tns-core-modules/ui/frame';
import * as appSettings from 'tns-core-modules/application-settings';

declare var MPCoachMarks: any, CGRectMake: any, UIScreen: any, SHAPE_CIRCLE: any, LABEL_POSITION_BOTTOM: any, LABEL_ALIGNMENT_RIGHT: any, SHAPE_SQUARE: any, NSNumber: any, NSDictionary: any, NSMutableDictionary: any, MaskShape: any, LabelPosition: any, LabelAligment: any, NSValue: any, ContinueLocation: any, NSUserDefaults, MPCoachMarksViewDelegate;

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
  position: any;
  caption: string;
  shape?: number;
  labelPosition?: number;
  labelAlignment?: number;
  showArrow?: boolean;
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

  public static SHAPES: ICoachMarkShape = {
    DEFAULT: MaskShape.DEFAULT,
    CIRCLE: MaskShape.SHAPE_CIRCLE,
    SQUARE: MaskShape.SHAPE_SQUARE
  }

  public static LABEL_POSITIONS: ICoachMarkLabelPosition = {
    BOTTOM: LabelPosition.LABEL_POSITION_BOTTOM,
    LEFT: LabelPosition.LABEL_POSITION_LEFT,
    TOP: LabelPosition.LABEL_POSITION_TOP,
    RIGHT: LabelPosition.LABEL_POSITION_RIGHT,
    RIGHT_BOTTOM: LabelPosition.LABEL_POSITION_RIGHT_BOTTOM
  }

  public static LABEL_ALIGNMENTS: ICoachMarkLabelAlignment = {
    CENTER: LabelAligment.LABEL_ALIGNMENT_CENTER,
    LEFT: LabelAligment.LABEL_ALIGNMENT_LEFT,
    RIGHT: LabelAligment.LABEL_ALIGNMENT_RIGHT
  }

  constructor(model?: ITNSCoachMark) {
    if (model) {
      for (let key in model) {
        this[key] = model[key];
      }
    }
  }
}

export class TNSCoachMarks extends NSObject {
  public static ObjCProtocols = [MPCoachMarksViewDelegate];

  public static APP_SETTINGS_KEY: string = 'TNSCoachMarks';
  public static DEBUG: boolean = false;

  public static CONTINUE_LOCATIONS: ICONTINUE_LOCATION = {
    TOP: ContinueLocation.LOCATION_TOP,
    CENTER: ContinueLocation.LOCATION_CENTER,
    BOTTOM: ContinueLocation.LOCATION_BOTTOM
  };

  public events: Observable;  
  private _willNavigateEvent: any;
  private _navigateEvent: any;
  private _clickEvent: any;
  private _cleanupEvent: any;

  public static start(marks: Array<TNSCoachMark>, options?: ICoachMarkOptions, instance?: TNSCoachMarks) {
    if (TNSCoachMarks.DEBUG)
      console.log('TNSCoachMarks start...');
 
    // Setup coach marks
    let coachMarks = [];

    for (let mark of marks) {
      if (TNSCoachMarks.DEBUG)
        console.log(`Setting up mark --`);
      
      let markObj: any = {
        rect: NSValue.valueWithCGRect(mark.position),
        caption: mark.caption
      };
      if (mark.shape)
        markObj.shape = NSNumber.numberWithInt(mark.shape);
      if (mark.labelPosition)
        markObj.position = NSNumber.numberWithInt(mark.labelPosition);
      if (mark.labelAlignment)
        markObj.alignment = NSNumber.numberWithInt(mark.labelAlignment);
      if (mark.showArrow)
        markObj.showArrow = NSNumber.numberWithBool(mark.showArrow);

      let markDictionary = NSDictionary.dictionaryWithDictionary(markObj); 
      if (TNSCoachMarks.DEBUG)
        console.log(`Adding mark with caption: ${markObj.caption}`);
      coachMarks.push(markDictionary);
    }    
    
    if (TNSCoachMarks.DEBUG) {
      console.log(`Total marks: ${coachMarks.length}`);
    }

    let mpCoachMarks = MPCoachMarks.alloc().initWithFrameCoachMarks(topmost().ios.controller.view.bounds, coachMarks);
    topmost().ios.controller.view.addSubview(mpCoachMarks);
  
    // options 
    if (options) {
      if (typeof options.enableContinueLabel !== 'undefined')
        mpCoachMarks.enableContinueLabel = options.enableContinueLabel;
      
      if (typeof options.enableSkipButton !== 'undefined')
        mpCoachMarks.enableSkipButton = options.enableSkipButton;
      
      if (typeof options.continueLabelText !== 'undefined')
        mpCoachMarks.continueLabelText = options.continueLabelText;
      
      if (typeof options.skipButtonText !== 'undefined')
        mpCoachMarks.skipButtonText = options.skipButtonText;
      
      if (typeof options.animationDuration !== 'undefined')
        mpCoachMarks.animationDuration = options.animationDuration;
      
      if (typeof options.continueLocation !== 'undefined')
        mpCoachMarks.continueLocation = options.continueLocation;
      
      if (typeof options.lblSpacing !== 'undefined')
        mpCoachMarks.lblSpacing = options.lblSpacing;
      
      if (typeof options.cutoutRadius !== 'undefined')
        mpCoachMarks.cutoutRadius = options.cutoutRadius;
      
      if (typeof options.maskColor !== 'undefined')
        mpCoachMarks.maskColor = options.maskColor;
      
      if (typeof options.maxLblWidth !== 'undefined')
        mpCoachMarks.maxLblWidth = options.maxLblWidth;
      
      if (options.persist)
        TNSCoachMarks.PERSIST();
    }   

    if (instance) {
      mpCoachMarks.delegate = instance;
    }
    
    mpCoachMarks.start();
  }

  public static HAS_SHOWN(): boolean {
    return appSettings.getBoolean(TNSCoachMarks.APP_SETTINGS_KEY, false);
  }

  public static PERSIST() {
    if (!TNSCoachMarks.HAS_SHOWN()) {
      // Don't show again
      appSettings.setBoolean(TNSCoachMarks.APP_SETTINGS_KEY, true);
    }
  }

  public static RESET() {
    appSettings.setBoolean(TNSCoachMarks.APP_SETTINGS_KEY, false);
  }

  public initEvents() {
    this.events = new Observable();
    this._willNavigateEvent = {
      eventName: 'willNavigate',
      object: this,
      data: {}
    };
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

  // Delegate Methods (if instance is used)
  public coachMarksViewWillNavigateToIndex(coachMarks: any, index: number) {
    if (TNSCoachMarks.DEBUG)
      console.log(`will navigate to index: ${index}`);
    
    if (this.events) {
      this._willNavigateEvent.data = {
        instance: coachMarks,
        index: index
      }
      this.events.notify(this._willNavigateEvent);
    }
  }

  public coachMarksViewDidNavigateToIndex(coachMarks: any, index: number) {
    if (TNSCoachMarks.DEBUG)
      console.log(`navigated to index: ${index}`);
    
    if (this.events) {
      this._navigateEvent.data = {
        instance: coachMarks,
        index: index
      }
      this.events.notify(this._navigateEvent);
    }
  }

  public coachMarksViewDidClickedAtIndex(coachMarks: any, index: number) {
    if (TNSCoachMarks.DEBUG)
      console.log(`coachmarks did click item at step index: ${index}`);
    
    if (this.events) {
      this._clickEvent.data = {
        instance: coachMarks,
        index: index
      }
      this.events.notify(this._clickEvent);
    }
  }

  public coachMarksViewDidCleanup(coachMarks: any) {
    if (TNSCoachMarks.DEBUG)
      console.log(`coachmarks cleaned up! clear your instances if you have any.`);
    
    if (this.events) {
      this.events.notify(this._cleanupEvent);
    }  
  }
}