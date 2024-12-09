import {JsonPipe, NgClass} from '@angular/common';
import {Component, signal, WritableSignal} from '@angular/core';
import {UntypedFormGroup, UntypedFormControl, ReactiveFormsModule} from '@angular/forms';


import {NgxDateFormat, NgxTimelineEvent, NgxTimelineEventChangeSide, NgxTimelineEventGroup, NgxTimelineModule, NgxTimelineOrientation} from 'ngx-timeline';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [
        JsonPipe,
        NgClass,
        NgxTimelineModule,
        ReactiveFormsModule,
    ]
})
export class AppComponent {
  title = 'demo-app';
  events: WritableSignal<NgxTimelineEvent[]> = signal([]);
  form: UntypedFormGroup;
  ngxDateFormat = NgxDateFormat;
  virtualScrollItemSize: WritableSignal<number> = signal(160);
  virtualScrollMaxBufferPx: WritableSignal<number> = signal(2160);
  virtualScrollMinBufferPx: WritableSignal<number> = signal(1080);

  configurations = [
    {
      label: 'Language code',
      formControlName: 'langCode',
      options: [
        {name: 'English', value: 'en'},
        {name: 'French', value: 'fr'},
        {name: 'German', value: 'de'},
        {name: 'Spanish', value: 'es'},
        {name: 'Italian', value: 'it'},
        {name: 'Slovenian', value: 'sl'},
        {name: 'Turkish', value: 'tr'},
        {name: 'Polish', value: 'pl'},
        {name: 'Portuguese', value: 'pt'},
        {name: 'Russian', value: 'ru'}
      ]
    },
    {
      label: 'Enable animation',
      formControlName: 'enableAnimation',
      options: [
        {name: 'Enable animation', value: true},
        {name: 'Disable animation', value: false}
      ]
    },
    {
      label: 'Reverse Order',
      formControlName: 'reverseOrder',
      options: [
        {name: 'Normal Time Order (older first)', value: false},
        {name: 'Reverse Time Order (newer first)', value: true}
      ]
    },
    {
      label: 'Custom class',
      formControlName: 'customClass',
      options: [
        {name: 'No Custom Class', value: false},
        {name: 'Custom Class', value: true}
      ]
    },
    {
      label: 'Group events by',
      formControlName: 'groupEvent',
      options: [
        {name: 'Month Year', value: NgxTimelineEventGroup.MONTH_YEAR},
        {name: 'Day Month Year', value: NgxTimelineEventGroup.DAY_MONTH_YEAR},
        {name: 'Year', value: NgxTimelineEventGroup.YEAR}
      ]
    },
    {
      label: 'Change event side',
      formControlName: 'changeSide',
      options: [
        {name: 'All', value: NgxTimelineEventChangeSide.ALL},
        {name: 'All in group', value: NgxTimelineEventChangeSide.ALL_IN_GROUP},
        {name: 'On different day in group', value: NgxTimelineEventChangeSide.ON_DIFFERENT_DAY_IN_GROUP},
        {name: 'On different hours, minutes and seconds in group', value: NgxTimelineEventChangeSide.ON_DIFFERENT_HMS_IN_GROUP},
        {name: 'On different month in group', value: NgxTimelineEventChangeSide.ON_DIFFERENT_MONTH_IN_GROUP}
      ]
    },
    {
      label: 'Orientation',
      formControlName: 'orientation',
      options: [
        {name: 'Vertical', value: NgxTimelineOrientation.VERTICAL},
        {name: 'Horizontal', value: NgxTimelineOrientation.HORIZONTAL}
      ]
    },
    {
      label: 'Date instant custom template',
      formControlName: 'dateInstantCustomTemplate',
      options: [
        {name: 'No Custom template', value: false},
        {name: 'Custom Date Instant Template', value: true}
      ]
    },
    {
      label: 'Event custom template',
      formControlName: 'eventCustomTemplate',
      options: [
        {name: 'No Custom template', value: false},
        {name: 'Custom Event Template', value: true}
      ]
    },
    {
      label: 'Inner event custom template',
      formControlName: 'innerEventCustomTemplate',
      options: [
        {name: 'No Custom template', value: false},
        {name: 'Custom Inner Event Template', value: true}
      ]
    },
    {
      label: 'Event description custom template',
      formControlName: 'eventDescriptionCustomTemplate',
      options: [
        {name: 'No Custom template', value: false},
        {name: 'Custom Description Event Template', value: true}
      ]
    },
    {
      label: 'Center icon custom template',
      formControlName: 'centerIconCustomTemplate',
      options: [
        {name: 'No Custom Template', value: false},
        {name: 'Custom Icon Template', value: true}
      ]
    },
    {
      label: 'Period custom template',
      formControlName: 'periodCustomTemplate',
      options: [
        {name: 'No Custom Template', value: false},
        {name: 'Custom Period Template', value: true}
      ]
    },
    {
      label: 'Click emitter',
      formControlName: 'clickEmitter',
      options: [
        {name: 'No emitter', value: false},
        {name: 'Handle click (open console)', value: true}
      ]
    },
    {
      label: 'Custom Theme',
      formControlName: 'customTheme',
      options: [
        {name: 'No custom theme', value: false},
        {name: 'Custom theme', value: true}
      ]
    },
    {
      label: 'Virtual Scrolling',
      formControlName: 'virtualScrolling',
      options: [
        {name: 'No virtual scrolling', value: false},
        {name: 'virtual scrolling', value: true}
      ]
    }
  ];

