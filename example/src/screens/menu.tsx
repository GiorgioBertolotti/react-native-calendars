import React, {Component} from 'react';
import {Platform, StyleSheet, View, ScrollView, TouchableOpacity as IosTouchableOpacity, Text, Image} from 'react-native';
import {TouchableOpacity as AndroidTouchableOpacity} from 'react-native-gesture-handler';
import {Navigation} from 'react-native-navigation';
import testIDs from '../testIDs';
import appIcon from '../img/app-icon-120x120.png';

const TouchableOpacity = Platform.select({
  ios: IosTouchableOpacity,
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  android: AndroidTouchableOpacity
});

interface Props {
  componentId?: string;
  weekView?: boolean;
}

export default class MenuScreen extends Component<Props> {
  render() {
    return (
      <ScrollView>
        <View style={styles.container} testID={testIDs.menu.CONTAINER}>
          <Image source={appIcon} style={styles.image} />
          <TouchableOpacity
            testID={testIDs.menu.CALENDARS}
            style={styles.menu}
            onPress={this.onCalendarsPress.bind(this)}
          >
            <Text style={styles.menuText}>Calendars</Text>
          </TouchableOpacity>
          <TouchableOpacity
            testID={testIDs.menu.CALENDAR_LIST}
            style={styles.menu}
            onPress={this.onCalendarListPress.bind(this)}
          >
            <Text style={styles.menuText}>Calendar List</Text>
          </TouchableOpacity>
          <TouchableOpacity
            testID={testIDs.menu.HORIZONTAL_LIST}
            style={styles.menu}
            onPress={this.onHorizontalCalendarListPress.bind(this)}
          >
            <Text style={styles.menuText}>Horizontal Calendar List</Text>
          </TouchableOpacity>
          <TouchableOpacity testID={testIDs.menu.AGENDA} style={styles.menu} onPress={this.onAgendaPress.bind(this)}>
            <Text style={styles.menuText}>Agenda</Text>
          </TouchableOpacity>
          <TouchableOpacity
            testID={testIDs.menu.EXPANDABLE_CALENDAR}
            style={styles.menu}
            onPress={this.onExpandablePress.bind(this)}
          >
            <Text style={styles.menuText}>Expandable Calendar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.menu} onPress={this.onTimelinePress.bind(this)}>
            <Text style={styles.menuText}>Timeline Calendar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            testID={testIDs.menu.WEEK_CALENDAR}
            style={styles.menu}
            onPress={this.onWeekPress.bind(this)}
          >
            <Text style={styles.menuText}>Week Calendar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  pushScreen(screen: string, props?: Props) {
    Navigation.push(this.props.componentId, {
      component: {
        name: screen,
        passProps: props,
        options: {
          topBar: {
            title: {
              text: props?.weekView ? 'WeekCalendar' : screen
            },
            backButton: {
              testID: 'back',
              showTitle: false, // iOS only
              color: Platform.OS === 'ios' ? '#2d4150' : undefined
            }
          }
        }
      }
    });
  }

  onCalendarsPress() {
    this.pushScreen('Calendars');
  }

  onCalendarListPress() {
    this.pushScreen('CalendarsList');
  }

  onHorizontalCalendarListPress() {
    this.pushScreen('HorizontalCalendarList');
  }

  onAgendaPress() {
    this.pushScreen('Agenda');
  }

  onExpandablePress() {
    this.pushScreen('ExpandableCalendar');
  }

  onTimelinePress() {
    this.pushScreen('TimelineCalendar');
  }

  onWeekPress() {
    this.pushScreen('ExpandableCalendar', {weekView: true});
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center'
  },
  image: {
    margin: 30,
    width: 90,
    height: 90
  },
  menu: {
    width: 300,
    padding: 10,
    margin: 10,
    // backgroundColor: '#f2F4f5',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#7a92a5'
  },
  menuText: {
    fontSize: 18,
    color: '#2d4150'
  }
});