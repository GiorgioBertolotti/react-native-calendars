// @flow
import XDate from 'xdate';
import constants from '../commons/constants';
import {Event, PackedEvent} from './EventBlock';

type PartialPackedEvent = Event & {index: number};
interface PopulateOptions {
  screenWidth?: number;
  dayStart?: number;
  hourBlockHeight?: number;
  overlapEventsSpacing?: number;
}

export const HOUR_BLOCK_HEIGHT = 100;
const OVERLAP_EVENTS_SPACINGS = 10;

function buildEvent(event: Event & {index: number}, left: number, width: number, {dayStart = 0, hourBlockHeight = HOUR_BLOCK_HEIGHT}: PopulateOptions): PackedEvent {
  const startTime = new XDate(event.start);
  const endTime = event.end ? new XDate(event.end) : new XDate(startTime).addHours(1);

  const dayStartTime = new XDate(startTime).clearTime();

  return {
    ...event,
    top: (dayStartTime.diffHours(startTime) - dayStart) * hourBlockHeight,
    height: startTime.diffHours(endTime) * hourBlockHeight,
    width,
    left
  };
}

function hasCollision(a: Event, b: Event) {
  return a.end > b.start && a.start < b.end;
}

function calcColumnSpan(event: Event, columnIndex: number, columns: Event[][]) {
  let colSpan = 1;

  for (let i = columnIndex + 1; i < columns.length; i++) {
    const column = columns[i];

    const foundCollision = column.find(ev => hasCollision(event, ev));
    if (foundCollision) {
      return colSpan;
    }

    colSpan++;
  }

  return colSpan;
}

function packOverlappingEventGroup(
  columns: PartialPackedEvent[][],
  calculatedEvents: PackedEvent[],
  populateOptions: PopulateOptions
) {
  const {screenWidth = constants.screenWidth, overlapEventsSpacing = OVERLAP_EVENTS_SPACINGS} = populateOptions;
  columns.forEach((column, columnIndex) => {
    column.forEach(event => {
      const columnSpan = calcColumnSpan(event, columnIndex, columns);
      const eventLeft = (columnIndex / columns.length) * screenWidth;
      let eventWidth = screenWidth * (columnSpan / columns.length);

      if (columnIndex + columnSpan <= columns.length -1) {
        eventWidth -= overlapEventsSpacing;
      }

      calculatedEvents.push(buildEvent(event, eventLeft, eventWidth, populateOptions));
    });
  });
}

function populateEvents(_events: Event[], populateOptions: PopulateOptions) {
  let lastEnd: string | null = null;
  let columns: PartialPackedEvent[][] = [];
  const calculatedEvents: PackedEvent[] = [];

  const events: PartialPackedEvent[] = _events
    .map((ev: Event, index: number) => ({...ev, index: index}))
    .sort(function (a: Event, b: Event) {
      if (a.start < b.start) return -1;
      if (a.start > b.start) return 1;
      if (a.end < b.end) return -1;
      if (a.end > b.end) return 1;
      return 0;
    });

  events.forEach(function (ev) {
    // Reset recent overlapping event group and start a new one
    if (lastEnd !== null && ev.start >= lastEnd) {
      packOverlappingEventGroup(columns, calculatedEvents, populateOptions);
      columns = [];
      lastEnd = null;
    }

    // Place current event in the right column where it doesn't overlap
    let placed = false;
    for (let i = 0; i < columns.length; i++) {
      const col = columns[i];
      if (!hasCollision(col[col.length - 1], ev)) {
        col.push(ev);
        placed = true;
        break;
      }
    }

    // If curr event wasn't placed in any of the columns, create a new column for it
    if (!placed) {
      columns.push([ev]);
    }

    if (lastEnd === null || ev.end > lastEnd) {
      lastEnd = ev.end;
    }
  });

  if (columns.length > 0) {
    packOverlappingEventGroup(columns, calculatedEvents, populateOptions);
  }

  return calculatedEvents;
}

export default populateEvents;
