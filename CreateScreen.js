import React, {Component} from 'react';
import {
    Text, ScrollView, StyleSheet, DatePickerAndroid, TouchableWithoutFeedback, View,TextInput,
} from 'react-native';
import {
    InputWithLabel,
    PickerWithLabel,
    AppButton,
  } from './UI';

let SQLite = require('react-native-sqlite-storage');
let languagesAvailable = ['English','Malay','Mandarin','Cantonese','Japanese', 'Korean'];

Date.prototype.formatted = function() {
    let day = this.getDay();
    let date = this.getDate();
    let month = this.getMonth();
    let year = this.getFullYear();
    let daysText = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    let monthsText = [
      'Jan','Feb','Mar','Apr','May','Jun',
      'Jul','Aug','Sep','Oct','Nov','Dec'
    ];
  
    return `${daysText[day]}, ${monthsText[month]} ${date}, ${year}`;
  }

export default class CreateScreen extends Component{
    static navigationOptions = {
        title: 'Add Movie',
      };
    constructor(props){
        super(props)

        this.state = {
            title: '',
            language: '',
            release: new Date(),
            dateText: '',
        }

        this._insert = this._insert.bind(this);

        this.db = SQLite.openDatabase({name: 'moviedb', createFromLocation : '~moviedb.sqlite'}, this.openDb, this.errorDb);
    }

    openDb() {
        console.log('Database opened');
    }
  
    errorDb(err) {
        console.log('SQL Error: ' + err);
    }

    _insert() {
        this.db.transaction((tx) => {
          tx.executeSql('INSERT INTO movies(title,language,release_date) VALUES(?,?,?)', [
            this.state.title,
            this.state.language,
            this.state.release,
          ]);
        });
    
        this.props.navigation.getParam('refresh')();
        this.props.navigation.goBack();
      }

      openDatePicker = async () => {
        try {
          const {action, year, month, day} = await DatePickerAndroid.open({
            date: this.state.release,
            minDate: new Date(2000, 0, 1),
            maxDate: new Date(2099, 11, 31),
            mode: 'calendar', // try also with `spinner`
          });
          if (action !== DatePickerAndroid.dismissedAction) {
            // Selected year, month (0-11), day
            let selectedDate = new Date(year, month, day);
    
            this.setState({
              release: selectedDate,
              dateText: selectedDate.formatted(),
            });
          }
        } catch ({code, message}) {
          console.warn('Cannot open date picker', message);
        }
      }

    render(){
        return(
            <ScrollView style={styles.container}>
                <InputWithLabel style={styles.input}
                    label={'Title'}
                    value={this.state.title}
                    onChangeText={(title) => {this.setState({title})}}
                    orientation={'vertical'}
                />

                <PickerWithLabel style={styles.picker}
                    label={'Languages'}
                    items={languagesAvailable}
                    mode={'dialog'}
                    value={this.state.language}
                    onValueChange={(itemValue, itemIndex) => {
                        this.setState({language: itemValue})
                    }}
                    orientation={'vertical'}
                    textStyle={{fontSize: 24}}
                />
                
                <TouchableWithoutFeedback
                 onPress={ this.openDatePicker }
                 >
                    <View>
                        <TextInput
                        style={styles.input}
                        value={this.state.dateText}
                        placeholder='Release Date'
                        editable={false}
                        underlineColorAndroid={'transparent'}
                        />
                    </View>
                    </TouchableWithoutFeedback>

                <AppButton style={styles.button}
                    title={'Save'}
                    theme={'primary'}
                    onPress={this._insert}
                />

      </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#fff',
    },
    input: {
      fontSize: 16,
      color: '#000099',
      marginTop: 10,
      marginBottom: 10,
    },
    picker: {
      color: '#000099',
      marginTop: 10,
      marginBottom: 10,
    },
    button: {
      marginTop: 10,
      marginBottom: 10,
    },
  });