  constructor() {
    this.form = new UntypedFormGroup({});
    this.configurations.forEach(configuration =>
      this.form.addControl(configuration.formControlName, new UntypedFormControl(configuration.options[0].value)));
    this.form.get('virtualScrolling')!.valueChanges.subscribe((value: boolean) => {
      if (value) {
        this.initEventsVirtual();
        let orientation: NgxTimelineOrientation = this.form.get('orientation').value;
        this.adjustVirtualScrollOrientation(orientation);
      } else {
        this.initEvents();
      }
    });
    this.form.get('orientation')!.valueChanges.subscribe((value: NgxTimelineOrientation) => {
      let isVirtualScrollingEnabled = this.form.get('virtualScrolling').value;
      if (isVirtualScrollingEnabled) {
        this.adjustVirtualScrollOrientation(value);
      }
    })
    this.initEvents();
  }

  adjustVirtualScrollOrientation(orientation: NgxTimelineOrientation) {
    if (orientation === NgxTimelineOrientation.HORIZONTAL) {
      const eventComponentWidth = 420;
      const windowWidth = window.innerWidth;
      this.virtualScrollItemSize.set(eventComponentWidth);
      this.virtualScrollMinBufferPx.set(windowWidth);
      this.virtualScrollMaxBufferPx.set(windowWidth * 2);
    } else {
      const eventComponentHeight = 160;
      const windowHeight = window.innerHeight;
      this.virtualScrollItemSize.set(eventComponentHeight);
      this.virtualScrollMinBufferPx.set(windowHeight);
      this.virtualScrollMaxBufferPx.set(windowHeight * 2);
    }
  }

  initEventsVirtual() {
    const today = new Date();
    const newEvents: NgxTimelineEvent[] = [];
    const len = 100_000;
    for (let i = 0; i < len; i++) {
      newEvents.push({
        id: i,
        description: `This is the description of the event ${i}`,
        timestamp: today,
        title: `title ${i}`
      });
    }
    this.events.set(newEvents);
  }

  private initEvents(): void {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const tomorrowPlusOneHour = new Date();
    tomorrowPlusOneHour.setDate(today.getDate() + 1);
    tomorrowPlusOneHour.setHours(today.getHours() + 1);
    const nextMonth = new Date();
    nextMonth.setMonth(today.getMonth() + 1);
    const nextYear = new Date();
    nextYear.setFullYear(today.getFullYear() + 1);

    this.events.set([
      { id: 5, description: 'This is the description of the event 5', timestamp: nextYear, title: 'title 5' },
      { id: 0, description: 'This is the description of the event 0', timestamp: today, title: 'title 0' },
      { id: 1, description: 'This is the description of the event 1', timestamp: tomorrow, title: 'title 1' },
      { id: 2, description: 'This is the description of the event 2', timestamp: today, title: 'title 2' },
      { id: 3, description: 'This is the description of the event 3', timestamp: tomorrow, title: 'title 3' },
      { id: 4, description: 'This is the description of the event 4', timestamp: nextMonth, title: 'title 4', /*itemPosition: NgxTimelineItemPosition.ON_RIGHT */},
    ]);
  }

  handleClick(event: any): void {
    if (event) {
      window.console.log('', event);
    }
  }
}
