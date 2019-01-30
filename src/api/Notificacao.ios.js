import { AlertIOS, AlertAndroid } from 'react-native';

export default class Notificacao{
    static exibe(titulo, mensagem) {
        //AlertAndroid.alert(titulo, mensagem);
        AlertAndroid.alert(titulo, mensagem);
    }
}