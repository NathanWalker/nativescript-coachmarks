import * as observable from 'data/observable';
import * as pages from 'ui/page';
import { CoachMarksDemo } from './main-view-model';
import * as platform from 'platform';
// Event handler for Page "loaded" event attached in main-page.xml
export function pageLoaded(args: observable.EventData) {
    // Get the event sender
    var page = <pages.Page>args.object;
    if (platform.isIOS) {
        page.bindingContext = new CoachMarksDemo(
            page.getViewById('first'),
            page.getViewById('second'),
            page.getViewById('third')
        );
    } else {
        page.bindingContext = new CoachMarksDemo(
            page.getViewById('menu'),
            page.getViewById('first'),
            page.getViewById('second'),
            page.getViewById('third')
        );
    }
}