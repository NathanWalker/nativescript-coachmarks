import * as observable from 'data/observable';
import * as pages from 'ui/page';
import {CoachMarksDemo} from './main-view-model';

// Event handler for Page "loaded" event attached in main-page.xml
export function pageLoaded(args: observable.EventData) {
    // Get the event sender
    var page = <pages.Page>args.object;
    page.bindingContext = new CoachMarksDemo(
        page.getViewById('first'),
        page.getViewById('second'),
        page.getViewById('third')
    );
}