import React, { Component } from 'react';
import { Text, View, ScrollView, StyleSheet, Switch, Button, Platform, Modal } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colorGaztaroaClaro, colorGaztaroaOscuro } from '../comun/comun';
import * as Calendar from 'expo-calendar';
 
class PruebaEsfuerzo extends Component {
 
    constructor(props) {
        super(props);
        this.state = {
            edad: 18,
            federado: false,
            fecha: new Date(),
            showdate: false,
            showtime: false,
            showModal: false
        }
    }
 
    toggleModal() {
        this.setState({showModal: !this.state.showModal});
    }

    resetForm() {
        this.setState({
            edad: 18,
            federado: false,
            fecha: new Date(),
            showModal: false
        });
    }

    gestionarReserva() {
        console.log(JSON.stringify(this.state));
        this.addCalendario();
        this.toggleModal();
    }
 
    seleccionarFecha = (event, selectedDate) => {
        if (selectedDate==undefined){
          selectedDate=new Date();
        }
        this.setState({fecha: selectedDate, showdate:false, showtime:false})
      };

    addCalendario = async () => {

        const { status } = await Calendar.requestCalendarPermissionsAsync();

        if (status === 'granted') {

            const calendarios = await Calendar.getCalendarsAsync();
            const calendarioExpo = calendarios.filter(calendario => calendario.source.name === 'Expo Calendar');

            let calendarioExpoID = 0;
            if (calendarioExpo.length > 0) {
                calendarioExpoID = calendarioExpo[0].id

            } else {
                console.log("No existe ningún Expo Calendar")
                calendarioExpoID = await this.createCalendar();
            }
            
            await Calendar.createEventAsync(calendarioExpoID, {
                startDate: new Date(this.state.fecha),
                endDate: new Date(this.calcularFin()),
                title: "Prueba de esfuerzo"
            })
        }
    }

    calcularFin = () => {
        const fecha = this.state.fecha
        const fecha_parte = fecha.split("T")
        const fecha_parte_2 = fecha_parte[1].split(":")
        const fecha_def = parseInt(fecha_parte_2[0]) + 1
        let aux = null
        fecha_parte_2.forEach((valor, indice) => {
            if (indice > 0) {
                aux = aux + ":" + valor
            } else {
                aux = fecha_def
            }
        });
        return (fecha_parte[0] + "T" + aux)
    }

    getDefaultCalendarSource = async () => {
        const calendars = await Calendar.getCalendarsAsync();
        const defaultCalendars = calendars.filter(each => each.source.name === 'Default');
        return defaultCalendars[0].source;
    }

    createCalendar = async () => {
        const defaultCalendarSource =
            Platform.OS === 'ios'
                ? await getDefaultCalendarSource()
                : { isLocalAccount: true, name: 'Expo Calendar' };
        const newCalendarID = await Calendar.createCalendarAsync({
            title: 'Expo Calendar',
            color: 'blue',
            entityType: Calendar.EntityTypes.EVENT,
            sourceId: defaultCalendarSource.id,
            source: defaultCalendarSource,
            name: 'internalCalendarName',
            ownerAccount: 'personal',
            accessLevel: Calendar.CalendarAccessLevel.OWNER,
        });
        return newCalendarID
    }
 
    render() {
        return(
        <ScrollView>
            <View style={styles.formRow}>
                <Text style={styles.formLabel}>Edad</Text>
                <Picker
                    style={styles.formItem}
                    selectedValue={this.state.edad}
                    onValueChange={(itemValue, itemIndex) => this.setState({edad: itemValue})}>
                    <Picker.Item label="< 20" value="< 20" />
                    <Picker.Item label="20 - 30" value="20 - 30" />
                    <Picker.Item label="31 - 40" value="31 - 40" />
                    <Picker.Item label="41 - 50" value="41 - 50" />
                    <Picker.Item label="51 - 60" value="51 - 60" />
                    <Picker.Item label="> 60" value="> 60" />
                </Picker>
            </View>
 
            <View style={styles.formRow}>
                <Text style={styles.formLabel}>Federado/No-federado?</Text>
                <Switch
                    style={styles.formItem}
                    value={this.state.federado}
                    trackColor={colorGaztaroaOscuro}
                    onValueChange={(value) => this.setState({federado: value})}>
                </Switch>
            </View>
 
            <View style={styles.formRow}>
                <Text style={styles.formLabel}>Día y hora</Text>
                <Button
                  onPress={() => this.setState({showdate: true})}
                  title="Calendario"
                  color={colorGaztaroaClaro}
                  accessibilityLabel="Gestionar reserva..."
                  />
                {this.state.showdate && <DateTimePicker
                    style={{flex: 2, marginRight: 20}}
                    value={this.state.fecha}
                    mode='date'
                    display="default"
                    onChange={this.seleccionarFecha}
                />}
                <Button
                  onPress={() => this.setState({showtime: true})}
                  title="Hora"
                  color={colorGaztaroaOscuro}
                  accessibilityLabel="Gestionar reserva..."
                  />
                {this.state.showtime && <DateTimePicker
                    style={{flex: 2, marginRight: 20}}
                    value={this.state.fecha}
                    mode='time'
                    display="default"
                    onChange={this.seleccionarFecha}
                />}
            </View>
            <View style={styles.formRow}>
                <Button
                    onPress={() => this.gestionarReserva()}
                    title="Reservar"
                    color={colorGaztaroaOscuro}
                    accessibilityLabel="Gestionar reserva..."
                    />
            </View>
            <Modal 
                animationType = {"slide"} 
                transparent = {false}
                visible = {this.state.showModal}
                onDismiss = {() => {this.toggleModal(); this.resetForm();}}
                onRequestClose = {() => {this.toggleModal(); this.resetForm();}}>
                <View style = {styles.modal}>
                    <Text style = {styles.modalTitle}>Detalle de la reserva</Text>
                    <Text style = {styles.modalText}>Edad: {this.state.edad}</Text>
                    <Text style = {styles.modalText}>Federado?: {this.state.federado ? 'Si' : 'No'}</Text>
                    <Text style={styles.modalText}>Día y hora: {this.state.fecha.getDate()}/{this.state.fecha.getMonth()+1}/{this.state.fecha.getFullYear()}-{this.state.fecha.getHours()}:{this.state.fecha.getMinutes()}:{this.state.fecha.getSeconds()}</Text>
                    <Button 
                        onPress = {() =>{this.toggleModal(); this.resetForm();}}
                        color={colorGaztaroaOscuro}
                        title="Cerrar" 
                    />
                </View>
            </Modal>
        </ScrollView>
        );
    }
};
 
const styles = StyleSheet.create({
    formRow: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
      flexDirection: 'row',
      margin: 20
    },
    formLabel: {
        fontSize: 18,
        flex: 2
    },
    formItem: {
        flex: 1
    },
    modal: {
        justifyContent: 'center',
        margin: 20
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        backgroundColor: '#512DA8',
        textAlign: 'center',
        color: 'white',
        marginBottom: 20
    },
    modalText: {
        fontSize: 18,
        margin: 10
    }
});
 
export default PruebaEsfuerzo;