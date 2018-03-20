import { Observable } from 'tns-core-modules/data/observable';
export interface ICoachMarkOptions {
    enableContinueLabel?: boolean;
    enableSkipButton?: boolean;
    continueLabelText?: string;
    skipButtonText?: string;
    animationDuration?: number;
    continueLocation?: number;
    lblSpacing?: number;
    cutoutRadius?: number;
    maskColor?: any;
    maxLblWidth?: number;
    persist?: boolean;
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
export declare class TNSCoachMark {
    position: any;
    caption: string;
    shape: number;
    labelPosition: number;
    labelAlignment: number;
    showArrow: boolean;
    static SHAPES: ICoachMarkShape;
    static LABEL_POSITIONS: ICoachMarkLabelPosition;
    static LABEL_ALIGNMENTS: ICoachMarkLabelAlignment;
    constructor(model?: ITNSCoachMark);
}
export declare class TNSCoachMarks {
    static APP_SETTINGS_KEY: string;
    static DEBUG: boolean;
    static CONTINUE_LOCATIONS: ICONTINUE_LOCATION;
    events: Observable;
    private _willNavigateEvent;
    private _navigateEvent;
    private _clickEvent;
    private _cleanupEvent;
    static start(marks: Array<TNSCoachMark>, options?: ICoachMarkOptions, instance?: TNSCoachMarks): void;
    static HAS_SHOWN(): boolean;
    static PERSIST(): void;
    static RESET(): void;
    initEvents(): void;
    coachMarksViewWillNavigateToIndex(coachMarks: any, index: number): void;
    coachMarksViewDidNavigateToIndex(coachMarks: any, index: number): void;
    coachMarksViewDidClickedAtIndex(coachMarks: any, index: number): void;
    coachMarksViewDidCleanup(coachMarks: any): void;
}
