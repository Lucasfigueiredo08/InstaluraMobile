import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  FlatList,
  TouchableOpacity,
  TextInput
} from 'react-native';
import InputComentario from './InputComentario';
import Likes from './Likes';
import Comentario from './Comentario';

const width = Dimensions.get('screen').width;

export default class Post extends Component {

  exibeLegenda(foto) {
    if(foto.comentario === '')
      return;

    return <Comentario usuario={foto.loginUsuario}
      texto={foto.comentario} />
  }

  

  render() {
    const { foto, likeCallback, comentarioCallback, verPerfilCallback } = this.props;

    return (
      <View>
        <TouchableOpacity style={styles.cabecalho} onPress={() => verPerfilCallback(foto.id)}>
          <Image source={{uri: foto.urlPerfil}}
              style={styles.fotoDePerfil}/>
          <Text>{foto.loginUsuario}</Text>
        </TouchableOpacity>
        <Image source={{uri: foto.urlFoto}}
            style={styles.foto}/>

        <View style={styles.rodape}>
          <Likes foto={foto} likeCallback={likeCallback}/>
          {this.exibeLegenda(foto)}

          {foto.comentarios.map(comentario =>
            <Comentario key={comentario.id}
                usuario={comentario.login} texto={comentario.texto}/>
          )}

          <InputComentario idFoto={foto.id}
            comentarioCallback={comentarioCallback} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  cabecalho: {
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  fotoDePerfil: {
    marginRight: 10,
    borderRadius: 20,
    width: 40,
    height: 40
  },
  foto: {
    width: width,
    height: width
  },
  rodape: {
    margin: 10
  }
});
