import { Observable } from 'data/observable';
import { Color } from 'color';
import { topmost } from 'ui/frame';
import { TNSCoachMarks, TNSCoachMark, ICoachMarkOptions } from 'nativescript-coachmarks';
import * as platform from 'platform';
declare var CGRectMake, UIScreen, UIColor;

export class CoachMarksDemo extends Observable {
  private _coachMarks;
  private _menu;
  private _first;
  private _second;
  private _third;

  constructor(menu: any, first: any, second: any, third: any) {
    super();
    if (platform.isIOS) {
      // this._menu = topmost().ios.controller.visibleViewController.navigationItem.leftBarButtonItems[0].valueForKey('view');
    }
    this._menu = menu;
    this._first = first;
    this._second = second;
    this._third = third;

    TNSCoachMarks.DEBUG = true; // view logs of coach marks setup

    setTimeout(() => {
      new TNSCoachMarks().start(
        this.getMarks(),
        {
          continueLabelText: 'Tap Screen to Continue',
          enableContinueLabel: true,
          skipButtonText: 'Ok, Got It.',
          maxLblWidth: 250
        }
      );
    }, 800);
  }

  public startWithOptions() {
    // configure instance to wire up events
    this._coachMarks = new TNSCoachMarks();
    // required: ensure your desire to setup events
    this._coachMarks.initEvents();
    // wire them up
    this.setupEvents();

    // let options: ICoachMarkOptions = {
    //   continueLabelText: 'Tap Screen for Next Tip',
    //   skipButtonText: 'Exit',
    //   lblSpacing: 15,
    //   maskColor: //UIColor.colorWithRedGreenBlueAlpha(0.30, 0.46, 0.89, .9)
    // };
    // TNSCoachMarks.start(this.getMarks(), options, this._coachMarks);
  }

  private getMarks() {
    let menuPosition = new TNSCoachMark({
      view: this._menu,
      caption: 'menu'
    });
    let firstPosition = new TNSCoachMark({
      view: this._first,
      caption: 'First Button'
    });
    let secondPosition = new TNSCoachMark({
      view: this._second,
      caption: 'Second Button'
    });
    let thirdPosition = new TNSCoachMark({
      view: this._third,
      caption: 'Third Button'
    });

    return [
      menuPosition,
      firstPosition,
      secondPosition,
      thirdPosition
    ];
  }

  private setupEvents() {
    this._coachMarks.events.on('navigate', (eventData) => {
      console.log(`navigated to index in demo:`);
      console.log(eventData.data.index);
      // you can customize buttons and bar at each step
      this.customizeStyle(eventData.data);
    });
    this._coachMarks.events.on('click', (eventData) => {
      console.log(`clicked at index in demo:`);
      console.log(eventData.data);
    });
    this._coachMarks.events.on('cleanup', (eventData) => {
      console.log(`ready to cleanup in demo.`);
      this._coachMarks = undefined;
    });
  }

  private customizeStyle(data: any) {
    // console.log(data.instance.arrowImage.image);
    // could customize the arrowImage at each step 
    // data.instance.arrowImage.image = UIImage.imageNamed('someimage.png');
    // console.log(data.instance.btnSkipCoach);
    // console.log(data.instance.lblCaption);
    // console.log(data.instance.lblContinue);

    if (data.instance.lblContinue) {
      // only available when 'ready' is called
      // it disappears after the first tap and advance to next step
      //   let labelContinue = data.instance.lblContinue.frame;
      // data.instance.lblContinue.frame = CGRectMake(labelContinue.origin.x, labelContinue.origin.y - 20, labelContinue.size.width, labelContinue.size.height + 20);
      //   data.instance.lblContinue.backgroundColor = new Color('#FFE108').ios;

      // custom caption color
      //  data.instance.lblCaption.textColor = new Color('#FFE108').ios;

      // customize skip button
      // let btnSkip = data.instance.btnSkipCoach.frame;
      // data.instance.btnSkipCoach.frame = CGRectMake(btnSkip.origin.x, btnSkip.origin.y - 20, btnSkip.size.width, btnSkip.size.height + 20);
    }
  }
}
